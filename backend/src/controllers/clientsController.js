const ClientsService = require('../services/clientsService');

async function getAllClients(req, res) {
  try {
    const clients = await ClientsService.getAll();
    res.json({ clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getClientById(req, res) {
  try {
    const { id } = req.params;
    const client = await ClientsService.getById(id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createClient(req, res) {
  try {
    const clientData = req.body;
    const client = await ClientsService.create(clientData);
    res.status(201).json({ client });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateClient(req, res) {
  try {
    const { id } = req.params;
    const clientData = req.body;
    const client = await ClientsService.update(id, clientData);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ client });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteClient(req, res) {
  try {
    const { id } = req.params;
    await ClientsService.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function searchClients(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const clients = await ClientsService.search(q);
    res.json({ clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
};
