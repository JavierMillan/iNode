# Inter Node — Landing de captación de prospectos

Landing mobile-first que captura prospectos interesados antes del lanzamiento en una ciudad nueva, genera un mensaje de WhatsApp con los datos, y (opcionalmente) los guarda en una Google Sheet.

**Stack:** Vite + React · GitHub Pages (estático) · Google Apps Script (backend gratuito) · Google Places Autocomplete (opcional).

## Correr en local

```bash
npm install
npm run dev
```

## Configuración (todo vive en `src/config.js`)

### 1. Número de WhatsApp
- **Pruebas (actual):** `526221424577` (Javier)
- **Producción:** descomentar la línea del oficial `524432573972` y comentar la de pruebas.

### 2. Google Sheet — ⚠️ HOY NO ESTÁ CONFIGURADA (opcional pero recomendado)

**Estado actual:** `APPS_SCRIPT_URL` en `src/config.js` está **vacío**, así que
por ahora los registros **NO se guardan en ninguna hoja** — la landing solo
genera el mensaje de WhatsApp. Para tener un respaldo estructurado (un Excel/Sheet
con todos los prospectos), hay que hacer esta configuración **una sola vez**:

1. Crea una Google Sheet con estos encabezados en la fila 1 (en orden):
   `Fecha | Nombre | WhatsApp | Dirección | Lat | Lng | Plan | Inmueble | ¿Tiene internet? | Con quién | Referencias | Detalles`
2. En la Sheet: Extensiones > Apps Script → pega el contenido de [`apps-script/Code.gs`](apps-script/Code.gs)
3. Implementar > Nueva implementación > **Aplicación web** (Ejecutar como: tú · Acceso: cualquier usuario)
4. Copia la URL generada y pégala en `APPS_SCRIPT_URL` de `src/config.js`

Una vez pegada la URL, cada registro cae como una fila nueva en esa Sheet, en
paralelo al WhatsApp. Si el guardado falla, el WhatsApp se genera igual — el
guardado nunca bloquea la conversión.

### 3. Google Maps API key (opcional)
Sin key, el campo dirección es texto libre. Con key, autocompleta direcciones reales de México y captura lat/lng.

1. [Google Cloud Console](https://console.cloud.google.com/) → crear proyecto → habilitar **Maps JavaScript API** y **Places API**
2. Crear API key y **restringirla por referrer** al dominio de GitHub Pages (ej. `https://usuario.github.io/*`)
3. Local: crear archivo `.env` con `VITE_GMAPS_KEY=tu-key`
4. GitHub: Settings > Secrets and variables > Actions > secret `VITE_GMAPS_KEY`

Costo: crédito gratuito mensual de $200 USD de Google cubre de sobra el volumen de una ciudad nueva (Autocomplete ~$2.83/1000 solicitudes; la carga es lazy — solo se consume cuota cuando alguien toca el campo).

## Deploy a GitHub Pages

1. Crear repo en GitHub y subir este proyecto (`main`)
2. En `vite.config.js`, ajustar `base: '/nombre-del-repo/'`
3. Settings > Pages > Source: **GitHub Actions**
4. Cada push a `main` construye y publica automáticamente ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))

## Clonar para una nueva ciudad

Cada ciudad = un repo/instancia nueva:
1. Clonar este repo con otro nombre
2. Editar **solo** `src/config.js`: número de WhatsApp, textos/marca de esa ciudad, nueva `APPS_SCRIPT_URL` (Sheet nueva)
3. Cambiar assets de marca (logo/colores en `src/styles/index.css` si la marca cambia)
4. Nuevo deploy en Pages

## Documentos de estrategia y marca (fuente de verdad)

| Archivo | Qué contiene |
|---|---|
| [`brand-profile-internode.md`](brand-profile-internode.md) | ADN visual de la marca (Prism) |
| [`design-system/MASTER.md`](design-system/MASTER.md) | Tokens y reglas UI/UX |
| [`campaign-los-primeros.md`](campaign-los-primeros.md) | Estrategia de campaña de 5 piezas + auditoría de conversión |
| [`copy-landing-final.md`](copy-landing-final.md) | Copy completo con racional psicológico |

## Pendientes conocidos
- [ ] **Configurar la Google Sheet** (paso 2 arriba) — hoy los registros NO se guardan en ningún lado, solo se genera el WhatsApp
- [ ] Conseguir la Google Maps API key para el autocompletado de dirección (paso 3)
- [ ] Cambiar número de WhatsApp a producción (443 257 3972) antes del lanzamiento
- [ ] Logo definitivo en SVG si se quiere nitidez perfecta (hoy usa el PNG recortado)
