import './BusinessInfo.css'

function BusinessInfo({ contactInfo }) {
  return (
    <section className="business-info">
      <div className="business-info__inner">
        <article className="business-info__item">
          <span>Contacto</span>
          <strong>{contactInfo.phone}</strong>
          <p>Reservas, valoraciones y atención por WhatsApp.</p>
        </article>
        <article className="business-info__item">
          <span>Horario</span>
          <strong>{contactInfo.schedule}</strong>
          <p>Citas personalizadas con atención pausada y puntual.</p>
        </article>
        <article className="business-info__item">
          <span>Dirección</span>
          <strong>{contactInfo.address}</strong>
          <p>Estudio de estética premium en una zona céntrica y accesible.</p>
        </article>
      </div>
    </section>
  )
}

export default BusinessInfo
