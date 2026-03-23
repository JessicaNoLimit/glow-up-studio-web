import './Header.css'

const navItems = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Compromiso', href: '#beneficios' },
  { label: 'Centro', href: '#centro' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Contacto', href: '#contacto' },
]

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#inicio" aria-label="Ir al inicio">
          <span className="site-header__brand-mark">G</span>
          <span className="site-header__brand-text">
            Glow Up Studio
            <small>Beauty Studio</small>
          </span>
        </a>

        <nav className="site-header__nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="button button--primary site-header__cta" href="#contacto">
          Pide tu cita
        </a>
      </div>
    </header>
  )
}

export default Header
