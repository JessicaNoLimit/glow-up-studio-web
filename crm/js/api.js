import { API_BASE_URL } from './config.js';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJsonResponse = contentType.includes('application/json');
  const payload = isJsonResponse ? await response.json() : null;

  if (!response.ok) {
    const message =
      payload?.message ||
      (response.status === 401
        ? 'Las credenciales no son válidas.'
        : 'No se pudo completar la solicitud.');

    throw new Error(message);
  }

  return payload;
}

export function getLoginStatus() {
  return request('/admin/login', {
    method: 'GET',
  });
}

export function loginAdmin(credentials) {
  return request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function logoutAdmin() {
  return request('/admin/logout', {
    method: 'POST',
  });
}

// Clients API functions
export function getClients() {
  return request('/admin/clients');
}

export function getClientById(id) {
  return request(`/admin/clients/${id}`);
}

export function createClient(clientData) {
  return request('/admin/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
}

export function updateClient(id, clientData) {
  return request(`/admin/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
}

export function deleteClient(id) {
  return request(`/admin/clients/${id}`, {
    method: 'DELETE',
  });
}

export function searchClients(query) {
  return request(`/admin/clients/search?q=${encodeURIComponent(query)}`);
}

// Appointments API functions
export function getAppointments() {
  return request('/admin/appointments');
}

export function getTodayAppointments() {
  return request('/admin/appointments/today');
}

export function getUpcomingAppointments() {
  return request('/admin/appointments/upcoming');
}

export function getAppointmentById(id) {
  return request(`/admin/appointments/${id}`);
}

export function createAppointment(appointmentData) {
  return request('/admin/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
}

export function updateAppointment(id, appointmentData) {
  return request(`/admin/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointmentData),
  });
}

export function deleteAppointment(id) {
  return request(`/admin/appointments/${id}`, {
    method: 'DELETE',
  });
}
