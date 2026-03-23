import aboutVisual from '../../imagenesweb/imagensobreelcentro .png'
import './About.css'

function About() {
  return (
    <section className="section about" id="centro">
      <div className="section__inner grid-two about__layout">
        <div className="about__visual-card">
          <img
            src={aboutVisual}
            alt={'Cabina estética elegante con detalles nude y dorados'}
          />
        </div>

        <div className="about__content">
          <span className="section__eyebrow">Sobre el centro</span>
          <h2 className="section__title">
            {'Atención boutique, detalle impecable y una estética cuidada en cada rincón.'}
          </h2>
          <p className="section__description">
            Glow Up Studio se plantea como un estudio de belleza actual, ordenado y profesional, donde cada
            cita empieza con escucha, <strong>diagnóstico previo</strong> y una{' '}
            <strong>propuesta personalizada</strong> según tus rasgos y objetivos.
          </p>

          <div className="about__cards">
            <div>
              <strong>Valoración previa</strong>
              <span>
                Definimos objetivos, técnica y recomendaciones con un enfoque <strong>personalizado</strong>.
              </span>
            </div>
            <div>
              <strong>Seguimiento post tratamiento</strong>
              <span>
                Cuidamos tu evolución para mantener un resultado <strong>natural, elegante y duradero</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
