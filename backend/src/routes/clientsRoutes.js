const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const requireAuth = require('../middlewares/requireAuth');

// All routes require authentication
router.use(requireAuth);

router.get('/', clientsController.getAllClients);
router.get('/search', clientsController.searchClients);
router.get('/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

module.exports = router;
