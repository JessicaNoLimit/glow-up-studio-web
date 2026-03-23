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
      'Diseño de cejas pelo a pelo para definir, equilibrar y realzar tu expresión con un acabado natural.',
    modalDescription:
      'Técnicas de cejas pensadas para armonizar tu rostro con un resultado preciso, natural y duradero.',
    image: microbladingImage,
    treatments: [
      {
        name: 'Diseño de cejas',
        description: 'Estudio de visagismo y forma personalizada',
        duration: '30 min',
        price: '25€',
      },
      {
        name: 'Microblading pelo a pelo',
        description: 'Diseño natural y personalizado',
        duration: '120 min',
        price: '180€',
      },
      {
        name: 'Retoque microblading',
        description: 'Revisión y perfeccionamiento del resultado',
        duration: '60 min',
        price: '60€',
      },
    ],
  },
  {
    title: 'Micropigmentación',
    slug: 'micropigmentacion',
    description:
      'Soluciones semipermanentes para cejas, labios y ojos con acabados elegantes y personalizados.',
    modalDescription:
      'Definición semipermanente para realzar facciones con trazos elegantes, equilibrados y resultados duraderos.',
    image: micropigmentacionImage,
    treatments: [
      {
        name: 'Micropigmentación cejas',
        description: 'Definición semipermanente personalizada',
        duration: '120 min',
        price: '220€',
      },
      {
        name: 'Micropigmentación labios',
        description: 'Color y definición natural',
        duration: '120 min',
        price: '250€',
      },
      {
        name: 'Eyeliner semipermanente',
        description: 'Mirada definida con un acabado elegante',
        duration: '90 min',
        price: '180€',
      },
      {
        name: 'Retoque micropigmentación',
        description: 'Mantenimiento del resultado duradero',
        duration: '60 min',
        price: '70€',
      },
    ],
  },
  {
    title: 'Pestañas',
    slug: 'pestanas',
    description:
      'Tratamientos pensados para abrir la mirada y aportar definición sin perder un resultado natural.',
    modalDescription:
      'Servicios de mirada diseñados para aportar curvatura, definición y expresión con una mirada definida y limpia.',
    image: pestanasImage,
    treatments: [
      {
        name: 'Lifting de pestañas',
        description: 'Curvatura natural y elegante',
        duration: '45 min',
        price: '39€',
      },
      {
        name: 'Tinte de pestañas',
        description: 'Intensidad para una mirada definida',
        duration: '20 min',
        price: '15€',
      },
      {
        name: 'Extensiones pelo a pelo',
        description: 'Más volumen con un efecto natural',
        duration: '90 min',
        price: '65€',
      },
      {
        name: 'Relleno extensiones',
        description: 'Mantenimiento personalizado',
        duration: '60 min',
        price: '40€',
      },
    ],
  },
  {
    title: 'Faciales',
    slug: 'faciales',
    description:
      'Protocolos adaptados a tu piel para recuperar luminosidad, hidratación y una piel cuidada.',
    modalDescription:
      'Rituales faciales personalizados para cuidar la piel, mejorar su equilibrio y potenciar una piel cuidada y luminosa.',
    image: facialesImage,
    treatments: [
      {
        name: 'Limpieza facial profunda',
        description: 'Higiene, extracción y piel cuidada',
        duration: '60 min',
        price: '50€',
      },
      {
        name: 'Tratamiento hidratante',
        description: 'Nutrición y confort personalizado',
        duration: '60 min',
        price: '55€',
      },
      {
        name: 'Tratamiento iluminador',
        description: 'Luminosidad natural y elegante',
        duration: '60 min',
        price: '60€',
      },
      {
        name: 'Tratamiento anti-edad',
        description: 'Reafirmación y resultados duraderos',
        duration: '75 min',
        price: '75€',
      },
      {
        name: 'Tratamiento piel sensible',
        description: 'Calma y cuidado personalizado',
        duration: '60 min',
        price: '55€',
      },
    ],
  },
  {
    title: 'Corporales',
    slug: 'corporales',
    description:
      'Tratamientos orientados al bienestar, la remodelación y una experiencia de cuidado integral.',
    modalDescription:
      'Propuestas corporales enfocadas en bienestar, drenaje, firmeza y remodelación con un enfoque personalizado.',
    image: corporalesImage,
    treatments: [
      {
        name: 'Maderoterapia',
        description: 'Remodelación corporal personalizada',
        duration: '50 min',
        price: '45€',
      },
      {
        name: 'Presoterapia',
        description: 'Drenaje y sensación de ligereza',
        duration: '30 min',
        price: '30€',
      },
      {
        name: 'Tratamiento reductor',
        description: 'Reducción de volumen duradera',
        duration: '60 min',
        price: '60€',
      },
      {
        name: 'Tratamiento reafirmante',
        description: 'Mejora de firmeza con resultados duraderos',
        duration: '60 min',
        price: '65€',
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
        name: 'Manicura básica',
        description: 'Cuidado y esmaltado natural',
        duration: '30 min',
        price: '15€',
      },
      {
        name: 'Manicura semipermanente',
        description: 'Color duradero y elegante',
        duration: '60 min',
        price: '25€',
      },
      {
        name: 'Refuerzo de uñas',
        description: 'Fortalecimiento personalizado',
        duration: '60 min',
        price: '30€',
      },
      {
        name: 'Retirada semipermanente',
        description: 'Retirada segura y cuidadosa',
        duration: '20 min',
        price: '10€',
      },
    ],
  },
]
