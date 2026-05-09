import { logoutAdmin } from './api.js';
import { API_BASE_URL } from './config.js';

const adminNameElement = document.querySelector('#admin-name');
const sessionStatusElement = document.querySelector('#session-status');
const logoutButton = document.querySelector('#logout-button');
const DASHBOARD_ENDPOINT = `${API_BASE_URL}/admin/dashboard`;

const statTodayElement = document.querySelector('#stat-today');
const statClientsElement = document.querySelector('#stat-clients');
const statServicesElement = document.querySelector('#stat-services');
const upcomingAppointmentsElement = document.querySelector('#upcoming-appointments');

function redirectToLogin() {
  window.location.replace('./login.html');
}

function showDashboardError(message) {
  document.body.classList.remove('crm-is-loading');
  setSessionStatus(message);
}

function setAdminName(name) {
  adminNameElement.textContent = name || 'Administración';
}

function setSessionStatus(message) {
  sessionStatusElement.textContent = message;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('es-ES', options);
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const options = {
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleTimeString('es-ES', options);
}

function renderStats(stats) {
  statTodayElement.textContent = stats.todayCount || 0;
  statClientsElement.textContent = stats.clientsCount || 0;
  statServicesElement.textContent = stats.servicesCount || 0;
}

function renderUpcomingAppointments(appointments) {
  if (!appointments || appointments.length === 0) {
    upcomingAppointmentsElement.innerHTML = `
      <p class="crm-panel-card__text">No hay próximas citas programadas.</p>
    `;
    return;
  }

  const appointmentsHtml = appointments.map(appointment => {
    const clientName = appointment.client?.full_name || 'Clienta';
    const time = formatTime(appointment.start_at);
    const date = formatDate(appointment.start_at);
    const statusClass = appointment.status === 'confirmed' ? 'status-confirmed' : 'status-pending';

    return `
      <div class="appointment-item">
        <div class="appointment-time">
          <strong>${time}</strong>
          <span class="appointment-date">${date}</span>
        </div>
        <div class="appointment-client">
          <strong>${clientName}</strong>
          <span class="appointment-status ${statusClass}">${appointment.status}</span>
        </div>
      </div>
    `;
  }).join('');

  upcomingAppointmentsElement.innerHTML = `
    <div class="appointments-list">
      ${appointmentsHtml}
    </div>
  `;
}

async function loadDashboard() {
  try {
    const response = await fetch(DASHBOARD_ENDPOINT, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (response.status === 401) {
      redirectToLogin();
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    const isJsonResponse = contentType.includes('application/json');
    const payload = isJsonResponse ? await response.json() : null;

    if (!response.ok) {
      const message = payload?.message || 'No se pudo cargar el panel.';
      console.error('Dashboard request failed:', response.status, message);
      showDashboardError(message);
      return;
    }

    if (!payload?.adminUser) {
      console.error('Dashboard response missing adminUser.');
      showDashboardError('La respuesta del panel no es válida.');
      return;
    }

    document.body.classList.remove('crm-is-loading');
    const adminName = payload.adminUser.name || payload.adminUser.email || 'Administración';
    setAdminName(adminName);
    setSessionStatus('Sesión activa y lista para trabajar en el CRM.');

    if (payload.stats) {
      renderStats(payload.stats);
    }

    if (payload.upcomingAppointments) {
      renderUpcomingAppointments(payload.upcomingAppointments);
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showDashboardError('No se pudo conectar con el servidor.');
  }
}

async function handleLogout() {
  logoutButton.disabled = true;
  logoutButton.textContent = 'Cerrando sesión...';

  try {
    await logoutAdmin();
  } catch (error) {
    console.error('Unable to close admin session:', error);
  } finally {
    redirectToLogin();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  logoutButton.addEventListener('click', handleLogout);
});
