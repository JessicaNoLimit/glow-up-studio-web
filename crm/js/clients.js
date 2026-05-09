import { API_BASE_URL } from './config.js';
import { logoutAdmin } from './api.js';

const state = {
  clients: [],
  editingId: null,
  searchQuery: ''
};

const clientsTableBody = document.getElementById('clientsTableBody');
const createClientBtn = document.getElementById('createClientBtn');
const searchInput = document.getElementById('searchInput');
const clientModal = document.getElementById('clientModal');
const clientForm = document.getElementById('clientForm');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalTitle = document.getElementById('modalTitle');
const logoutButton = document.getElementById('logout-button');
const adminNameElement = document.getElementById('admin-name');

async function fetchClients() {
  const response = await fetch(`${API_BASE_URL}/admin/clients`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al cargar clientas');
  }

  const data = await response.json();
  return data.clients;
}

async function searchClients(query) {
  const response = await fetch(`${API_BASE_URL}/admin/clients/search?q=${encodeURIComponent(query)}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al buscar clientas');
  }

  const data = await response.json();
  return data.clients;
}

async function createClient(clientData) {
  const response = await fetch(`${API_BASE_URL}/admin/clients`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clientData)
  });

  if (!response.ok) {
    throw new Error('Error al crear clienta');
  }

  const data = await response.json();
  return data.client;
}

async function updateClient(id, clientData) {
  const response = await fetch(`${API_BASE_URL}/admin/clients/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clientData)
  });

  if (!response.ok) {
    throw new Error('Error al actualizar clienta');
  }

  const data = await response.json();
  return data.client;
}

async function deleteClient(id) {
  const response = await fetch(`${API_BASE_URL}/admin/clients/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al eliminar clienta');
  }
}

function renderClients(clients) {
  clientsTableBody.innerHTML = '';

  if (!clients || clients.length === 0) {
    const emptyState = state.searchQuery
      ? `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No se encontraron resultados para "${state.searchQuery}"</td></tr>`
      : `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No hay clientas registradas</td></tr>`;
    clientsTableBody.innerHTML = emptyState;
    return;
  }

  clients.forEach(client => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${client.id}</td>
      <td><strong>${client.full_name}</strong></td>
      <td>${client.phone}</td>
      <td>${client.email || '-'}</td>
      <td>${client.notes ? '<span class="notes-indicator">📝</span>' : '-'}</td>
      <td class="actions-cell">
        <button class="btn-icon btn-edit" data-id="${client.id}" title="Editar">✏️</button>
        <button class="btn-icon btn-delete" data-id="${client.id}" title="Eliminar">🗑️</button>
      </td>
    `;
    clientsTableBody.appendChild(row);
  });
}

function openModal(client = null) {
  state.editingId = client?.id || null;

  if (client) {
    modalTitle.textContent = 'Editar clienta';
    document.getElementById('clientId').value = client.id;
    document.getElementById('clientFirstName').value = client.first_name;
    document.getElementById('clientLastName').value = client.last_name || '';
    document.getElementById('clientPhone').value = client.phone;
    document.getElementById('clientEmail').value = client.email || '';
    document.getElementById('clientNotes').value = client.notes || '';
  } else {
    modalTitle.textContent = 'Nueva clienta';
    clientForm.reset();
  }

  clientModal.classList.add('show');
}

function closeModal() {
  clientModal.classList.remove('show');
  state.editingId = null;
  clientForm.reset();
}

async function verifySession() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      window.location.replace('./login.html');
      return;
    }

    const data = await response.json();
    const adminName = data.adminUser?.name || data.adminUser?.email || 'Administración';
    adminNameElement.textContent = adminName;

    document.body.classList.remove('crm-is-loading');
  } catch (error) {
    document.body.classList.remove('crm-is-loading');
    console.error('[ERROR] clients.js verifying session:', error);
    window.location.replace('./login.html');
  }
}

async function handleLogout() {
  try {
    await logoutAdmin();
    window.location.replace('./login.html');
  } catch (error) {
    console.error('Error closing session:', error);
    window.location.replace('./login.html');
  }
}

async function loadClients() {
  try {
    state.clients = await fetchClients();
    renderClients(state.clients);
  } catch (error) {
    console.error('Error loading clients:', error);
    clientsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #9a4f4a;">Error al cargar clientas</td></tr>`;
  }
}

async function handleSearch(e) {
  const query = e.target.value.trim();
  state.searchQuery = query;

  if (!query) {
    renderClients(state.clients);
    return;
  }

  try {
    const filtered = await searchClients(query);
    renderClients(filtered);
  } catch (error) {
    console.error('Error searching clients:', error);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const clientData = {
    first_name: document.getElementById('clientFirstName').value.trim(),
    last_name: document.getElementById('clientLastName').value.trim(),
    phone: document.getElementById('clientPhone').value.trim(),
    email: document.getElementById('clientEmail').value.trim() || null,
    notes: document.getElementById('clientNotes').value.trim() || null
  };

  try {
    if (state.editingId) {
      await updateClient(state.editingId, clientData);
      alert('Clienta actualizada correctamente');
    } else {
      await createClient(clientData);
      alert('Clienta creada correctamente');
    }

    closeModal();
    await loadClients();
  } catch (error) {
    console.error('Error saving client:', error);
    alert('Error al guardar clienta');
  }
}

async function handleTableClick(e) {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  if (editBtn) {
    const id = parseInt(editBtn.dataset.id);
    const client = state.clients.find(c => c.id === id);
    if (client) openModal(client);
  }

  if (deleteBtn) {
    const id = parseInt(deleteBtn.dataset.id);
    if (confirm('¿Estás segura de eliminar esta clienta?')) {
      try {
        await deleteClient(id);
        await loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar clienta');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  verifySession();
  loadClients();
  createClientBtn.addEventListener('click', () => openModal());
  searchInput.addEventListener('input', handleSearch);
  clientForm.addEventListener('submit', handleFormSubmit);
  clientsTableBody.addEventListener('click', handleTableClick);
  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  logoutButton.addEventListener('click', handleLogout);

  clientModal.addEventListener('click', (e) => {
    if (e.target === clientModal) closeModal();
  });
});
