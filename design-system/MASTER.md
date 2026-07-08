# Design System MASTER — Inter Node Landing
<!-- Fuente: Brand Profile (brand-profile-internode.md) + ui-ux-pro-max (reglas aplicadas manualmente; DB del skill no disponible) -->
<!-- Regla de retrieval: si existe design-system/pages/<page>.md, ese archivo overridea a este MASTER. -->

## Pattern
Landing de conversión pre-lanzamiento (lead capture). Estructura vertical mobile-first:
1. **Hero** — promesa (24h) + CTA primario que ancla al formulario. Una sola acción primaria por pantalla (`primary-action`).
2. **Beneficios** — grid de 7 beneficios con iconos SVG de línea (Lucide-style, stroke 1.75px, NUNCA emojis — `no-emoji-icons`).
3. **Planes** — 3 cards apiladas en móvil / fila en desktop; Familiar destacada (borde naranja + badge + escala). Precios con números tabulares (`number-tabular`).
4. **Formulario de registro** — la conversión. Campos con labels visibles, validación on-blur, teclados semánticos.
5. **Footer** — cierre de marca + datos de contacto.

## Style
- Minimalismo premium 60% / geométrico-circuito 25% / calidez humana 15% (del Brand Profile §5).
- Cards: radius 12px, sombra azulada `0 8px 24px rgba(18,43,92,0.10)`, elevación consistente (`elevation-consistent`).
- Botones: píldora (radius 999px), altura ≥48px (`touch-target-size`), feedback de press con scale 0.97 + transición 150-200ms (`scale-feedback`, `tap-feedback-speed`).
- Un solo set de iconos, outline, stroke uniforme (`icon-style-consistent`, `stroke-consistency`).

## Colors (tokens semánticos — nunca hex crudo en componentes: `color-semantic`)
```css
--color-paper: #F7FAFE;      /* fondo dominante */
--color-cloud: #EAF1FA;      /* superficies alternas */
--color-primary: #1E4FA8;    /* azul Node — headings, links, estructura */
--color-ink: #122B5C;        /* navy — texto principal (13.5:1 AAA) */
--color-ink-deep: #0F1E3D;   /* near-black de marca (nunca #000) */
--color-muted: #5A6B8C;      /* texto secundario (5.4:1 AA) */
--color-line: #D7E1F0;       /* bordes, hairlines */
--color-accent: #F5821F;     /* naranja Señal — SOLO CTA/badge/highlight, 1 por sección */
--color-whatsapp: #25D366;   /* solo acciones WhatsApp */
--color-success: #2E9E5B;
--color-error: #C43D2F;
--gradient-brand: linear-gradient(135deg, #3D8FD1, #1E3C8C);
```
- CTA naranja lleva texto `--color-ink` (5.3:1 AA) — nunca blanco sobre naranja (2.5:1 falla).
- Naranja nunca en texto pequeño sobre claro (`color-accessible-pairs`).
- Estados de error/éxito siempre con icono + texto, no solo color (`color-not-only`).

## Typography
- Headings: **Sora** 600/700, leading 1.15, tracking -0.5px. Body: **Inter** 400/500/600, leading 1.55.
- Escala: 12·14·16·20·25·31·39·49 (base 16px, ratio 1.250). Body móvil ≥16px (`readable-font-size`, evita auto-zoom iOS).
- Números protagonistas (Mbps, precios, "24") en Sora 700 a 39-49px, `font-variant-numeric: tabular-nums`.
- Line length ≤65ch. Alineación izquierda; centrado solo display corto y cards de planes.
- Google Fonts con `font-display: swap` + preload solo pesos críticos (`font-loading`, `font-preload`).

## Spacing & Layout
- Escala 4·8·12·16·24·32·48·64·96 (grid 8px). Secciones: 64px móvil / 96px desktop.
- Contenedor: fluido con padding 20px móvil; max-width 1120px desktop; breakpoints 375/768/1024.
- `min-height: 100dvh` (nunca 100vh) para el hero (`viewport-units`).
- Sin scroll horizontal; imágenes/ilustraciones con `width/height` o `aspect-ratio` declarado (`content-jumping`, CLS).
- Touch targets ≥44×44px con ≥8px de separación (`touch-target-size`, `touch-spacing`).

## Formulario (reglas críticas de conversión — §8 del skill)
- Label visible SIEMPRE encima del campo, nunca placeholder-only (`input-labels`).
- Placeholder = ejemplo, no instrucción. Helper text persistente bajo campos complejos (`input-helper-text`).
- Tipos semánticos: `type="tel"` + `inputmode="numeric"` para teléfono, `autocomplete="name|tel|street-address"` (`input-type-keyboard`, `autofill-support`).
- Validación on-blur, no por tecla; error debajo del campo con causa + cómo corregir (`inline-validation`, `error-clarity`, `error-placement`).
- Errores con `role="alert"` (`aria-live-errors`); tras submit fallido, foco al primer campo inválido (`focus-management`).
- Inputs altura ≥48px, radius 12px, focus ring visible 2-3px azul (`focus-states` — nunca `outline: none` sin reemplazo).
- Botón submit: estado loading con spinner + disabled durante el envío (`loading-buttons`, `submit-feedback`); éxito con confirmación visual clara (`success-feedback`).
- Requeridos marcados con * y leyenda (`required-indicators`).
- Progressive disclosure: los "3 elementos clave" y referencias como campos opcionales visualmente ligeros — no abrumar al inicio (`progressive-disclosure`).

## Animation
- Micro-interacciones 150-300ms, `ease-out` al entrar / `ease-in` al salir (`duration-timing`, `easing`).
- Solo `transform`/`opacity` (`transform-performance`). Reveal de secciones con IntersectionObserver, stagger 40ms en cards (`stagger-sequence`).
- `prefers-reduced-motion: reduce` → desactivar todas las animaciones no esenciales (`reduced-motion`).
- Máximo 1-2 elementos animados por vista (`excessive-motion`).

## Accessibility (piso, no meta)
- Contraste verificado (ver Brand Profile §2). Jerarquía h1→h2→h3 sin saltos (`heading-hierarchy`).
- `lang="es"`, skip-link al formulario, `aria-label` en botones de solo icono.
- Zoom nunca deshabilitado (`viewport-meta`).
- `touch-action: manipulation` en botones (`tap-delay`).

## Performance
- Sin frameworks CSS; CSS plano con variables. SVG inline para iconos y motivo de circuito.
- Google Fonts: preconnect + swap. Lazy-load de la API de Google Places hasta que el usuario interactúa con el campo dirección (ahorra cuota y TTI).
- Imágenes (logo/mascota) en WebP con dimensiones declaradas.

## Anti-patterns (evitar — del skill)
- Emojis como iconos estructurales · placeholder como label · gris-sobre-gris · #000 puro · hover-only affordances · animar width/height · deshabilitar zoom · CTA múltiples compitiendo · sombras negras duras · texto naranja pequeño.
