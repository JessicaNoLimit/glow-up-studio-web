const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const requireAuth = require('../middlewares/requireAuth');

// All routes require authentication
router.use(requireAuth);

router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.post('/', servicesController.createService);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

module.exports = router;
