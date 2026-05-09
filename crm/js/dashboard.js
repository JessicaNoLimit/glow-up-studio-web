import { logoutAdmin } from './api.js';
import { API_BASE_URL } from './config.js';

const adminNameElement = document.querySelector('#admin-name');
const sessionStatusElement = document.querySelector('#session-status');
const logoutButton = document.querySelector('#logout-button');
const DASHBOARD_ENDPOINT = `${API_BASE_URL}/admin/dashboard`;

function redirectToLogin() {
  window.location.replace('./login.html');
}

function setAdminName(name) {
  adminNameElement.textContent = name || 'Administrador';
}

function setSessionStatus(message) {
  sessionStatusElement.textContent = message;
}

async function verifySession() {
  try {
    const response = await fetch(DASHBOARD_ENDPOINT, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest', // Indicar que es una petición AJAX
      },
    });

    // Manejar 401 Unauthorized: redirigir al login
    if (response.status === 401) {
      redirectToLogin();
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    const isJsonResponse = contentType.includes('application/json');
    const payload = isJsonResponse ? await response.json() : null;

    if (!response.ok || !payload?.adminUser) {
      redirectToLogin();
      return;
    }

    const adminName =
      payload.adminUser.name || payload.adminUser.email || 'Administrador';
    setAdminName(adminName);
    setSessionStatus('Sesion activa y lista para trabajar en el CRM.');
  } catch (error) {
    console.error('Unable to verify admin session:', error);
    redirectToLogin();
  }
}

async function handleLogout() {
  logoutButton.disabled = true;
  logoutButton.textContent = 'Cerrando sesion...';

  try {
    await logoutAdmin();
  } catch (error) {
    console.error('Unable to close admin session:', error);
  } finally {
    redirectToLogin();
  }
}

logoutButton.addEventListener('click', handleLogout);
verifySession();
