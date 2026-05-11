const express = require('express');
const publicBookingController = require('../controllers/publicBookingController');

const router = express.Router();

router.get('/services', publicBookingController.getPublicServices);
router.get('/availability', publicBookingController.getAvailability);
router.post('/availability', publicBookingController.getMultiServiceAvailability);
router.post('/bookings', publicBookingController.createBooking);

module.exports = router;
