const { pool } = require('../database/connection');
const ServicesService = require('./servicesService');

const SLOT_INTERVAL_MINUTES = 30;
const SALON_SCHEDULE = {
  0: null,
  1: { start: '10:00', end: '20:00' },
  2: { start: '10:00', end: '20:00' },
  3: { start: '10:00', end: '20:00' },
  4: { start: '10:00', end: '20:00' },
  5: { start: '10:00', end: '20:00' },
  6: { start: '10:00', end: '14:00' },
};

class BookingEngineError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function padNumber(value) {
  return String(value).padStart(2, '0');
}

function parseDateParts(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateString || ''))) {
    throw new BookingEngineError('La fecha indicada no es válida');
  }

  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

function parseTimeParts(timeString) {
  if (!/^\d{2}:\d{2}$/.test(String(timeString || ''))) {
    throw new BookingEngineError('La hora indicada no es válida');
  }

  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

function createDateTime(dateString, timeString = '00:00') {
  const { year, month, day } = parseDateParts(dateString);
  const { hours, minutes } = parseTimeParts(timeString);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function formatDateKey(date) {
  return [
    date.getFullYear(),
    padNumber(date.getMonth() + 1),
    padNumber(date.getDate()),
  ].join('-');
}

function formatTimeValue(date) {
  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

function getScheduleForDate(dateString) {
  const date = createDateTime(dateString);
  return SALON_SCHEDULE[date.getDay()];
}

function isExpiredAppointment(row) {
  return row.status === 'pending_payment' && row.expires_at && new Date(row.expires_at) < new Date();
}

function overlaps(startAt, endAt, block) {
  return startAt < block.endAt && endAt > block.startAt;
}

function validateServiceIds(serviceIds) {
  if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
    throw new BookingEngineError('Debes seleccionar al menos un servicio');
  }

  const parsedIds = serviceIds.map((value) => Number.parseInt(value, 10));

  if (parsedIds.some((value) => !Number.isInteger(value) || value <= 0)) {
    throw new BookingEngineError('La selección de servicios no es válida');
  }

  return [...new Set(parsedIds)];
}

async function loadCompatiblePairs(serviceId, connection = pool) {
  const [rows] = await connection.query(
    `
      SELECT
        p.id,
        p.name,
        p.default_resource_id
      FROM professional_service_compat psc
      JOIN professionals p ON p.id = psc.professional_id
      WHERE psc.service_id = ?
        AND p.active = 1
      ORDER BY p.id ASC
    `,
    [serviceId]
  );

  return rows
    .filter((row) => row.default_resource_id)
    .map((row) => ({
      professionalId: row.id,
      professionalName: row.name,
      resourceId: row.default_resource_id,
    }));
}

async function getActiveBlocksForPair({ date, professionalId, resourceId, connection = pool }) {
  const [rows] = await connection.query(
    `
      SELECT
        ab.id,
        ab.start_at,
        ab.end_at,
        a.status,
        a.expires_at
      FROM appointment_blocks ab
      JOIN appointments a ON a.id = ab.appointment_id
      WHERE DATE(ab.start_at) = ?
        AND ab.professional_id = ?
        AND ab.resource_id = ?
        AND a.status <> 'cancelled'
      ORDER BY ab.start_at ASC
    `,
    [date, professionalId, resourceId]
  );

  return rows
    .filter((row) => !isExpiredAppointment(row))
    .map((row) => ({
      id: row.id,
      startAt: new Date(row.start_at),
      endAt: new Date(row.end_at),
    }));
}

function buildAvailableSlots({ date, totalDurationMinutes, blocks }) {
  const schedule = getScheduleForDate(date);

  if (!schedule) {
    return [];
  }

  const dayStart = createDateTime(date, schedule.start);
  const dayEnd = createDateTime(date, schedule.end);
  const slots = [];

  for (
    let cursor = new Date(dayStart);
    addMinutes(cursor, totalDurationMinutes) <= dayEnd;
    cursor = addMinutes(cursor, SLOT_INTERVAL_MINUTES)
  ) {
    const slotEnd = addMinutes(cursor, totalDurationMinutes);
    const busy = blocks.some((block) => overlaps(cursor, slotEnd, block));

    if (!busy) {
      slots.push({
        startTime: formatTimeValue(cursor),
        endTime: formatTimeValue(slotEnd),
      });
    }
  }

  return slots;
}

function intersectSlotMaps(slotGroups) {
  if (slotGroups.length === 0) {
    return [];
  }

  const [firstGroup, ...restGroups] = slotGroups;

  return firstGroup.filter((slot) =>
    restGroups.every((group) => group.some((candidate) => candidate.startTime === slot.startTime))
  );
}

class BookingEngineService {
  static async loadServiceContexts(serviceIds, connection = pool) {
    const uniqueServiceIds = validateServiceIds(serviceIds);
    const contexts = [];

    for (const serviceId of uniqueServiceIds) {
      const service = await ServicesService.getActiveById(serviceId, connection);

      if (!service) {
        throw new BookingEngineError('Uno de los servicios seleccionados no está disponible', 404);
      }

      const compatiblePairs = await loadCompatiblePairs(service.id, connection);

      if (compatiblePairs.length === 0) {
        throw new BookingEngineError(`No hay profesionales disponibles para ${service.name}`);
      }

      contexts.push({
        service,
        compatiblePairs,
      });
    }

    return contexts;
  }

  static async getApproximateAvailability({ serviceIds, date }, connection = pool) {
    const validatedServiceIds = validateServiceIds(serviceIds);
    parseDateParts(date);

    const contexts = await this.loadServiceContexts(validatedServiceIds, connection);
    const totalDurationMinutes = contexts.reduce(
      (sum, context) => sum + context.service.total_duration_minutes,
      0
    );
    const totalPrice = contexts.reduce(
      (sum, context) => sum + Number.parseFloat(context.service.price),
      0
    );

    const slotGroups = [];

    for (const context of contexts) {
      const unionByStartTime = new Map();

      for (const pair of context.compatiblePairs) {
        const blocks = await getActiveBlocksForPair({
          date,
          professionalId: pair.professionalId,
          resourceId: pair.resourceId,
          connection,
        });

        const pairSlots = buildAvailableSlots({
          date,
          totalDurationMinutes,
          blocks,
        });

        for (const slot of pairSlots) {
          if (!unionByStartTime.has(slot.startTime)) {
            unionByStartTime.set(slot.startTime, slot);
          }
        }
      }

      slotGroups.push([...unionByStartTime.values()].sort((left, right) => left.startTime.localeCompare(right.startTime)));
    }

    return {
      services: contexts.map((context) => ({
        id: context.service.id,
        name: context.service.name,
        category: context.service.category,
        price: context.service.price,
        total_duration_minutes: context.service.total_duration_minutes,
      })),
      date,
      totalDurationMinutes,
      totalPrice: Number(totalPrice.toFixed(2)),
      slots: intersectSlotMaps(slotGroups),
      mode: 'continuous_approximation',
      notice: 'Disponibilidad aproximada para un bloque continuo. La asignación final multi-servicio se completará en la siguiente fase.',
    };
  }
}

module.exports = BookingEngineService;
