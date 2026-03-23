import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>Glow Up Studio</strong>
          <p>Centro de estética premium especializado en mirada, piel y tratamientos personalizados.</p>
          <p className="site-footer__legal">2026 Glow Up Studio. Todos los derechos reservados.</p>
        </div>
        <div className="site-footer__links">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
