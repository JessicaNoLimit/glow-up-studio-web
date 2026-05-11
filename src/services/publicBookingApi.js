const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(payload?.error || 'No se pudo completar la solicitud')
  }

  return payload
}

export function getPublicServices() {
  return request('/public/services')
}

export function getAvailabilityByService({ serviceId, date }) {
  const params = new URLSearchParams({
    serviceId: String(serviceId),
    date,
  })

  return request(`/public/availability?${params.toString()}`)
}

export function requestMultiServiceAvailability(serviceIds, date) {
  return request('/public/availability', {
    method: 'POST',
    body: JSON.stringify({
      serviceIds,
      date,
    }),
  })
}

export function createPublicBooking(bookingData) {
  return request('/public/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  })
}
