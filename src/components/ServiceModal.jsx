import { useEffect } from 'react'
import './ServiceModal.css'

function ServiceModal({ service, onClose, contactHref }) {
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

  return (
    <div
      className="service-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      <button className="service-modal__overlay" type="button" aria-label="Cerrar modal" onClick={onClose} />
      <div className="service-modal__panel">
        <button className="service-modal__close" type="button" aria-label="Cerrar modal" onClick={onClose}>
          {'\u00D7'}
        </button>

        <div className="service-modal__media">
          <img src={service.image} alt={service.title} />
        </div>

        <div className="service-modal__content">
          <span className="service-modal__eyebrow">Carta de servicios</span>
          <h3 className="service-modal__title" id="service-modal-title">
            {service.title}
          </h3>
          <p className="service-modal__description">{service.modalDescription}</p>

          <div className="service-modal__list">
            {service.treatments.map((treatment) => (
              <article className="service-modal__item" key={treatment.name}>
                <div className="service-modal__item-main">
                  <strong>{treatment.name}</strong>
                  <p>{treatment.description}</p>
                </div>
                <div className="service-modal__item-meta">
                  <span>{treatment.duration}</span>
                  <strong>{treatment.price}</strong>
                </div>
              </article>
            ))}
          </div>

          <a className="button button--primary service-modal__cta" href={contactHref} onClick={onClose}>
            Pide tu cita
          </a>
        </div>
      </div>
    </div>
  )
}

export default ServiceModal
