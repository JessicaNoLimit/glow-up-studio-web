import './Contact.css'

function Contact({ contactInfo }) {
  return (
    <section className="section contact" id="contacto">
      <div className="section__inner contact__box">
        <div>
          <span className="section__eyebrow">Contacto y citas</span>
          <h2 className="section__title">
            {'Una secci\u00f3n comercial clara, preparada para conectar reservas y seguimiento.'}
          </h2>
          <p className="section__description">
            Por ahora, esta sección funciona como base informativa con CTA claros. Se puede extender con
            formulario, integración de calendarios, estados de cita y seguimiento <strong>personalizado</strong>.
          </p>
        </div>

        <div className="contact__grid">
          <article className="contact-card">
            <span>{'Tel\u00e9fono'}</span>
            <strong>{contactInfo.phone}</strong>
            <p>Atención por llamada o WhatsApp para valoraciones y reservas.</p>
          </article>
          <article className="contact-card">
            <span>Horario</span>
            <strong>{contactInfo.schedule}</strong>
            <p>Flexibilidad para sesiones entre semana y una experiencia cómoda de mantenimiento.</p>
          </article>
          <article className="contact-card">
            <span>{'Direcci\u00f3n'}</span>
            <strong>{contactInfo.address}</strong>
            <p>Ubicación céntrica y fácil de localizar para una experiencia elegante y cómoda.</p>
          </article>
        </div>

        <div className="contact__actions">
          <a
            className="button button--primary"
            href={`https://wa.me/${contactInfo.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            Escribir por WhatsApp
          </a>
          <a className="button button--secondary" href={`tel:${contactInfo.phone.replaceAll(' ', '')}`}>
            Llamar ahora
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
