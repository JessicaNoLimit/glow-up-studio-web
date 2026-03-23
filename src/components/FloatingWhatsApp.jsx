import './FloatingWhatsApp.css'

function FloatingWhatsApp({ phone }) {
  return (
    <a
      className="floating-whatsapp"
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir conversación de WhatsApp"
    >
      WhatsApp
    </a>
  )
}

export default FloatingWhatsApp
