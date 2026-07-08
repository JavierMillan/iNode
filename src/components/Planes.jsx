import { PLANES } from '../config.js'
import { useReveal } from '../hooks/useReveal.js'

// Planes — tarjetas ricas con profundidad; cada una es un CTA que lleva al
// formulario con el plan preseleccionado (#registro?plan=...).
export default function Planes() {
  const ref = useReveal()

  function elegir(nombre) {
    // preselecciona el plan y lleva al form
    window.location.hash = `registro?plan=${encodeURIComponent(nombre)}`
    // notifica al form (por si ya está montado y el hash no dispara re-montaje)
    window.dispatchEvent(new CustomEvent('plan-elegido', { detail: nombre }))
  }

  return (
    <section className="seccion" aria-labelledby="planes-titulo" ref={ref}>
      <div className="container">
        <span className="eyebrow-sec">Elige el tuyo</span>
        <h2 id="planes-titulo" className="pregunta">¿Cuál te late para tu casa?</h2>
        <p className="respuesta">{PLANES.sub}</p>

        <div className="planes-grid">
          {PLANES.items.map((plan, i) => (
            <button
              key={plan.nombre}
              type="button"
              onClick={() => elegir(plan.nombre)}
              className={`plan-card reveal${plan.destacado ? ' plan-card--destacado' : ' plan-card--ghost'}`}
              style={{ transitionDelay: `${i * 90}ms` }}
              aria-label={`Quiero el ${plan.nombre}, ${plan.mbps} megas por $${plan.precio} al mes`}
            >
              {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              <span className="plan-card-nombre">{plan.nombre}</span>
              <span className="plan-card-mbps">{plan.mbps} <span>Mbps</span></span>
              <span className="plan-card-precio">${plan.precio} <span>/mes</span></span>
              <span className="plan-card-desc">{plan.d}</span>
              <span className="plan-card-cta">Quiero este →</span>
            </button>
          ))}
        </div>
        <p className="planes-nota">{PLANES.nota}</p>
      </div>
    </section>
  )
}
