const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const requireAuth = require('../middlewares/requireAuth');

// All routes require authentication
router.use(requireAuth);

router.get('/', appointmentsController.getAllAppointments);
router.get('/today', appointmentsController.getTodayAppointments);
router.get('/upcoming', appointmentsController.getUpcomingAppointments);
router.get('/:id', appointmentsController.getAppointmentById);
router.post('/', appointmentsController.createAppointment);
router.put('/:id', appointmentsController.updateAppointment);
router.delete('/:id', appointmentsController.deleteAppointment);

module.exports = router;
