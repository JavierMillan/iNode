// ============================================================
// CONFIG DE CIUDAD/MARCA — esto es lo único que se edita al
// clonar el proyecto para una nueva ciudad.
// ============================================================

// --- WhatsApp destino del formulario ---
// PRUEBAS: número de Javier. PRODUCCIÓN: descomentar el oficial.
export const WHATSAPP_NUMBER = '526221424577' // pruebas
// export const WHATSAPP_NUMBER = '524432573972' // oficial (flyer)

// Número mostrado en pantalla (formato legible)
export const PHONE_DISPLAY = '443 257 3972'

// --- Google Apps Script Web App (guarda registros en Google Sheet) ---
// Pegar aquí la URL generada al publicar apps-script/Code.gs como Web App.
// Si está vacío, el formulario funciona igual (solo WhatsApp, sin Sheet).
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyoNQnYkS9j8KYJr4ipavHnfE8eD4N6p5TlISPf7SpudoHdvPnQlYU-_wVCTtxyUtew/exec'

// --- Google Maps Places API (autocompletado de dirección) ---
// Se inyecta en build: crear archivo .env con VITE_GMAPS_KEY=xxxx
// Si no hay key, el campo de dirección funciona como texto libre.
export const GMAPS_KEY = import.meta.env.VITE_GMAPS_KEY ?? ''

// --- Marca ---
export const BRAND = {
  name: 'INTER NODE',
  sub: 'Internet & Telecom',
  badge: 'Muy pronto en tu ciudad',
}

// --- Copy (fuente: copy-landing-final.md) ---
export const HERO = {
  eyebrow: 'MUY PRONTO EN TU CIUDAD',
  h1: 'Sabemos lo importante que es tenerte conectado.',
  sub: 'Por eso, cuando lleguemos a tu zona, te instalamos en 24 horas. Fibra óptica de verdad y técnicos locales que sí llegan.',
  cta: 'Quiero ser de los primeros',
  micro: 'Registro gratis por WhatsApp · Sin compromiso · Sin contratos forzosos',
}

export const SUENA = {
  titulo: '¿Te suena?',
  escenas: [
    'Pediste permiso en el trabajo para esperar al técnico… y nunca llegó.',
    'Reinicias el módem tres veces cada noche, como ritual.',
    'La videollamada importante… y tú buscando señal por toda la casa.',
  ],
  remate:
    'No estás exagerando. Estar bien conectado ya no es un lujo — y esperar semanas por una instalación tampoco debería ser normal. Nosotros lo hacemos en 24 horas.',
}

export const BENEFICIOS = {
  titulo: 'Así trabajamos',
  sub: 'No son promesas de comercial. Es nuestra forma de operar, todos los días.',
  items: [
    { icon: 'clock', t: 'Instalación en 24 horas', d: 'Te conectamos al día siguiente de que tu zona esté lista.' },
    { icon: 'wrench', t: 'Reparaciones el mismo día', d: 'Si algo falla, no te dejamos esperando al “luego te marcamos”.' },
    { icon: 'headset', t: 'Soporte local que contesta', d: 'Personas reales de tu ciudad, lunes a sábado todo el día.' },
    { icon: 'wifi', t: 'Equipos modernos GPON + WiFi 6', d: 'Tecnología actual, no el módem reciclado de siempre.' },
    { icon: 'unlock', t: 'Sin contratos forzosos', d: 'Te quedas porque quieres, no porque firmaste.' },
    { icon: 'wallet', t: 'Planes prepago', d: 'Tú controlas cuánto y cuándo pagas.' },
    { icon: 'refresh', t: 'Reactivación inmediata sin recargos', d: '¿Se te pasó el pago? Reactivas al momento, sin castigos.' },
  ],
}

export const PRUEBA = {
  titulo: 'No es nuestra primera ciudad',
  cuerpo:
    'Sabemos que suena a promesa de comercial — todos dicen ser los mejores. En la ciudad anterior donde llegamos, la gente dudaba igual. Hoy tienen internet estable y un técnico que llega el mismo día en que reportan. Mismo equipo, misma forma de trabajar: ahora le toca a tu ciudad.',
  // PLACEHOLDER: cuando Félix envíe foto/testimonio real, agregarlo aquí.
  testimonio: null,
}

export const PLANES = {
  titulo: 'Los planes que llegarán a tu zona',
  sub: 'Velocidades simétricas, 100% fibra óptica. Ideal para streaming, gaming y home office.',
  nota: 'Precios de lanzamiento. Aparta tu lugar hoy y te avisamos en cuanto tu zona esté lista.',
  items: [
    { nombre: 'Plan Hogar', mbps: 50, precio: 350, d: 'Para estar conectado sin preocuparte.', destacado: false },
    { nombre: 'Plan Familiar', mbps: 100, precio: 550, d: 'Para que nadie en casa tenga que turnarse el internet.', destacado: true, badge: 'El más elegido' },
    { nombre: 'Plan Premium', mbps: 200, precio: 750, d: 'Para los que viven, trabajan y juegan en línea.', destacado: false },
  ],
}

export const FORM = {
  titulo: 'Aparta tu lugar',
  sub: 'Ya esperaste suficiente por buen internet. Son 3 pasos rápidos y te avisamos en cuanto lleguemos a tu zona — los primeros registrados reciben promoción de apertura.',
  boton: 'Enviar mi registro por WhatsApp',
  micro: 'Se abre tu WhatsApp con el mensaje listo — tú solo lo envías.',
  enviando: 'Preparando tu mensaje…',
  exito: '¡Listo! Se abrió tu WhatsApp con todo tu registro. Solo dale enviar y quedas apartado.',
  reintento: '¿No se abrió? Toca aquí para intentar de nuevo.',
  siguiente: 'Siguiente',
  atras: 'Atrás',
  errores: {
    nombre: 'Nos falta tu nombre — así sabemos con quién hablamos.',
    telefono: 'Ese número no se ve completo. Revisa que tenga 10 dígitos.',
    direccion: 'Sin dirección no sabemos a dónde llevarte el internet. Escribe tu calle y colonia.',
  },
  // Pasos del wizard (tono cercano)
  pasos: [
    { titulo: '¿Con quién tenemos el gusto?', sub: 'Para saber cómo dirigirnos a ti y por dónde avisarte.' },
    { titulo: '¿A dónde te llevamos el internet?', sub: 'Entre más exacta la dirección, más rápido llega el técnico el día uno.' },
    { titulo: '¿Qué te late para tu casa?', sub: 'Con esto preparamos tu instalación a la medida.' },
    { titulo: 'Todo listo, revisa y envía', sub: 'Confirma que todo esté bien y te contactamos por WhatsApp.' },
  ],
  // Campos de calificación (selección rápida)
  plan: {
    label: '¿Qué plan te late?',
    helper: 'Puedes cambiarlo cuando platiquemos.',
    opciones: ['Plan Hogar', 'Plan Familiar', 'Plan Premium', 'Aún no sé'],
  },
  inmueble: {
    label: '¿Dónde lo quieres?',
    opciones: ['Casa', 'Departamento', 'Negocio'],
  },
  // Fraseo neutral — nunca juzga al proveedor actual (guardrail de marca)
  internet: {
    label: '¿Ya cuentas con internet?',
    opciones: ['Sí', 'No'],
    conQuienPh: '¿Con quién? (opcional)',
  },
}

export const FOOTER = {
  cierre: 'Atención local de personas reales. Respuesta rápida cuando la necesitas. Internet que funciona, soporte que responde.',
  remate: 'El buen internet no se promete. Se instala.',
}
