import { API_BASE_URL } from './config.js';
import { logoutAdmin } from './api.js';

const state = {
  appointments: [],
  clients: [],
  editingId: null,
  currentFilter: 'all'
};

const appointmentsTableBody = document.getElementById('appointmentsTableBody');
const searchInput = document.getElementById('searchInput');
const showAllBtn = document.getElementById('showAllBtn');
const showTodayBtn = document.getElementById('showTodayBtn');
const showUpcomingBtn = document.getElementById('showUpcomingBtn');
const appointmentModal = document.getElementById('appointmentModal');
const appointmentForm = document.getElementById('appointmentForm');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalTitle = document.getElementById('modalTitle');
const logoutButton = document.getElementById('logout-button');
const adminNameElement = document.getElementById('admin-name');

async function fetchAppointments(filter = 'all') {
  let endpoint = `${API_BASE_URL}/admin/appointments`;

  if (filter === 'today') {
    endpoint = `${API_BASE_URL}/admin/appointments/today`;
  } else if (filter === 'upcoming') {
    endpoint = `${API_BASE_URL}/admin/appointments/upcoming`;
  }

  const response = await fetch(endpoint, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al cargar citas');
  }

  const data = await response.json();
  return data.appointments;
}

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

async function createAppointment(appointmentData) {
  const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });

  if (!response.ok) {
    throw new Error('Error al crear cita');
  }

  const data = await response.json();
  return data.appointment;
}

async function updateAppointment(id, appointmentData) {
  const response = await fetch(`${API_BASE_URL}/admin/appointments/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });

  if (!response.ok) {
    throw new Error('Error al actualizar cita');
  }

  const data = await response.json();
  return data.appointment;
}

async function deleteAppointment(id) {
  const response = await fetch(`${API_BASE_URL}/admin/appointments/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Error al eliminar cita');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusLabel(status) {
  const labels = {
    'pending_payment': 'Pendiente de pago',
    'confirmed': 'Confirmada',
    'cancelled': 'Cancelada',
    'completed': 'Completada'
  };
  return labels[status] || status;
}

function getStatusClass(status) {
  const classes = {
    'pending_payment': 'status-pending',
    'confirmed': 'status-confirmed',
    'cancelled': 'status-cancelled',
    'completed': 'status-completed'
  };
  return classes[status] || '';
}

function getOriginLabel(origin) {
  const labels = {
    'web': 'Web',
    'phone': 'Teléfono',
    'in_person': 'Presencial',
    'admin': 'Centro'
  };
  return labels[origin] || origin;
}

function renderAppointments(appointments) {
  appointmentsTableBody.innerHTML = '';

  if (!appointments || appointments.length === 0) {
    const emptyMessage = state.currentFilter === 'all'
      ? 'No hay citas registradas'
      : state.currentFilter === 'today'
      ? 'No hay citas para hoy'
      : 'No hay próximas citas';

    appointmentsTableBody.innerHTML = `
      <tr><td colspan="6" style="text-align: center; padding: 2rem;">${emptyMessage}</td></tr>
    `;
    return;
  }

  appointments.forEach(appointment => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(appointment.start_at)}</td>
      <td><strong>${formatTime(appointment.start_at)}</strong></td>
      <td>${appointment.client?.full_name || 'Clienta'}</td>
      <td><span class="status-badge ${getStatusClass(appointment.status)}">${getStatusLabel(appointment.status)}</span></td>
      <td>${getOriginLabel(appointment.origin)}</td>
      <td class="actions-cell">
        <button class="btn-icon btn-edit" data-id="${appointment.id}" title="Editar">✏️</button>
        <button class="btn-icon btn-delete" data-id="${appointment.id}" title="Eliminar">🗑️</button>
      </td>
    `;
    appointmentsTableBody.appendChild(row);
  });
}

function populateClientSelect(clients) {
  const select = document.getElementById('appointmentClient');
  select.innerHTML = '<option value="">Seleccionar clienta...</option>';

  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.full_name;
    select.appendChild(option);
  });
}

function openModal(appointment = null) {
  state.editingId = appointment?.id || null;

  if (appointment) {
    modalTitle.textContent = 'Editar cita';
    document.getElementById('appointmentId').value = appointment.id;
    document.getElementById('appointmentClient').value = appointment.client_id;

    const startAt = new Date(appointment.start_at);
    document.getElementById('appointmentDate').value = startAt.toISOString().split('T')[0];
    document.getElementById('appointmentTime').value = startAt.toTimeString().slice(0, 5);
    document.getElementById('appointmentDuration').value = appointment.total_duration_minutes;
    document.getElementById('appointmentStatus').value = appointment.status;
    document.getElementById('appointmentOrigin').value = appointment.origin;
    document.getElementById('appointmentNotes').value = appointment.notes || '';
  } else {
    modalTitle.textContent = 'Nueva cita';
    appointmentForm.reset();
    document.getElementById('appointmentStatus').value = 'pending_payment';
    document.getElementById('appointmentOrigin').value = 'admin';
    document.getElementById('appointmentDuration').value = 60;
  }

  appointmentModal.classList.add('show');
}

function closeModal() {
  appointmentModal.classList.remove('show');
  state.editingId = null;
  appointmentForm.reset();
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
    console.error('[ERROR] appointments.js verifying session:', error);
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

async function loadAppointments(filter = 'all') {
  try {
    state.appointments = await fetchAppointments(filter);
    state.currentFilter = filter;
    renderAppointments(state.appointments);
  } catch (error) {
    console.error('Error loading appointments:', error);
    appointmentsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #9a4f4a;">Error al cargar citas</td></tr>`;
  }
}

async function loadClients() {
  try {
    state.clients = await fetchClients();
    populateClientSelect(state.clients);
  } catch (error) {
    console.error('Error loading clients:', error);
  }
}

function handleFilterChange(filter) {
  [showAllBtn, showTodayBtn, showUpcomingBtn].forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  });

  const activeBtn = filter === 'all' ? showAllBtn : filter === 'today' ? showTodayBtn : showUpcomingBtn;
  activeBtn.classList.remove('btn-secondary');
  activeBtn.classList.add('btn-primary');

  loadAppointments(filter);
}

async function handleSearch(e) {
  const query = e.target.value.trim().toLowerCase();

  if (!query) {
    renderAppointments(state.appointments);
    return;
  }

  const filtered = state.appointments.filter(app =>
    app.client?.full_name?.toLowerCase().includes(query)
  );
  renderAppointments(filtered);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const date = document.getElementById('appointmentDate').value;
  const time = document.getElementById('appointmentTime').value;
  const startAt = new Date(`${date}T${time}`);
  const duration = parseInt(document.getElementById('appointmentDuration').value);
  const endAt = new Date(startAt.getTime() + duration * 60000);

  const appointmentData = {
    client_id: parseInt(document.getElementById('appointmentClient').value),
    start_at: startAt.toISOString(),
    end_at: endAt.toISOString(),
    total_duration_minutes: duration,
    status: document.getElementById('appointmentStatus').value,
    origin: document.getElementById('appointmentOrigin').value,
    notes: document.getElementById('appointmentNotes').value.trim() || null
  };

  try {
    if (state.editingId) {
      await updateAppointment(state.editingId, appointmentData);
      alert('Cita actualizada correctamente');
    } else {
      await createAppointment(appointmentData);
      alert('Cita creada correctamente');
    }

    closeModal();
    await loadAppointments(state.currentFilter);
  } catch (error) {
    console.error('Error saving appointment:', error);
    alert('Error al guardar cita');
  }
}

async function handleTableClick(e) {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  if (editBtn) {
    const id = parseInt(editBtn.dataset.id);
    const appointment = state.appointments.find(a => a.id === id);
    if (appointment) openModal(appointment);
  }

  if (deleteBtn) {
    const id = parseInt(deleteBtn.dataset.id);
    if (confirm('¿Estás segura de eliminar esta cita?')) {
      try {
        await deleteAppointment(id);
        await loadAppointments(state.currentFilter);
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error al eliminar cita');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  verifySession();
  loadAppointments('all');
  loadClients();
  document.getElementById('createAppointmentBtn').addEventListener('click', () => openModal());
  showAllBtn.addEventListener('click', () => handleFilterChange('all'));
  showTodayBtn.addEventListener('click', () => handleFilterChange('today'));
  showUpcomingBtn.addEventListener('click', () => handleFilterChange('upcoming'));
  searchInput.addEventListener('input', handleSearch);
  appointmentForm.addEventListener('submit', handleFormSubmit);
  appointmentsTableBody.addEventListener('click', handleTableClick);
  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  logoutButton.addEventListener('click', handleLogout);

  appointmentModal.addEventListener('click', (e) => {
    if (e.target === appointmentModal) closeModal();
  });
});
