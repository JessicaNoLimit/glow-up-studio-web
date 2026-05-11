const PublicBookingService = require('../services/publicBookingService');

async function getPublicServices(req, res) {
  try {
    const services = await PublicBookingService.getPublicServices();
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAvailability(req, res) {
  try {
    const { serviceId, date } = req.query;
    const availability = await PublicBookingService.getAvailability({
      serviceId,
      date,
    });

    res.json(availability);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
}

async function getMultiServiceAvailability(req, res) {
  try {
    const availability = await PublicBookingService.getMultiServiceAvailability(req.body);
    res.json(availability);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
}

async function createBooking(req, res) {
  try {
    const booking = await PublicBookingService.createBooking(req.body);
    res.status(201).json({ booking });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ error: error.message });
  }
}

module.exports = {
  getPublicServices,
  getAvailability,
  getMultiServiceAvailability,
  createBooking,
};
