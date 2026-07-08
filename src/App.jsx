import { BRAND } from './config.js'
import { IconGlobe } from './components/Icons.jsx'
import Hero from './components/Hero.jsx'
import Suena from './components/Suena.jsx'
import Beneficios from './components/Beneficios.jsx'
import Planes from './components/Planes.jsx'
import ProspectoForm from './components/ProspectoForm.jsx'
import Footer from './components/Footer.jsx'
import EspinaCircuito from './components/EspinaCircuito.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#registro">Ir directo al registro</a>
      <EspinaCircuito />
      <nav className="nav" aria-label="Principal">
        <a className="nav-brand" href="#top" aria-label="Inter Node, inicio">
          <IconGlobe size={18} />
          <span>{BRAND.name}</span>
        </a>
        <a className="nav-cta" href="#registro">Apartar mi lugar</a>
      </nav>
      <main id="top">
        <Hero />
        <Suena />
        <Beneficios />
        <Planes />
        <ProspectoForm />
      </main>
      <Footer />
    </>
  )
}
