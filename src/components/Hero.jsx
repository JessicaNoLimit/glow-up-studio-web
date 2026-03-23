import heroIllustration from '../../imagenesweb/primeraimagen.png'
import './Hero.css'

function Hero({ contactInfo }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero__inner section__inner">
        <div className="hero__content">
          <span className="section__eyebrow">{'Centro de est\u00e9tica premium en Madrid'}</span>
          <h1 className="hero__title">
            {'Resultados naturales, t\u00e9cnica precisa y una experiencia pensada para que quieras volver.'}
          </h1>
          <p className="hero__description">
            Especialistas en mirada y cuidado facial que trabajan con <strong>diagnóstico previo</strong> y{' '}
            <strong>tratamientos personalizados</strong>.
            <br />
            Cuidamos cada detalle para que te sientas en <strong>las mejores manos</strong> desde el
            primer momento.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#contacto">
              Pide tu cita
            </a>
            <a className="button button--secondary" href="#servicios">
              Ver servicios
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__visual-frame">
            <img
              src={heroIllustration}
              alt={'Tratamiento premium de pesta\u00f1as y belleza facial'}
            />
            <div className="hero__visual-overlay" />
          </div>
          <div className="hero__card">
            <span>Asesoramiento personalizado</span>
            <strong>{'No es solo est\u00e9tica. Es c\u00f3mo te ves y c\u00f3mo te sientes.'}</strong>
            <p>
              Valoramos tu piel o tu mirada, te explicamos las opciones y te recomendamos lo mejor para
              ti. Sin compromiso.
            </p>
            <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noreferrer">
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
