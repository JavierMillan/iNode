import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { BENEFICIOS } from '../config.js'
import { useReveal } from '../hooks/useReveal.js'

// ¿Qué hacen diferente? — 2 diferenciales grandes (glass) + acordeón exclusivo.
export default function Beneficios() {
  const ref = useReveal()
  const quieto = useReducedMotion()
  const [abierto, setAbierto] = useState(null) // solo uno abierto a la vez

  const principales = BENEFICIOS.items.slice(0, 2)
  const rapidas = BENEFICIOS.items.slice(2)

  return (
    <section className="seccion" aria-labelledby="beneficios-titulo" ref={ref}>
      <div className="container">
        <span className="eyebrow-sec">Así trabajamos</span>
        <h2 id="beneficios-titulo" className="pregunta">¿Y ustedes qué hacen diferente?</h2>
        <p className="respuesta">{BENEFICIOS.sub}</p>

        <div className="diferenciales">
          {principales.map(({ t, d }, i) => (
            <article key={t} className="dif-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="dif-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>

        <div className="rapidas">
          {rapidas.map(({ t, d }, i) => {
            const open = abierto === i
            return (
              <div className="rapida" key={t}>
                <button
                  type="button"
                  className="rapida-btn"
                  aria-expanded={open}
                  onClick={() => setAbierto(open ? null : i)}
                >
                  {t}
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      className="rapida-panel"
                      initial={quieto ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={quieto ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div>{d}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
