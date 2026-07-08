import { motion, useReducedMotion } from 'motion/react'
import { HERO } from '../config.js'
import logoUrl from '../assets/inter_node_sin_fondo.png'
import CircuitoHero from './CircuitoHero.jsx'

const entrada = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
}

export default function Hero() {
  const quieto = useReducedMotion()

  return (
    <header className="hero">
      <div className="hero-container hero-marquee-inner">
        <motion.div
          className="hero-inner"
          initial={quieto ? false : 'hidden'}
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
        >
          <motion.span className="hero-eyebrow" variants={entrada}>{HERO.eyebrow}</motion.span>
          <motion.h1 variants={entrada}>
            Sabemos lo importante que es tenerte{' '}
            <span className="subrayado">conectado</span>.
          </motion.h1>
          <motion.p className="hero-sub" variants={entrada}>{HERO.sub}</motion.p>
          <motion.div className="hero-cta-row" variants={entrada}>
            <a className="btn-primary" href="#registro">{HERO.cta}</a>
            <span className="hero-micro">{HERO.micro}</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-logo"
          initial={quieto ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <CircuitoHero />
          <div className="hero-logo-clip">
            <img
              src={logoUrl}
              alt="Inter Node — Internet y Telecom"
              width="470"
              height="300"
              fetchpriority="high"
            />
          </div>
        </motion.div>
      </div>
    </header>
  )
}
