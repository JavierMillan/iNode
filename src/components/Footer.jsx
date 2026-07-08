import { FOOTER, BRAND, PHONE_DISPLAY } from '../config.js'
import { IconGlobe } from './Icons.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-remate">
          El buen internet no se promete. <em>Se instala.</em>
        </p>
        <p className="footer-cierre">{FOOTER.cierre}</p>
        <div className="footer-brand">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <IconGlobe size={20} /> {BRAND.name} · {BRAND.sub}
          </span>
          <span>WhatsApp y llamadas: {PHONE_DISPLAY}</span>
        </div>
      </div>
    </footer>
  )
}
