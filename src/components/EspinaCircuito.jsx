import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

// Espina dorsal de circuito: una línea vertical con nodos que recorre toda la
// página (del hero al footer) con una corriente que fluye hacia abajo.
// Se dibuja proporcional a la altura total del documento.
export default function EspinaCircuito() {
  const quieto = useReducedMotion()
  const [h, setH] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const medir = () => setH(document.documentElement.scrollHeight)
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(document.body)
    window.addEventListener('resize', medir)
    return () => { ro.disconnect(); window.removeEventListener('resize', medir) }
  }, [])

  if (!h) return <div className="espina" aria-hidden="true" ref={ref} />

  const W = 120
  // trayectoria vertical con quiebres tipo circuito (baja en zig-zag suave)
  const segs = Math.max(4, Math.floor(h / 700))
  let d = `M60 0`
  let y = 0
  const step = h / segs
  const nodos = [[60, 0]]
  for (let i = 1; i <= segs; i++) {
    const ny = Math.round(step * i)
    const x = i % 2 === 0 ? 60 : (i % 4 === 1 ? 92 : 28)
    const mid = Math.round(y + (ny - y) * 0.6)
    d += ` V${mid} H${x} V${ny}`
    nodos.push([x, ny])
    y = ny
  }

  return (
    <div className="espina" aria-hidden="true" ref={ref}>
      <svg viewBox={`0 0 ${W} ${h}`} width={W} height={h} preserveAspectRatio="none" fill="none">
        <path d={d} stroke="var(--color-sky)" strokeWidth="2" strokeOpacity="0.35" strokeLinecap="round" strokeLinejoin="round" />
        {!quieto && (
          <path
            d={d}
            stroke="var(--color-sky)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="0.08 0.92"
            style={{ filter: 'drop-shadow(0 0 4px var(--color-sky))' }}
          >
            <animate attributeName="stroke-dashoffset" from="1" to="0" dur="6s" repeatCount="indefinite" />
          </path>
        )}
        {nodos.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="var(--color-sky)" fillOpacity="0.6">
            {!quieto && (
              <animate attributeName="fill-opacity" values="0.3;0.9;0.3" dur="2.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            )}
          </circle>
        ))}
      </svg>
    </div>
  )
}
