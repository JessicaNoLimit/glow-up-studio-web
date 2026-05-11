import microbladingImage from '../../imagenesservicios/microblading.png'
import micropigmentacionImage from '../../imagenesservicios/micropigmentacion.png'
import pestanasImage from '../../imagenesservicios/pestanas.png'
import facialesImage from '../../imagenesservicios/faciales.png'
import corporalesImage from '../../imagenesservicios/corporales.png'
import manicuraImage from '../../imagenesservicios/manicura.png'

export const services = [
  {
    title: 'Microblading',
    slug: 'microblading',
    description:
      'DiseÃ±o de cejas pelo a pelo para definir, equilibrar y realzar tu expresiÃ³n con un acabado natural.',
    modalDescription:
      'TÃ©cnicas de cejas pensadas para armonizar tu rostro con un resultado preciso, natural y duradero.',
    image: microbladingImage,
    treatments: [
      {
        serviceId: 1,
        name: 'DiseÃ±o de cejas',
        description: 'Estudio de visagismo y forma personalizada',
        duration: '30 min',
        price: '25â‚¬',
      },
      {
        serviceId: 2,
        name: 'Microblading pelo a pelo',
        description: 'DiseÃ±o natural y personalizado',
        duration: '120 min',
        price: '180â‚¬',
      },
      {
        serviceId: 3,
        name: 'Retoque microblading',
        description: 'RevisiÃ³n y perfeccionamiento del resultado',
        duration: '60 min',
        price: '60â‚¬',
      },
    ],
  },
  {
    title: 'MicropigmentaciÃ³n',
    slug: 'micropigmentacion',
    description:
      'Soluciones semipermanentes para cejas, labios y ojos con acabados elegantes y personalizados.',
    modalDescription:
      'DefiniciÃ³n semipermanente para realzar facciones con trazos elegantes, equilibrados y resultados duraderos.',
    image: micropigmentacionImage,
    treatments: [
      {
        serviceId: 4,
        name: 'MicropigmentaciÃ³n cejas',
        description: 'DefiniciÃ³n semipermanente personalizada',
        duration: '120 min',
        price: '220â‚¬',
      },
      {
        serviceId: 5,
        name: 'MicropigmentaciÃ³n labios',
        description: 'Color y definiciÃ³n natural',
        duration: '120 min',
        price: '250â‚¬',
      },
      {
        serviceId: 6,
        name: 'Eyeliner semipermanente',
        description: 'Mirada definida con un acabado elegante',
        duration: '90 min',
        price: '180â‚¬',
      },
      {
        serviceId: 7,
        name: 'Retoque micropigmentaciÃ³n',
        description: 'Mantenimiento del resultado duradero',
        duration: '60 min',
        price: '70â‚¬',
      },
    ],
  },
  {
    title: 'PestaÃ±as',
    slug: 'pestanas',
    description:
      'Tratamientos pensados para abrir la mirada y aportar definiciÃ³n sin perder un resultado natural.',
    modalDescription:
      'Servicios de mirada diseÃ±ados para aportar curvatura, definiciÃ³n y expresiÃ³n con una mirada definida y limpia.',
    image: pestanasImage,
    treatments: [
      {
        serviceId: 8,
        name: 'Lifting de pestaÃ±as',
        description: 'Curvatura natural y elegante',
        duration: '45 min',
        price: '39â‚¬',
      },
      {
        serviceId: 9,
        name: 'Tinte de pestaÃ±as',
        description: 'Intensidad para una mirada definida',
        duration: '20 min',
        price: '15â‚¬',
      },
      {
        serviceId: 10,
        name: 'Extensiones pelo a pelo',
        description: 'MÃ¡s volumen con un efecto natural',
        duration: '90 min',
        price: '65â‚¬',
      },
      {
        serviceId: 11,
        name: 'Relleno extensiones',
        description: 'Mantenimiento personalizado',
        duration: '60 min',
        price: '40â‚¬',
      },
    ],
  },
  {
    title: 'Faciales',
    slug: 'faciales',
    description:
      'Protocolos adaptados a tu piel para recuperar luminosidad, hidrataciÃ³n y una piel cuidada.',
    modalDescription:
      'Rituales faciales personalizados para cuidar la piel, mejorar su equilibrio y potenciar una piel cuidada y luminosa.',
    image: facialesImage,
    treatments: [
      {
        serviceId: 12,
        name: 'Limpieza facial profunda',
        description: 'Higiene, extracciÃ³n y piel cuidada',
        duration: '60 min',
        price: '50â‚¬',
      },
      {
        serviceId: 13,
        name: 'Tratamiento hidratante',
        description: 'NutriciÃ³n y confort personalizado',
        duration: '60 min',
        price: '55â‚¬',
      },
      {
        serviceId: 14,
        name: 'Tratamiento iluminador',
        description: 'Luminosidad natural y elegante',
        duration: '60 min',
        price: '60â‚¬',
      },
      {
        serviceId: 15,
        name: 'Tratamiento anti-edad',
        description: 'ReafirmaciÃ³n y resultados duraderos',
        duration: '75 min',
        price: '75â‚¬',
      },
      {
        serviceId: 16,
        name: 'Tratamiento piel sensible',
        description: 'Calma y cuidado personalizado',
        duration: '60 min',
        price: '55â‚¬',
      },
    ],
  },
  {
    title: 'Corporales',
    slug: 'corporales',
    description:
      'Tratamientos orientados al bienestar, la remodelaciÃ³n y una experiencia de cuidado integral.',
    modalDescription:
      'Propuestas corporales enfocadas en bienestar, drenaje, firmeza y remodelaciÃ³n con un enfoque personalizado.',
    image: corporalesImage,
    treatments: [
      {
        serviceId: 17,
        name: 'Maderoterapia',
        description: 'RemodelaciÃ³n corporal personalizada',
        duration: '50 min',
        price: '45â‚¬',
      },
      {
        serviceId: 18,
        name: 'Presoterapia',
        description: 'Drenaje y sensaciÃ³n de ligereza',
        duration: '30 min',
        price: '30â‚¬',
      },
      {
        serviceId: 19,
        name: 'Tratamiento reductor',
        description: 'ReducciÃ³n de volumen duradera',
        duration: '60 min',
        price: '60â‚¬',
      },
      {
        serviceId: 20,
        name: 'Tratamiento reafirmante',
        description: 'Mejora de firmeza con resultados duraderos',
        duration: '60 min',
        price: '65â‚¬',
      },
    ],
  },
  {
    title: 'Manicura',
    slug: 'manicura',
    description:
      'Manos cuidadas, esmaltado impecable y acabados duraderos para una imagen siempre elegante.',
    modalDescription:
      'Servicios de manicura pensados para mantener unas manos cuidadas, elegantes y siempre impecables.',
    image: manicuraImage,
    treatments: [
      {
        serviceId: 21,
        name: 'Manicura bÃ¡sica',
        description: 'Cuidado y esmaltado natural',
        duration: '30 min',
        price: '15â‚¬',
      },
      {
        serviceId: 22,
        name: 'Manicura semipermanente',
        description: 'Color duradero y elegante',
        duration: '60 min',
        price: '25â‚¬',
      },
      {
        serviceId: 23,
        name: 'Refuerzo de uÃ±as',
        description: 'Fortalecimiento personalizado',
        duration: '60 min',
        price: '30â‚¬',
      },
      {
        serviceId: 24,
        name: 'Retirada semipermanente',
        description: 'Retirada segura y cuidadosa',
        duration: '20 min',
        price: '10â‚¬',
      },
    ],
  },
]
