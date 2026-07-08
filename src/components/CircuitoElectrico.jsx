import { motion, useReducedMotion } from 'motion/react'

// Trazos de red (eco del circuito del logo). Cada uno lleva un pulso de luz
// que viaja como corriente eléctrica (stroke-dashoffset animado).
const TRAZOS = [
  'M690 170 h-90 l-40 -40 h-120 l-30 -30 h-110',
  'M690 205 h-140 l-50 50 h-160 l-30 30 h-90',
  'M810 170 h80 l45 -45 h115 l25 -25 h95',
  'M815 205 h130 l55 55 h145 l35 35 h60',
  'M750 130 v-40 l35 -35 h140',
]
const NODOS = [[300, 100], [220, 285], [1170, 100], [1240, 295], [925, 55]]

/**
 * Fondo de circuito con electricidad.
 * @param {number} opacity  opacidad global del ornamento
 * @param {boolean} draw    si true, los trazos se "dibujan" al montar (hero)
 */
export default function CircuitoElectrico({ opacity = 0.16, draw = false }) {
  const quieto = useReducedMotion()

  return (
    <div className="circuito" aria-hidden="true" style={{ opacity }}>
      <svg viewBox="0 0 1440 380" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* trazos base (tenues, siempre visibles) */}
        {TRAZOS.map((d, i) => (
          <motion.path
            key={`base-${d}`}
            d={d}
            stroke="var(--color-sky)"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            strokeLinecap="round"
            initial={quieto || !draw ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* pulso de corriente que viaja por cada trazo (se apaga en reduced-motion) */}
        {!quieto &&
          TRAZOS.map((d, i) => (
            <motion.path
              key={`pulse-${d}`}
              d={d}
              stroke="var(--color-sky)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.14 0.86"
              initial={{ strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: [1, -1] }}
              transition={{
                duration: 3.2,
                delay: i * 0.6,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ filter: 'drop-shadow(0 0 3px var(--color-sky))' }}
            />
          ))}

        {/* nodos terminales */}
        {NODOS.map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="5"
            fill="var(--color-sky)"
            initial={quieto || !draw ? false : { opacity: 0 }}
            animate={
              quieto
                ? { opacity: 0.7 }
                : { opacity: [0.4, 1, 0.4] }
            }
            transition={
              quieto
                ? {}
                : { duration: 2.4, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
      </svg>
    </div>
  )
}
