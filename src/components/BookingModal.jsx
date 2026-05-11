import { useEffect, useMemo, useState } from 'react'
import {
  createPublicBooking,
  getAvailabilityByService,
  getPublicServices,
  requestMultiServiceAvailability,
} from '../services/publicBookingApi'
import './BookingModal.css'

function formatPriceLabel(value) {
  const numericPrice = Number(value)

  if (Number.isNaN(numericPrice)) {
    return String(value)
  }

  return `${numericPrice.toFixed(0)}€`
}

function parseDurationValue(value) {
  const parsed = Number.parseInt(String(value || '').replace(/[^\d]/g, ''), 10)
  return Number.isInteger(parsed) ? parsed : 0
}

function parsePriceValue(value) {
  const normalized = String(value || '').replace(',', '.').replace(/[^\d.]/g, '')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function mapServiceToSelectableItem(service) {
  return {
    serviceId: service.id,
    name: service.name,
    serviceTitle: service.category,
    durationMinutes: service.total_duration_minutes,
    durationLabel: `${service.total_duration_minutes} min`,
    priceValue: Number.parseFloat(service.price),
    priceLabel: formatPriceLabel(service.price),
  }
}

function mapTreatmentFallback(treatment, fallbackCategory = '') {
  if (!treatment) {
    return null
  }

  return {
    serviceId: treatment.serviceId,
    name: treatment.name,
    serviceTitle: treatment.serviceTitle || fallbackCategory,
    durationMinutes: parseDurationValue(treatment.duration),
    durationLabel: treatment.duration,
    priceValue: parsePriceValue(treatment.price),
    priceLabel: treatment.price,
  }
}

function BookingModal({ treatment, serviceTitle, onClose }) {
  const [availableTreatments, setAvailableTreatments] = useState([])
  const [selectedTreatments, setSelectedTreatments] = useState(() => {
    const initialTreatment = mapTreatmentFallback(treatment, serviceTitle)
    return initialTreatment ? [initialTreatment] : []
  })
  const [serviceToAddId, setServiceToAddId] = useState('')
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    name: '',
    phone: '',
    email: '',
  })
  const [slots, setSlots] = useState([])
  const [availabilityNotice, setAvailabilityNotice] = useState('')
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const totalPrice = useMemo(
    () => selectedTreatments.reduce((sum, item) => sum + item.priceValue, 0),
    [selectedTreatments]
  )
  const totalDurationMinutes = useMemo(
    () => selectedTreatments.reduce((sum, item) => sum + item.durationMinutes, 0),
    [selectedTreatments]
  )
  const isSingleService = selectedTreatments.length === 1
  const primaryTreatment = isSingleService ? selectedTreatments[0] : null

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

  useEffect(() => {
    let cancelled = false

    async function loadServices() {
      setLoadingServices(true)

      try {
        const data = await getPublicServices()

        if (cancelled) {
          return
        }

        const mappedTreatments = (data.services || []).map(mapServiceToSelectableItem)
        setAvailableTreatments(mappedTreatments)

        if (treatment) {
          const matchingTreatment = mappedTreatments.find((item) => item.serviceId === treatment.serviceId)

          if (matchingTreatment) {
            setSelectedTreatments([matchingTreatment])
          }
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error.message)
        }
      } finally {
        if (!cancelled) {
          setLoadingServices(false)
        }
      }
    }

    loadServices()

    return () => {
      cancelled = true
    }
  }, [serviceTitle, treatment])

  function resetAvailabilityState() {
    setSlots([])
    setAvailabilityNotice('')
    setFormData((current) => ({
      ...current,
      startTime: '',
    }))
  }

  function handleFieldChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (name === 'date') {
      resetAvailabilityState()
    }
  }

  function handleAddService() {
    const selectedItem = availableTreatments.find((item) => String(item.serviceId) === serviceToAddId)

    if (!selectedItem) {
      setErrorMessage('Selecciona un servicio para añadirlo al carrito')
      return
    }

    if (selectedTreatments.some((item) => item.serviceId === selectedItem.serviceId)) {
      setErrorMessage('Ese servicio ya está añadido al carrito')
      return
    }

    setSelectedTreatments((current) => [...current, selectedItem])
    setServiceToAddId('')
    setErrorMessage('')
    setSuccessMessage('')
    resetAvailabilityState()
  }

  function handleRemoveService(serviceId) {
    setSelectedTreatments((current) => current.filter((item) => item.serviceId !== serviceId))
    setErrorMessage('')
    setSuccessMessage('')
    resetAvailabilityState()
  }

  async function handleSearchAvailability() {
    if (selectedTreatments.length === 0) {
      setErrorMessage('Debes añadir al menos un servicio')
      return
    }

    if (!formData.date) {
      setErrorMessage('Selecciona una fecha para buscar disponibilidad')
      return
    }

    setLoadingAvailability(true)
    setErrorMessage('')
    setSuccessMessage('')
    setAvailabilityNotice('')

    try {
      if (selectedTreatments.length === 1) {
        const data = await getAvailabilityByService({
          serviceId: selectedTreatments[0].serviceId,
          date: formData.date,
        })

        setSlots(data.slots || [])
      } else {
        const data = await requestMultiServiceAvailability(
          selectedTreatments.map((item) => item.serviceId),
          formData.date
        )

        setSlots(data.slots || [])
        setAvailabilityNotice(data.notice || '')
      }

      setFormData((current) => ({
        ...current,
        startTime: '',
      }))
    } catch (error) {
      setSlots([])
      setErrorMessage(error.message)
    } finally {
      setLoadingAvailability(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isSingleService || !primaryTreatment) {
      setErrorMessage('La reserva final multi-servicio se completará en la siguiente fase')
      return
    }

    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await createPublicBooking({
        serviceId: primaryTreatment.serviceId,
        date: formData.date,
        startTime: formData.startTime,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
      })

      setSuccessMessage('Reserva enviada correctamente. Ha quedado registrada como pendiente de señal.')
      await handleSearchAvailability()
      setFormData((current) => ({
        ...current,
        startTime: '',
        name: '',
        phone: '',
        email: '',
      }))
    } catch (error) {
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
            {selectedTreatments.length > 0 ? 'Configura tu reserva' : 'Crea tu carrito de servicios'}
          </h3>
          <p className="booking-modal__subtitle">
            Añade uno o varios servicios, calcula el tiempo total y busca horas disponibles.
          </p>
        </div>

        <form className="booking-modal__form" onSubmit={handleSubmit}>
          <div className="booking-modal__field">
            <span>Añadir servicio</span>
            <div className="booking-modal__add-service">
              <select
                name="serviceToAddId"
                value={serviceToAddId}
                onChange={(event) => setServiceToAddId(event.target.value)}
                disabled={loadingServices || availableTreatments.length === 0}
              >
                <option value="">{loadingServices ? 'Cargando servicios...' : 'Selecciona un servicio'}</option>
                {availableTreatments.map((item) => (
                  <option key={item.serviceId} value={item.serviceId}>
                    {item.serviceTitle} · {item.name}
                  </option>
                ))}
              </select>
              <button className="button button--secondary booking-modal__add-button" type="button" onClick={handleAddService}>
                Añadir
              </button>
            </div>
          </div>

          <div className="booking-modal__cart">
            <div className="booking-modal__cart-header">
              <span>Servicios seleccionados</span>
            </div>

            {selectedTreatments.length === 0 ? (
              <p className="booking-modal__cart-empty">Todavía no has añadido servicios al carrito.</p>
            ) : (
              <div className="booking-modal__cart-list">
                {selectedTreatments.map((item) => (
                  <article className="booking-modal__cart-item" key={item.serviceId}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.serviceTitle} · {item.durationLabel} · {item.priceLabel}
                      </p>
                    </div>
                    <button
                      className="booking-modal__remove-button"
                      type="button"
                      onClick={() => handleRemoveService(item.serviceId)}
                    >
                      Quitar
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="booking-modal__summary">
            <div>
              <span>Precio total</span>
              <strong>{formatPriceLabel(totalPrice)}</strong>
            </div>
            <div>
              <span>Duración aproximada</span>
              <strong>{totalDurationMinutes} min</strong>
            </div>
          </div>

          <p className="booking-modal__hint">
            La hora final puede variar según disponibilidad interna.
          </p>

          <label className="booking-modal__field">
            <span>Fecha</span>
            <input type="date" name="date" value={formData.date} onChange={handleFieldChange} required />
          </label>

          <button
            className="button button--secondary booking-modal__search-button"
            type="button"
            onClick={handleSearchAvailability}
            disabled={loadingAvailability || selectedTreatments.length === 0}
          >
            {loadingAvailability ? 'Buscando horarios...' : 'Buscar disponibilidad'}
          </button>

          <label className="booking-modal__field">
            <span>Hora disponible</span>
            <select
              name="startTime"
              value={formData.startTime}
              onChange={handleFieldChange}
              required={isSingleService}
              disabled={loadingAvailability || slots.length === 0}
            >
              <option value="">{loadingAvailability ? 'Cargando horarios...' : 'Selecciona una hora'}</option>
              {slots.map((slot) => (
                <option key={slot.startTime} value={slot.startTime}>
                  {slot.startTime}
                </option>
              ))}
            </select>
          </label>

          <label className="booking-modal__field">
            <span>Nombre</span>
            <input type="text" name="name" value={formData.name} onChange={handleFieldChange} required />
          </label>

          <label className="booking-modal__field">
            <span>Teléfono</span>
            <input type="tel" name="phone" value={formData.phone} onChange={handleFieldChange} required />
          </label>

          <label className="booking-modal__field">
            <span>Email opcional</span>
            <input type="email" name="email" value={formData.email} onChange={handleFieldChange} />
          </label>

          {availabilityNotice ? <p className="booking-modal__hint">{availabilityNotice}</p> : null}
          {errorMessage ? <p className="booking-modal__message booking-modal__message--error">{errorMessage}</p> : null}
          {successMessage ? (
            <p className="booking-modal__message booking-modal__message--success">{successMessage}</p>
          ) : null}

          {!loadingAvailability && formData.date && slots.length === 0 ? (
            <p className="booking-modal__hint">No hay huecos disponibles para esa fecha.</p>
          ) : null}

          {!isSingleService && selectedTreatments.length > 1 ? (
            <p className="booking-modal__hint">
              La reserva definitiva de varios servicios se activará en la V2.2. En esta fase ya puedes construir el carrito y consultar horarios globales.
            </p>
          ) : null}

          <div className="booking-modal__actions">
            <button className="button button--secondary" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="button button--primary"
              type="submit"
              disabled={submitting || loadingAvailability || loadingServices || !isSingleService || slots.length === 0}
            >
              {submitting ? 'Enviando...' : 'Confirmar reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
