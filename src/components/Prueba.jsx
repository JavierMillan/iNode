import { PRUEBA } from '../config.js'

// Pregunta 3 — prosa directa; el placeholder de evidencia es honesto, no inventado.
export default function Prueba() {
  return (
    <section className="charla" aria-labelledby="prueba-titulo">
      <div className="container">
        <h2 id="prueba-titulo" className="pregunta">¿Y por qué les creería?</h2>
        <p className="prueba-texto">{PRUEBA.cuerpo}</p>
        {!PRUEBA.testimonio && (
          <p className="prueba-pendiente">
            Aquí va una instalación real de la ciudad anterior — foto y testimonio en camino.
          </p>
        )}
      </div>
    </section>
  )
}
