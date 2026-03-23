import galleryOne from '../../imagenesweb/imagencejas.png'
import galleryTwo from '../../imagenesweb/imagenpesta\u00f1as.png'
import galleryThree from '../../imagenesweb/imagenpielradiante.png'
import './Gallery.css'

const galleryImages = [galleryOne, galleryTwo, galleryThree]

function Gallery({ items }) {
  return (
    <section className="section gallery" id="resultados">
      <div className="section__inner">
        <span className="section__eyebrow">BELLEZA NATURAL, RESULTADOS VISIBLES</span>
        <div className="gallery__header">
          <h2 className="section__title">Resultados elegantes, naturales y pensados para durar.</h2>
          <p className="section__description">
            No creemos en resultados artificiales. Creemos en <strong>piel cuidada</strong>,{' '}
            <strong>mirada definida</strong> y detalles que marcan la diferencia.
          </p>
        </div>

        <div className="gallery__grid">
          {items.map((item, index) => (
            <article className="gallery-card" key={item.title}>
              <img src={galleryImages[index]} alt={item.title} />
              <div className="gallery-card__content">
                <span className="gallery-card__eyebrow">Servicio destacado</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
