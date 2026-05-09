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
