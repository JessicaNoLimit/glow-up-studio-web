const AppointmentsService = require('../services/appointmentsService');

async function getAllAppointments(req, res) {
  try {
    const appointments = await AppointmentsService.getAll();
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appointment = await AppointmentsService.getById(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getTodayAppointments(req, res) {
  try {
    const appointments = await AppointmentsService.getTodayAppointments();
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUpcomingAppointments(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const appointments = await AppointmentsService.getUpcomingAppointments(limit);
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createAppointment(req, res) {
  try {
    const appointmentData = req.body;
    const appointment = await AppointmentsService.create(appointmentData);
    res.status(201).json({ appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointmentData = req.body;
    const appointment = await AppointmentsService.update(id, appointmentData);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    await AppointmentsService.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  getTodayAppointments,
  getUpcomingAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
