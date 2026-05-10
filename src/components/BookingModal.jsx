import { useEffect, useState } from 'react'
import { createPublicBooking, getAvailabilityByService } from '../services/publicBookingApi'
import './BookingModal.css'

function BookingModal({ treatment, serviceTitle, onClose }) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    name: '',
    phone: '',
    email: '',
  })
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  async function loadAvailability(date, options = {}) {
    const { preserveMessages = false } = options
    setLoadingSlots(true)

    if (!preserveMessages) {
      setErrorMessage('')
      setSuccessMessage('')
    }

    try {
      const data = await getAvailabilityByService({
        serviceId: treatment.serviceId,
        date,
      })

      setSlots(data.slots || [])
      setFormData((current) => ({
        ...current,
        startTime: '',
      }))
    } catch (error) {
      setSlots([])
      setErrorMessage(error.message)
    } finally {
      setLoadingSlots(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (name === 'date') {
      if (value) {
        loadAvailability(value)
      } else {
        setSlots([])
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await createPublicBooking({
        serviceId: treatment.serviceId,
        date: formData.date,
        startTime: formData.startTime,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
      })

      await loadAvailability(formData.date, { preserveMessages: true })
      setSuccessMessage('Reserva enviada correctamente. Ha quedado registrada como pendiente de señal.')
      setFormData((current) => ({
        ...current,
        startTime: '',
        name: '',
        phone: '',
        email: '',
      }))
    } catch (error) {
      if (formData.date) {
        await loadAvailability(formData.date, { preserveMessages: true })
      }

      setErrorMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <button className="booking-modal__overlay" type="button" aria-label="Cerrar reserva" onClick={onClose} />
      <div className="booking-modal__panel">
        <button className="booking-modal__close" type="button" aria-label="Cerrar reserva" onClick={onClose}>
          {'\u00D7'}
        </button>

        <div className="booking-modal__header">
          <span className="booking-modal__eyebrow">Reserva online</span>
          <h3 className="booking-modal__title" id="booking-modal-title">
            {treatment.name}
          </h3>
          <p className="booking-modal__subtitle">
            {serviceTitle} · {treatment.duration} · {treatment.price}
          </p>
        </div>

        <form className="booking-modal__form" onSubmit={handleSubmit}>
          <label className="booking-modal__field">
            <span>Servicio</span>
            <input type="text" value={treatment.name} readOnly />
          </label>

          <label className="booking-modal__field">
            <span>Fecha</span>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>

          <label className="booking-modal__field">
            <span>Hora disponible</span>
            <select
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              disabled={!formData.date || loadingSlots || slots.length === 0}
            >
              <option value="">
                {loadingSlots ? 'Cargando horarios...' : 'Selecciona una hora'}
              </option>
              {slots.map((slot) => (
                <option key={slot.startTime} value={slot.startTime}>
                  {slot.startTime}
                </option>
              ))}
            </select>
          </label>

          <label className="booking-modal__field">
            <span>Nombre</span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label className="booking-modal__field">
            <span>Teléfono</span>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </label>

          <label className="booking-modal__field">
            <span>Email opcional</span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>

          {errorMessage ? <p className="booking-modal__message booking-modal__message--error">{errorMessage}</p> : null}
          {successMessage ? (
            <p className="booking-modal__message booking-modal__message--success">{successMessage}</p>
          ) : null}

          {!loadingSlots && formData.date && slots.length === 0 ? (
            <p className="booking-modal__hint">No hay huecos disponibles para esa fecha.</p>
          ) : null}

          <div className="booking-modal__actions">
            <button className="button button--secondary" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="button button--primary" type="submit" disabled={submitting || loadingSlots}>
              {submitting ? 'Enviando...' : 'Confirmar reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
