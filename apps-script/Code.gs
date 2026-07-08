/**
 * Inter Node — Receptor de registros (Google Apps Script Web App)
 *
 * INSTALACIÓN (una sola vez):
 * 1. Crea una Google Sheet nueva. En la fila 1 pon estos encabezados (en orden):
 *    Fecha | Nombre | WhatsApp | Dirección | Lat | Lng | Plan | Inmueble |
 *    ¿Tiene internet? | Con quién | Referencias | Detalles
 * 2. En la Sheet: Extensiones > Apps Script. Borra el contenido y pega este archivo.
 * 3. Implementar > Nueva implementación > Aplicación web:
 *      - Ejecutar como: Tú
 *      - Acceso: Cualquier usuario
 * 4. Copia la URL de la Web App y pégala en src/config.js (APPS_SCRIPT_URL).
 *
 * Mientras APPS_SCRIPT_URL esté vacío en config.js, la landing NO guarda nada
 * en ninguna hoja — solo genera el mensaje de WhatsApp. Esto es solo para
 * activar el respaldo estructurado en Google Sheets.
 *
 * Nota: usa LockService para evitar que dos envíos simultáneos
 * se pisen la misma fila (condición de carrera).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Espera hasta 10s por el lock; si no lo consigue, lanza excepción.
    lock.waitLock(10000);

    var datos = JSON.parse(e.postData.contents);
    var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    hoja.appendRow([
      new Date(),
      String(datos.nombre || ''),
      String(datos.telefono || ''),
      String(datos.direccion || ''),
      String(datos.lat || ''),
      String(datos.lng || ''),
      String(datos.plan || ''),
      String(datos.inmueble || ''),
      String(datos.internet || ''),
      String(datos.internetQuien || ''),
      String(datos.referencias || ''),
      String(datos.detalles || ''),
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/** Prueba manual desde el editor: Ejecutar > testDoPost */
function testDoPost() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        nombre: 'Prueba Inter Node',
        telefono: '6221424577',
        direccion: 'Calle Falsa 123, Centro',
        lat: '27.918',
        lng: '-110.898',
        plan: 'Plan Familiar',
        inmueble: 'Casa',
        internet: 'Sí',
        internetQuien: 'Otro proveedor',
        referencias: 'Portón azul',
        detalles: 'Segundo piso',
      }),
    },
  };
  Logger.log(doPost(fake).getContent());
}
