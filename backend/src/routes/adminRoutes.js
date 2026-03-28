const express = require('express');

const adminController = require('../controllers/adminController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.get('/dashboard', requireAuth, adminController.getDashboard);

module.exports = router;
