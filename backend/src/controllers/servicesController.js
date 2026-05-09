const ServicesService = require('../services/servicesService');

async function getAllServices(req, res) {
  try {
    const services = await ServicesService.getAll();
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = await ServicesService.getById(id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createService(req, res) {
  try {
    const serviceData = req.body;
    const service = await ServicesService.create(serviceData);
    res.status(201).json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;
    const serviceData = req.body;
    const service = await ServicesService.update(id, serviceData);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;
    await ServicesService.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
