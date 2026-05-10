const express = require('express');

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const servicesRoutes = require('./servicesRoutes');
const clientsRoutes = require('./clientsRoutes');
const appointmentsRoutes = require('./appointmentsRoutes');
const publicRoutes = require('./publicRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

router.use('/admin', authRoutes);
router.use('/admin', adminRoutes);
router.use('/admin/services', servicesRoutes);
router.use('/admin/clients', clientsRoutes);
router.use('/admin/appointments', appointmentsRoutes);
router.use('/public', publicRoutes);

module.exports = router;
