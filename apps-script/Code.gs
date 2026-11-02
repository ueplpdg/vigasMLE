/**
 * Receptor de respuestas – Encuesta Vigas MLE (madera laminada encolada)
 * Guarda cada envío del formulario web en una hoja de Google Sheets:
 *   pestaña "Instrumento A" (empresas) y pestaña "Instrumento B" (profesionales).
 * Las columnas se crean solas con el primer envío y se agregan si aparecen preguntas nuevas.
 *
 * INSTALACIÓN (una sola vez):
 *  1. Cree una hoja de cálculo nueva en Google Sheets (por ejemplo "Respuestas Encuesta MLE").
 *  2. Menú Extensiones → Apps Script. Borre el código de ejemplo y pegue TODO este archivo. Guarde.
 *  3. Botón Implementar → Nueva implementación → tipo "Aplicación web".
 *       Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier persona
 *  4. Autorice los permisos. Copie la "URL de la aplicación web" (termina en /exec).
 *  5. Pegue esa URL en index.html, en la línea:  const SCRIPT_URL = "";
 *  Si luego cambia este código: Implementar → Administrar implementaciones → Editar → Versión nueva.
 */

const HOJAS = { A: 'Instrumento A', B: 'Instrumento B' };

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const nombre = HOJAS[data.instrumento] || 'Otros';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(nombre) || ss.insertSheet(nombre);

    const fila = Object.assign(
      { 'Fecha y hora': new Date(), 'ID de respuesta': data.id || '' },
      data.respuestas || {}
    );

    // Encabezados: los existentes + los nuevos, en el orden en que llegan las preguntas
    let encabezados = sh.getLastColumn() > 0
      ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].filter(String)
      : [];
    Object.keys(fila).forEach(function (k) { if (encabezados.indexOf(k) === -1) encabezados.push(k); });
    sh.getRange(1, 1, 1, encabezados.length).setValues([encabezados])
      .setFontWeight('bold').setBackground('#F3E4D3').setWrap(true);
    sh.setFrozenRows(1);

    sh.appendRow(encabezados.map(function (h) { return fila[h] !== undefined ? fila[h] : ''; }));
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Abrir la URL /exec en el navegador debe mostrar este mensaje: así se comprueba que está activa.
function doGet() {
  return salida({ ok: true, mensaje: 'Receptor de la Encuesta MLE activo' });
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Prueba manual desde el editor: Ejecutar → probarEnvio. Debe aparecer una fila en "Instrumento B".
function probarEnvio() {
  doPost({ postData: { contents: JSON.stringify({
    instrumento: 'B', id: 'prueba', respuestas: { 'B1 Profesión': 'Arquitecto/a', 'B2 Años de experiencia': '5 a 10' }
  }) } });
}
