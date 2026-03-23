import './Services.css'

function Services({ services, onOpenService }) {
  return (
    <section className="section services" id="servicios">
      <div className="section__inner">
        <span className="section__eyebrow">Nuestros servicios</span>
        <div className="services__header">
          <h2 className="section__title">
            {'Tratamientos dise\u00f1ados para resaltar tu belleza natural.'}
          </h2>
        </div>

        <div className="services__grid">
          {services.map((service) => (
            <button
              className="service-card"
              type="button"
              key={service.slug}
              data-servicio={service.slug}
              aria-label={`Ver tratamientos de ${service.title}`}
              onClick={() => onOpenService(service.slug)}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-card__cta">Ver tratamientos</span>
            </button>
          ))}
        </div>

        <p className="section__description services__description">
          Cada servicio se adapta a tus rasgos, tu estilo y tus necesidades para conseguir resultados{' '}
          <strong>elegantes</strong>, <strong>naturales</strong> y <strong>duraderos</strong>.
        </p>
      </div>
    </section>
  )
}

export default Services
