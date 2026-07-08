import { SUENA } from '../config.js'
import { useReveal } from '../hooks/useReveal.js'

// ¿Te suena? — escenas secuenciales con número naranja grande; reveal on scroll.
export default function Suena() {
  const ref = useReveal()
  return (
    <section className="seccion" aria-labelledby="suena-titulo" ref={ref}>
      <div className="container">
        <span className="eyebrow-sec">Un momento</span>
        <h2 id="suena-titulo" className="pregunta">{SUENA.titulo}</h2>
        <ol className="escenas">
          {SUENA.escenas.map((escena, i) => (
            <li key={escena} className="escena reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="escena-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span>{escena}</span>
            </li>
          ))}
        </ol>
        <p className="remate">
          <strong>No estás exagerando.</strong>{' '}
          {SUENA.remate.replace('No estás exagerando. ', '')}
        </p>
      </div>
    </section>
  )
}
