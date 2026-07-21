import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { FORM, WHATSAPP_NUMBER, APPS_SCRIPT_URL, GMAPS_KEY } from '../config.js'
import { IconWhatsApp, IconAlert, IconCheck } from './Icons.jsx'

// --- Google Places (New): carga perezosa con el loader oficial ---
let mapsPromise = null
function loadGoogleMaps() {
  if (!GMAPS_KEY) return Promise.reject(new Error('sin-key'))
  if (window.google?.maps?.importLibrary) return Promise.resolve()
  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      // bootstrap oficial del loader de Google Maps JS (habilita importLibrary)
      ;((g) => {
        let h, a, k, p = 'The Google Maps JavaScript API'
        const c = 'google', l = 'importLibrary', q = '__ib__', m = document, b = window
        let bb = b[c] || (b[c] = {})
        const d = bb.maps || (bb.maps = {}), r = new Set(), e = new URLSearchParams()
        const u = () =>
          h ||
          (h = new Promise(async (res, rej) => {
            a = m.createElement('script')
            e.set('libraries', [...r] + '')
            for (k in g) e.set(k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()), g[k])
            e.set('callback', c + '.maps.' + q)
            a.src = `https://maps.${c}apis.com/maps/api/js?` + e
            d[q] = res
            a.onerror = () => (h = rej(Error(p + ' could not load.')))
            a.nonce = m.querySelector('script[nonce]')?.nonce || ''
            m.head.append(a)
          }))
        d[l]
          ? console.warn(p + ' only loads once. Ignoring:', g)
          : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)))
      })({ key: GMAPS_KEY, v: 'weekly', language: 'es', region: 'MX' })
      resolve()
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
  const [sugerencias, setSugerencias] = useState([])
  const [dirVerificada, setDirVerificada] = useState(false)
  const direccionRef = useRef(null)
  const placesLib = useRef(null)      // { AutocompleteSuggestion, AutocompleteSessionToken, Place }
  const sessionToken = useRef(null)
  const quieto = useReducedMotion()

  // Carga perezosa de la librería Places (New) al enfocar el campo dirección
  function activarAutocomplete() {
    if (placesLib.current) return
    loadGoogleMaps()
      .then(() => window.google.maps.importLibrary('places'))
      .then((lib) => {
        placesLib.current = lib
        sessionToken.current = new lib.AutocompleteSessionToken()
      })
      .catch(() => {}) // sin key o falla: el campo sigue como texto libre
  }

  // Pide sugerencias de dirección conforme el usuario escribe (Places New)
  async function buscarDireccion(texto) {
    setDirVerificada(false)
    if (!placesLib.current || texto.trim().length < 4) {
      setSugerencias([])
      return
    }
    try {
      const { suggestions } =
        await placesLib.current.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: texto,
          sessionToken: sessionToken.current,
          includedRegionCodes: ['mx'],
          language: 'es',
        })
      setSugerencias(
        (suggestions || [])
          .filter((s) => s.placePrediction)
          .slice(0, 5)
          .map((s) => s.placePrediction)
      )
    } catch {
      setSugerencias([])
    }
  }

  // Al elegir una sugerencia: trae dirección formateada + lat/lng exactos
  async function elegirDireccion(pred) {
    try {
      const place = pred.toPlace()
      await place.fetchFields({ fields: ['formattedAddress', 'location'] })
      setDatos((d) => ({
        ...d,
        direccion: place.formattedAddress ?? pred.text?.text ?? d.direccion,
        lat: place.location ? place.location.lat().toFixed(6) : '',
        lng: place.location ? place.location.lng().toFixed(6) : '',
      }))
      setDirVerificada(true)
    } catch {
      setDatos((d) => ({ ...d, direccion: pred.text?.text ?? d.direccion }))
    }
    setSugerencias([])
    // nuevo token para la próxima búsqueda (facturación por sesión)
    sessionToken.current = new placesLib.current.AutocompleteSessionToken()
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
                          placeholder="Ej. 443 123 4567"
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
                      <div className="field field--dir">
                        <label htmlFor="campo-direccion">Tu dirección *</label>
                        <div className="dir-wrap">
                          <input
                            id="campo-direccion" ref={direccionRef} type="text" autoComplete="off"
                            placeholder="Escribe tu calle y número…"
                            value={datos.direccion}
                            onChange={(e) => { set('direccion')(e); buscarDireccion(e.target.value) }}
                            onFocus={activarAutocomplete}
                            aria-invalid={!!errores.direccion}
                            aria-describedby={errores.direccion ? 'error-direccion' : 'helper-direccion'}
                            aria-autocomplete="list"
                          />
                          {dirVerificada && (
                            <span className="dir-check" title="Dirección verificada"><IconCheck /></span>
                          )}
                          {sugerencias.length > 0 && (
                            <ul className="dir-sugerencias" role="listbox">
                              {sugerencias.map((pred) => (
                                <li key={pred.placeId} role="option" aria-selected="false">
                                  <button type="button" onClick={() => elegirDireccion(pred)}>
                                    {pred.text?.text ?? ''}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {errores.direccion
                          ? <p className="error" id="error-direccion" role="alert"><IconAlert /> {errores.direccion}</p>
                          : <p className="helper" id="helper-direccion">
                              {dirVerificada
                                ? 'Dirección verificada ✓ — así el técnico llega exacto.'
                                : 'Empieza a escribir y elige tu dirección de la lista.'}
                            </p>}
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
