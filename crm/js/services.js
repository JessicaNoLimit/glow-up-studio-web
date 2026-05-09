import { API_BASE_URL } from './config.js';

const state = {
  services: [],
  editingId: null
};

const servicesTableBody = document.getElementById('servicesTableBody');
const createServiceBtn = document.getElementById('createServiceBtn');
const searchInput = document.getElementById('searchInput');
const serviceModal = document.getElementById('serviceModal');
const serviceForm = document.getElementById('serviceForm');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalTitle = document.getElementById('modalTitle');
const adminNameElement = document.getElementById('admin-name');
const logoutButton = document.getElementById('logout-button');

async function fetchServices() {
  const response = await fetch(`${API_BASE_URL}/admin/services`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al cargar servicios');
  }

  const data = await response.json();
  return data.services;
}

async function createService(serviceData) {
  const response = await fetch(`${API_BASE_URL}/admin/services`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(serviceData)
  });

  if (!response.ok) {
    throw new Error('Error al crear servicio');
  }

  const data = await response.json();
  return data.service;
}

async function updateService(id, serviceData) {
  const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(serviceData)
  });

  if (!response.ok) {
    throw new Error('Error al actualizar servicio');
  }

  const data = await response.json();
  return data.service;
}

async function deleteService(id) {
  const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al eliminar servicio');
  }
}

function renderServices(services) {
  servicesTableBody.innerHTML = '';

  if (services.length === 0) {
    servicesTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem;">
          No hay servicios registrados
        </td>
      </tr>
    `;
    return;
  }

  services.forEach(service => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${service.id}</td>
      <td><strong>${service.name}</strong></td>
      <td><span class="badge">${service.category}</span></td>
      <td>${parseFloat(service.price).toFixed(2)}€</td>
      <td>${service.duration_minutes} min.</td>
      <td><strong>${service.total_duration_minutes} min.</strong></td>
      <td>
        <span class="status-badge ${service.active ? 'active' : 'inactive'}">
          ${service.active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td class="actions-cell">
        <button class="btn-icon btn-edit" data-id="${service.id}" title="Editar">✏️</button>
        <button class="btn-icon btn-delete" data-id="${service.id}" title="Eliminar">🗑️</button>
      </td>
    `;
    servicesTableBody.appendChild(row);
  });
}

function openModal(service = null) {
  state.editingId = service?.id || null;

  if (service) {
    modalTitle.textContent = 'Editar servicio';
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceCategory').value = service.category;
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceDuration').value = service.duration_minutes;
    document.getElementById('serviceMargin').value = service.margin_minutes || 5;
    document.getElementById('serviceActive').checked = service.active;
  } else {
    modalTitle.textContent = 'Nuevo servicio';
    serviceForm.reset();
    document.getElementById('serviceMargin').value = 5;
    document.getElementById('serviceActive').checked = true;
  }

  serviceModal.classList.add('show');
}

function closeModal() {
  serviceModal.classList.remove('show');
  state.editingId = null;
  serviceForm.reset();
}

async function handleLoadServices() {
  try {
    state.services = await fetchServices();
    renderServices(state.services);
  } catch (error) {
    console.error(error);
    alert('Error al cargar servicios');
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const filtered = state.services.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.category.toLowerCase().includes(query)
  );
  renderServices(filtered);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const serviceData = {
    name: document.getElementById('serviceName').value,
    category: document.getElementById('serviceCategory').value,
    price: parseFloat(document.getElementById('servicePrice').value),
    duration_minutes: parseInt(document.getElementById('serviceDuration').value),
    margin_minutes: parseInt(document.getElementById('serviceMargin').value) || 5,
    active: document.getElementById('serviceActive').checked
  };

  try {
    if (state.editingId) {
      await updateService(state.editingId, serviceData);
      alert('Servicio actualizado correctamente');
    } else {
      await createService(serviceData);
      alert('Servicio creado correctamente');
    }

    closeModal();
    await handleLoadServices();
  } catch (error) {
    console.error(error);
    alert('Error al guardar servicio');
  }
}

async function handleTableClick(e) {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  if (editBtn) {
    const id = parseInt(editBtn.dataset.id);
    const service = state.services.find(s => s.id === id);
    if (service) openModal(service);
  }

  if (deleteBtn) {
    const id = parseInt(deleteBtn.dataset.id);
    if (confirm('¿Estás segura de eliminar este servicio?')) {
      try {
        await deleteService(id);
        await handleLoadServices();
      } catch (error) {
        console.error(error);
        alert('Error al eliminar servicio');
      }
    }
  }
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
    adminNameElement.textContent = data.adminUser.name;

    document.body.classList.remove('crm-is-loading');
  } catch (error) {
    console.error('[ERROR] services.js verifying session:', error);
    window.location.replace('./login.html');
  }
}

async function handleLogout() {
  try {
    await fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    window.location.replace('./login.html');
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  verifySession();
  handleLoadServices();
  createServiceBtn.addEventListener('click', () => openModal());
  searchInput.addEventListener('input', handleSearch);
  serviceForm.addEventListener('submit', handleFormSubmit);
  servicesTableBody.addEventListener('click', handleTableClick);
  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  logoutButton.addEventListener('click', handleLogout);

  serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeModal();
  });
});
