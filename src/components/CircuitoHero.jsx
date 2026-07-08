import { motion, useReducedMotion } from 'motion/react'

// Circuito del hero: los trazos NACEN del chip (logo) y se ramifican hacia afuera.
// El origen (chip) está a la derecha en desktop y arriba-centro en móvil; el SVG
// se ancla al contenedor del chip vía CSS, así que aquí los trazos parten de un
// punto fijo (borde izquierdo del viewBox = donde toca el chip) hacia la izquierda.

// viewBox 900x400. El chip ocupa el centro (~x360-540); los trazos irradian en
// TODAS las direcciones desde sus bordes, extendiéndose bien afuera del panel.
// viewBox 1100x400. Trazos más largos que alcanzan los bordes.
const TRAZOS = [
  // hacia la izquierda (al texto) — nacen del borde izq del chip (~x460)
  'M460 185 H320 l-40 -40 H160 l-30 -30 H10',
  'M460 215 H360 l-50 50 H150 l-40 40 H20',
  // hacia arriba
  'M510 170 V105 l-35 -35 H300 l-25 -25 V10',
  // hacia abajo
  'M510 230 V300 l-45 45 H300 V395',
  // hacia la derecha — nacen del borde der del chip (~x640) y llegan al borde
  'M640 185 H780 l40 -40 H960 l30 -30 H1090',
  'M640 215 H740 l50 50 H960 l30 30 H1080',
  'M640 200 H1090',
]
const NODOS = [
  [10, 115], [20, 295], [275, 10], [300, 395], // izquierda/arriba/abajo
  [1090, 115], [1080, 295], [1090, 200],         // derecha
]

export default function CircuitoHero() {
  const quieto = useReducedMotion()
  return (
    <div className="circuito-hero" aria-hidden="true">
      <svg viewBox="0 0 1100 400" preserveAspectRatio="xMidYMid meet" fill="none">
        {/* trazos base tenues */}
        {TRAZOS.map((d, i) => (
          <motion.path
            key={`b-${d}`}
            d={d}
            stroke="var(--color-sky)"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            strokeLinecap="round"
            initial={quieto ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        {/* pulso de corriente que sale del chip hacia afuera */}
        {!quieto &&
          TRAZOS.map((d, i) => (
            <motion.path
              key={`p-${d}`}
              d={d}
              stroke="var(--color-sky)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.16 0.84"
              initial={{ strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: [1, 0] }}
              transition={{ duration: 2.8, delay: 1 + i * 0.5, repeat: Infinity, ease: 'linear' }}
              style={{ filter: 'drop-shadow(0 0 3px var(--color-sky))' }}
            />
          ))}
        {NODOS.map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="5"
            fill="var(--color-sky)"
            initial={quieto ? false : { opacity: 0 }}
            animate={quieto ? { opacity: 0.7 } : { opacity: [0.4, 1, 0.4] }}
            transition={quieto ? {} : { duration: 2.4, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    </div>
  )
}
