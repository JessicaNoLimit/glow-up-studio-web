import './Benefits.css'

function Benefits({ benefits }) {
  return (
    <section className="section benefits" id="beneficios">
      <div className="section__inner benefits__inner">
        <div className="benefits__content">
          <span className="section__eyebrow">{'Por qu\u00e9 elegirnos'}</span>
          <h2 className="section__title">
            {'No es solo est\u00e9tica.'}
            <br />
            {'Es saber en qu\u00e9 manos est\u00e1s.'}
          </h2>
          <p className="section__description">
            Especialistas en estética avanzada, <strong>resultados naturales</strong> y una atención
            completamente <strong>personalizada</strong>.
          </p>
        </div>

        <div className="benefits__list" role="list" aria-label="Razones para elegir el centro">
          {benefits.map((benefit) => (
            <article className="benefit-item" key={benefit.title} role="listitem">
              <div className="benefit-item__content">
                <strong>{benefit.title}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
