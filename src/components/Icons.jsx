// Iconos SVG de línea (estilo Lucide, stroke 1.75) — nunca emojis (design-system/MASTER.md)
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconClock = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IconWrench = () => (
  <svg {...base}><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3z" /></svg>
)
export const IconHeadset = () => (
  <svg {...base}><path d="M4 13a8 8 0 0 1 16 0" /><rect x="3" y="13" width="4" height="6" rx="2" /><rect x="17" y="13" width="4" height="6" rx="2" /><path d="M19 19a3 3 0 0 1-3 3h-3" /></svg>
)
export const IconWifi = () => (
  <svg {...base}><path d="M5 12a10 10 0 0 1 14 0" /><path d="M8 15a6 6 0 0 1 8 0" /><circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" /></svg>
)
export const IconUnlock = () => (
  <svg {...base}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></svg>
)
export const IconWallet = () => (
  <svg {...base}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h.01" /><path d="M3 9h18" /></svg>
)
export const IconRefresh = () => (
  <svg {...base}><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 4v5h-5" /></svg>
)
export const IconAlert = () => (
  <svg {...base} width={16} height={16}><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
)
export const IconCheck = () => (
  <svg {...base} width={20} height={20}><path d="M20 6 9 17l-5-5" /></svg>
)
export const IconX = () => (
  <svg {...base}><path d="M15 9 9 15" /><path d="M9 9l6 6" /><circle cx="12" cy="12" r="9" /></svg>
)
export const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.5 7.5 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.7 4.3 3.8.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3z" />
  </svg>
)

// Globo de marca (eco del logo — globo naranja)
export const IconGlobe = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <path d="M3.5 9h17M3.5 15h17" />
  </svg>
)

export const ICONOS_BENEFICIOS = {
  clock: IconClock,
  wrench: IconWrench,
  headset: IconHeadset,
  wifi: IconWifi,
  unlock: IconUnlock,
  wallet: IconWallet,
  refresh: IconRefresh,
}
