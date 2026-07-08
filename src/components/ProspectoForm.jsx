import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { FORM, WHATSAPP_NUMBER, APPS_SCRIPT_URL, GMAPS_KEY } from '../config.js'
import { IconWhatsApp, IconAlert, IconCheck } from './Icons.jsx'

// --- Google Places: carga perezosa (solo cuando el usuario toca el campo dirección) ---
let mapsPromise = null
function loadGoogleMaps() {
  if (!GMAPS_KEY) return Promise.reject(new Error('sin-key'))
  if (window.google?.maps?.places) return Promise.resolve()
  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places&language=es&region=MX`
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return mapsPromise
}

function construirMensaje(d) {
  const lineas = [
    '🌐 *Nuevo registro — Inter Node*',
    '',
    `*Nombre:* ${d.nombre}`,
    `*WhatsApp:* ${d.telefono}`,
    `*Dirección:* ${d.direccion}`,
  ]
  if (d.lat && d.lng) lineas.push(`*Ubicación:* https://maps.google.com/?q=${d.lat},${d.lng}`)
  if (d.plan) lineas.push(`*Plan de interés:* ${d.plan}`)
  if (d.inmueble) lineas.push(`*Tipo de inmueble:* ${d.inmueble}`)
  if (d.internet) {
    const conQuien = d.internet === 'Sí' && d.internetQuien ? ` (${d.internetQuien})` : ''
    lineas.push(`*¿Ya tiene internet?:* ${d.internet}${conQuien}`)
  }
  if (d.referencias) lineas.push(`*Referencias:* ${d.referencias}`)
  if (d.detalles) lineas.push(`*Detalles:* ${d.detalles}`)
  lineas.push('', '_Quiero ser de los primeros cuando lleguen a mi zona._')
  return lineas.join('\n')
}

// Grupo de chips de selección única
function ChipGroup({ label, helper, opciones, value, onChange, name }) {
  return (
    <div className="field" role="group" aria-label={label}>
      <span className="chip-label">{label}</span>
      <div className="chips">
        {opciones.map((op) => (
          <button
            type="button"
            key={op}
            className={`chip${value === op ? ' chip--on' : ''}`}
            aria-pressed={value === op}
            onClick={() => onChange(name, value === op ? '' : op)}
          >
            {op}
          </button>
        ))}
      </div>
      {helper && <p className="helper">{helper}</p>}
    </div>
  )
}

const TOTAL_PASOS = 4

export default function ProspectoForm() {
  const [datos, setDatos] = useState({
    nombre: '', telefono: '', direccion: '',
    plan: '', inmueble: '', internet: '', internetQuien: '',
    referencias: '', detalles: '', lat: '', lng: '',
  })
  const [errores, setErrores] = useState({})
  const [paso, setPaso] = useState(0)
  const [estado, setEstado] = useState('idle') // idle | enviando | exito
  const [ultimaUrl, setUltimaUrl] = useState('')
  const [dir, setDir] = useState(1) // dirección de la transición (1 adelante, -1 atrás)
  const direccionRef = useRef(null)
  const autocompleteListo = useRef(false)
  const quieto = useReducedMotion()

  function activarAutocomplete() {
    if (autocompleteListo.current) return
    autocompleteListo.current = true
    loadGoogleMaps()
      .then(() => {
        const ac = new window.google.maps.places.Autocomplete(direccionRef.current, {
          componentRestrictions: { country: 'mx' },
          fields: ['formatted_address', 'geometry'],
          types: ['address'],
        })
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          const loc = place.geometry?.location
          setDatos((d) => ({
            ...d,
            direccion: place.formatted_address ?? d.direccion,
            lat: loc ? loc.lat().toFixed(6) : '',
            lng: loc ? loc.lng().toFixed(6) : '',
          }))
        })
      })
      .catch(() => {})
  }

  // Preselección de plan desde una tarjeta (#registro?plan=... o evento)
  useEffect(() => {
    const leerHash = () => {
      const plan = new URLSearchParams(window.location.hash.split('?')[1] || '').get('plan')
      if (plan) setDatos((d) => ({ ...d, plan: decodeURIComponent(plan) }))
    }
    leerHash()
    const onEvento = (e) => setDatos((d) => ({ ...d, plan: e.detail }))
    window.addEventListener('plan-elegido', onEvento)
    return () => window.removeEventListener('plan-elegido', onEvento)
  }, [])

  function setCampo(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }
  function set(campo) {
    return (e) => {
      setDatos((d) => ({ ...d, [campo]: e.target.value }))
      if (errores[campo]) setErrores((errs) => ({ ...errs, [campo]: null }))
    }
  }

  // Validación por paso
  function erroresDePaso(p, d) {
    const errs = {}
    if (p === 0) {
      if (!d.nombre.trim()) errs.nombre = FORM.errores.nombre
      if (d.telefono.replace(/\D/g, '').length < 10) errs.telefono = FORM.errores.telefono
    }
    if (p === 1) {
      if (!d.direccion.trim()) errs.direccion = FORM.errores.direccion
    }
    // paso 2 (calificación) y 3 (resumen) no tienen requeridos
    return errs
  }

  function avanzar() {
    const errs = erroresDePaso(paso, datos)
    setErrores(errs)
    if (Object.keys(errs).length > 0) {
      document.getElementById(`campo-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setDir(1)
    setPaso((p) => Math.min(p + 1, TOTAL_PASOS - 1))
  }
  function retroceder() {
    setDir(-1)
    setPaso((p) => Math.max(p - 1, 0))
  }

  function enviar() {
    // Validación total por seguridad
    const errs = { ...erroresDePaso(0, datos), ...erroresDePaso(1, datos) }
    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      setDir(-1)
      setPaso(errs.direccion && !errs.nombre && !errs.telefono ? 1 : 0)
      return
    }
    setEstado('enviando')
    if (APPS_SCRIPT_URL) {
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(datos),
      }).catch(() => {})
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(construirMensaje(datos))}`
    setUltimaUrl(url)
    window.open(url, '_blank', 'noopener')
    setEstado('exito')
  }

  const variants = {
    enter: (d) => ({ x: quieto ? 0 : d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: quieto ? 0 : d * -40, opacity: 0 }),
  }

  const meta = FORM.pasos[paso]

  return (
    <section className="registro" id="registro" aria-labelledby="registro-titulo">
      <div className="container">
        <span className="eyebrow-sec">Regístrate gratis</span>
        <h2 id="registro-titulo" className="pregunta">{FORM.titulo}</h2>
        <p className="registro-sub">{FORM.sub}</p>

        <div className="form-card">
          {estado === 'exito' ? (
            <div className="form-exito" role="status">
              <IconCheck />
              <span>
                {FORM.exito}{' '}
                <button type="button" onClick={() => window.open(ultimaUrl, '_blank', 'noopener')}>
                  {FORM.reintento}
                </button>
              </span>
            </div>
          ) : (
            <>
              {/* Progreso */}
              <div className="wizard-progreso" aria-hidden="true">
                {Array.from({ length: TOTAL_PASOS }).map((_, i) => (
                  <span key={i} className={`wizard-step-dot${i <= paso ? ' on' : ''}`} />
                ))}
              </div>
              <p className="wizard-paso-label">Paso {paso + 1} de {TOTAL_PASOS}</p>

              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={paso}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="wizard-paso-titulo">{meta.titulo}</h3>
                  <p className="wizard-paso-sub">{meta.sub}</p>

                  {/* Paso 1 — contacto */}
                  {paso === 0 && (
                    <>
                      <div className="field">
                        <label htmlFor="campo-nombre">Tu nombre *</label>
                        <input
                          id="campo-nombre" type="text" autoComplete="name"
                          placeholder="Ej. María González"
                          value={datos.nombre} onChange={set('nombre')}
                          aria-invalid={!!errores.nombre}
                          aria-describedby={errores.nombre ? 'error-nombre' : undefined}
                        />
                        {errores.nombre && <p className="error" id="error-nombre" role="alert"><IconAlert /> {errores.nombre}</p>}
                      </div>
                      <div className="field">
                        <label htmlFor="campo-telefono">Tu WhatsApp *</label>
                        <input
                          id="campo-telefono" type="tel" inputMode="numeric" autoComplete="tel"
                          placeholder="Ej. 622 142 4577"
                          value={datos.telefono} onChange={set('telefono')}
                          aria-invalid={!!errores.telefono}
                          aria-describedby={errores.telefono ? 'error-telefono' : 'helper-telefono'}
                        />
                        {errores.telefono
                          ? <p className="error" id="error-telefono" role="alert"><IconAlert /> {errores.telefono}</p>
                          : <p className="helper" id="helper-telefono">Aquí te avisamos cuando tu zona esté lista.</p>}
                      </div>
                    </>
                  )}

                  {/* Paso 2 — dirección */}
                  {paso === 1 && (
                    <>
                      <div className="field">
                        <label htmlFor="campo-direccion">Tu dirección *</label>
                        <input
                          id="campo-direccion" ref={direccionRef} type="text" autoComplete="street-address"
                          placeholder="Calle, número y colonia"
                          value={datos.direccion} onChange={set('direccion')} onFocus={activarAutocomplete}
                          aria-invalid={!!errores.direccion}
                          aria-describedby={errores.direccion ? 'error-direccion' : 'helper-direccion'}
                        />
                        {errores.direccion
                          ? <p className="error" id="error-direccion" role="alert"><IconAlert /> {errores.direccion}</p>
                          : <p className="helper" id="helper-direccion">Entre más exacta, más rápido llega el técnico el día uno.</p>}
                      </div>
                      <div className="field">
                        <label htmlFor="campo-referencias">Referencias <span className="opcional">(opcional)</span></label>
                        <input
                          id="campo-referencias" type="text"
                          placeholder="Ej. Portón azul, frente a la tiendita"
                          value={datos.referencias} onChange={set('referencias')}
                          aria-describedby="helper-referencias"
                        />
                        <p className="helper" id="helper-referencias">Para que el técnico llegue a la primera.</p>
                      </div>
                    </>
                  )}

                  {/* Paso 3 — calificación */}
                  {paso === 2 && (
                    <>
                      <ChipGroup label={FORM.plan.label} helper={FORM.plan.helper} opciones={FORM.plan.opciones}
                        value={datos.plan} onChange={setCampo} name="plan" />
                      <ChipGroup label={FORM.inmueble.label} opciones={FORM.inmueble.opciones}
                        value={datos.inmueble} onChange={setCampo} name="inmueble" />
                      <div className="field" role="group" aria-label={FORM.internet.label}>
                        <span className="chip-label">{FORM.internet.label}</span>
                        <div className="chips">
                          {FORM.internet.opciones.map((op) => (
                            <button type="button" key={op}
                              className={`chip${datos.internet === op ? ' chip--on' : ''}`}
                              aria-pressed={datos.internet === op}
                              onClick={() => setCampo('internet', datos.internet === op ? '' : op)}>
                              {op}
                            </button>
                          ))}
                        </div>
                        {datos.internet === 'Sí' && (
                          <input className="chip-extra" type="text" placeholder={FORM.internet.conQuienPh}
                            value={datos.internetQuien} onChange={set('internetQuien')}
                            aria-label="¿Con qué proveedor? (opcional)" />
                        )}
                      </div>
                      <div className="field">
                        <label htmlFor="campo-detalles">Algo más que debamos saber <span className="opcional">(opcional)</span></label>
                        <textarea id="campo-detalles" rows={2}
                          placeholder="Ej. Segundo piso, hay poste enfrente, tengo perro"
                          value={datos.detalles} onChange={set('detalles')} />
                      </div>
                    </>
                  )}

                  {/* Paso 4 — resumen */}
                  {paso === 3 && (
                    <dl className="resumen">
                      <div className="resumen-row"><dt>Nombre</dt><dd>{datos.nombre || '—'}</dd></div>
                      <div className="resumen-row"><dt>WhatsApp</dt><dd>{datos.telefono || '—'}</dd></div>
                      <div className="resumen-row"><dt>Dirección</dt><dd>{datos.direccion || '—'}</dd></div>
                      {datos.plan && <div className="resumen-row"><dt>Plan</dt><dd>{datos.plan}</dd></div>}
                      {datos.inmueble && <div className="resumen-row"><dt>Inmueble</dt><dd>{datos.inmueble}</dd></div>}
                      {datos.internet && <div className="resumen-row"><dt>¿Tiene internet?</dt><dd>{datos.internet}{datos.internet === 'Sí' && datos.internetQuien ? ` (${datos.internetQuien})` : ''}</dd></div>}
                    </dl>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navegación */}
              {paso < TOTAL_PASOS - 1 ? (
                <div className="wizard-nav">
                  {paso > 0 && <button type="button" className="btn-atras" onClick={retroceder}>{FORM.atras}</button>}
                  <button type="button" className="btn-siguiente" onClick={avanzar}>{FORM.siguiente}</button>
                </div>
              ) : (
                <>
                  <div className="wizard-nav">
                    <button type="button" className="btn-atras" onClick={retroceder}>{FORM.atras}</button>
                  </div>
                  <button className="btn-whatsapp" type="button" onClick={enviar} disabled={estado === 'enviando'} style={{ marginTop: 'var(--sp-3)' }}>
                    <IconWhatsApp />
                    {estado === 'enviando' ? FORM.enviando : FORM.boton}
                  </button>
                  <p className="form-micro">{FORM.micro}</p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
