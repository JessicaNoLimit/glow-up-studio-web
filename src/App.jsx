import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import ServiceModal from './components/ServiceModal'
import BookingModal from './components/BookingModal'
import Benefits from './components/Benefits'
import About from './components/About'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import { services } from './data/servicesData'
import './App.css'

const benefits = [
  {
    title: 'DiagnÃ³stico personalizado',
  },
  {
    title: 'Especialistas en estÃ©tica avanzada',
  },
  {
    title: 'Protocolos higiÃ©nicos y materiales de alta calidad',
  },
  {
    title: 'Experiencia premium, serena y cuidada',
  },
]

const galleryItems = [
  {
    title: 'DiseÃ±o de cejas',
    description: 'Microblading y micropigmentaciÃ³n con resultado natural, simÃ©trico y elegante.',
  },
  {
    title: 'PestaÃ±as y mirada',
    description: 'Lifting y tratamientos de mirada para abrir la expresiÃ³n con una mirada definida y natural.',
  },
  {
    title: 'Faciales glow',
    description: 'Protocolos faciales para luminosidad, hidrataciÃ³n y una piel cuidada de forma visible.',
  },
]

const contactInfo = {
  phone: '+34 611 245 982',
  whatsapp: '34611245982',
  schedule: 'Lunes a viernes de 10:00 a 20:00 Â· SÃ¡bados de 10:00 a 14:00',
  address: 'Calle Serrano 128, Salamanca, Madrid',
  brand: 'Glow Up Studio',
}

function App() {
  const [activeServiceSlug, setActiveServiceSlug] = useState(null)
  const [bookingSelection, setBookingSelection] = useState(null)
  const activeService = services.find((service) => service.slug === activeServiceSlug) ?? null

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero contactInfo={contactInfo} />
        <Services services={services} onOpenService={setActiveServiceSlug} />
        <Benefits benefits={benefits} />
        <About />
        <Gallery items={galleryItems} />
        <Contact contactInfo={contactInfo} />
      </main>
      <Footer />
      <BackToTop />
      <FloatingWhatsApp phone={contactInfo.whatsapp} />
      {activeService ? (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveServiceSlug(null)}
          onReserveTreatment={(service, treatment) => {
            setActiveServiceSlug(null)
            setBookingSelection({
              serviceTitle: service.title,
              treatment,
            })
          }}
        />
      ) : null}
      {bookingSelection ? (
        <BookingModal
          treatment={bookingSelection.treatment}
          serviceTitle={bookingSelection.serviceTitle}
          onClose={() => setBookingSelection(null)}
        />
      ) : null}
    </div>
  )
}

export default App
