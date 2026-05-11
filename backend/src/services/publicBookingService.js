const { pool } = require('../database/connection');
const ServicesService = require('./servicesService');
const ClientsService = require('./clientsService');
const BookingEngineService = require('./bookingEngineService');

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

class PublicBookingError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function padNumber(value) {
  return String(value).padStart(2, '0');
}

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '').trim();
}

function parseDateParts(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateString || ''))) {
    throw new PublicBookingError('La fecha indicada no es válida');
  }

  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

function parseTimeParts(timeString) {
  if (!/^\d{2}:\d{2}$/.test(String(timeString || ''))) {
    throw new PublicBookingError('La hora indicada no es válida');
  }

  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

function createDateTime(dateString, timeString = '00:00') {
  const { year, month, day } = parseDateParts(dateString);
  const { hours, minutes } = parseTimeParts(timeString);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
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

function formatDateTimeForSql(date) {
  return `${formatDateKey(date)} ${formatTimeValue(date)}:00`;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
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

async function getServiceWithProfessional(serviceId, connection = pool) {
  const service = await ServicesService.getActiveById(serviceId, connection);

  if (!service) {
    throw new PublicBookingError('El servicio seleccionado no está disponible', 404);
  }

  const [professionals] = await connection.query(
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
    [service.id]
  );

  if (professionals.length === 0) {
    throw new PublicBookingError('No hay profesional compatible para este servicio');
  }

  const professional = professionals.find((item) => item.default_resource_id);

  if (!professional) {
    throw new PublicBookingError('No hay recurso asignado al profesional de este servicio');
  }

  return {
    service,
    professional: {
      id: professional.id,
      name: professional.name,
      resourceId: professional.default_resource_id,
    },
  };
}

async function lockSchedulingEntities({ professionalId, resourceId, connection }) {
  await connection.query(
    `
      SELECT id
      FROM professionals
      WHERE id = ?
      FOR UPDATE
    `,
    [professionalId]
  );

  await connection.query(
    `
      SELECT id
      FROM resources
      WHERE id = ?
      FOR UPDATE
    `,
    [resourceId]
  );
}

async function getActiveBlocksForDate({
  date,
  professionalId,
  resourceId,
  connection = pool,
}) {
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
        AND (ab.professional_id = ? OR ab.resource_id = ?)
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

  for (let cursor = new Date(dayStart); addMinutes(cursor, totalDurationMinutes) <= dayEnd; cursor = addMinutes(cursor, SLOT_INTERVAL_MINUTES)) {
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

function splitName(fullName) {
  const normalized = String(fullName || '').trim().replace(/\s+/g, ' ');

  if (!normalized) {
    throw new PublicBookingError('El nombre es obligatorio');
  }

  const [firstName, ...rest] = normalized.split(' ');
  return {
    firstName,
    lastName: rest.join(' ') || null,
  };
}

function validateBookingPayload(payload) {
  const serviceId = Number.parseInt(payload.serviceId, 10);

  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    throw new PublicBookingError('El servicio seleccionado no es válido');
  }

  const date = String(payload.date || '').trim();
  const startTime = String(payload.startTime || '').trim();
  const name = String(payload.name || '').trim();
  const phone = normalizePhone(payload.phone);
  const email = String(payload.email || '').trim().toLowerCase() || null;

  if (!phone) {
    throw new PublicBookingError('El teléfono es obligatorio');
  }

  parseDateParts(date);
  parseTimeParts(startTime);

  return {
    serviceId,
    date,
    startTime,
    name,
    phone,
    email,
  };
}

class PublicBookingService {
  static async getPublicServices() {
    return ServicesService.getActive(pool);
  }

  static async getMultiServiceAvailability(payload) {
    return BookingEngineService.getApproximateAvailability(payload);
  }

  static async getAvailability({ serviceId, date }) {
    const parsedServiceId = Number.parseInt(serviceId, 10);

    if (!Number.isInteger(parsedServiceId) || parsedServiceId <= 0) {
      throw new PublicBookingError('El servicio indicado no es válido');
    }

    parseDateParts(date);

    const { service, professional } = await getServiceWithProfessional(parsedServiceId);
    const blocks = await getActiveBlocksForDate({
      date,
      professionalId: professional.id,
      resourceId: professional.resourceId,
    });

    const slots = buildAvailableSlots({
      date,
      totalDurationMinutes: service.total_duration_minutes,
      blocks,
    });

    return {
      service: {
        id: service.id,
        name: service.name,
        category: service.category,
        price: service.price,
        total_duration_minutes: service.total_duration_minutes,
      },
      date,
      slots,
    };
  }

  static async createBooking(payload) {
    const bookingInput = validateBookingPayload(payload);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { service, professional } = await getServiceWithProfessional(bookingInput.serviceId, connection);
      await lockSchedulingEntities({
        professionalId: professional.id,
        resourceId: professional.resourceId,
        connection,
      });

      const currentBlocks = await getActiveBlocksForDate({
        date: bookingInput.date,
        professionalId: professional.id,
        resourceId: professional.resourceId,
        connection,
      });

      const transactionSlots = buildAvailableSlots({
        date: bookingInput.date,
        totalDurationMinutes: service.total_duration_minutes,
        blocks: currentBlocks,
      });

      if (!transactionSlots.some((slot) => slot.startTime === bookingInput.startTime)) {
        throw new PublicBookingError('Este horario acaba de dejar de estar disponible', 409);
      }

      const startAt = createDateTime(bookingInput.date, bookingInput.startTime);
      const endAt = addMinutes(startAt, service.total_duration_minutes);

      if (currentBlocks.some((block) => overlaps(startAt, endAt, block))) {
        throw new PublicBookingError('Este horario acaba de dejar de estar disponible', 409);
      }

      const { firstName, lastName } = splitName(bookingInput.name);
      const client = await ClientsService.findOrCreateByContact(
        {
          first_name: firstName,
          last_name: lastName,
          phone: bookingInput.phone,
          email: bookingInput.email,
        },
        connection
      );

      const [appointmentResult] = await connection.query(
        `
          INSERT INTO appointments (
            client_id,
            start_at,
            end_at,
            total_duration_minutes,
            status,
            origin,
            notes
          )
          VALUES (?, ?, ?, ?, 'pending_payment', 'web', ?)
        `,
        [
          client.id,
          formatDateTimeForSql(startAt),
          formatDateTimeForSql(endAt),
          service.total_duration_minutes,
          `Reserva pública: ${service.name}`,
        ]
      );

      await connection.query(
        `
          INSERT INTO appointment_blocks (
            appointment_id,
            service_id,
            professional_id,
            resource_id,
            start_at,
            end_at,
            duration_minutes,
            sort_order
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `,
        [
          appointmentResult.insertId,
          service.id,
          professional.id,
          professional.resourceId,
          formatDateTimeForSql(startAt),
          formatDateTimeForSql(endAt),
          service.total_duration_minutes,
        ]
      );

      await connection.commit();

      return {
        appointmentId: appointmentResult.insertId,
        clientId: client.id,
        service: {
          id: service.id,
          name: service.name,
        },
        start_at: formatDateTimeForSql(startAt),
        end_at: formatDateTimeForSql(endAt),
        status: 'pending_payment',
        origin: 'web',
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = PublicBookingService;
