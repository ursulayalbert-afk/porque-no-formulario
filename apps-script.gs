/**
 * PQN — receptor del formulario de candidaturas "¿Por qué no?"
 *
 * Escribe cada envío como una fila del Sheet de respuestas.
 *
 * DESPLIEGUE (esto es lo que hace que funcione o no):
 *   Implementar  ->  Nueva implementación  ->  tipo: Aplicación web
 *   Ejecutar como:      Yo (ursulayalbert@gmail.com)
 *   Quién tiene acceso: CUALQUIER PERSONA        <-- imprescindible
 *
 * Si "Quién tiene acceso" queda en "Solo yo", el POST del formulario falla en
 * silencio: el visitante ve la pantalla de gracias y al Sheet no llega nada.
 * Es el fallo clásico de este montaje.
 *
 * Al pulsar Implementar la primera vez pedirá autorización. Como el script no
 * está verificado, hay que entrar por "Configuración avanzada" -> "Ir a (no seguro)".
 * Es normal: el script es tuyo.
 */

var SHEET_ID = '1L2SnK-q0sSTx7b0GbQ4CUioWxVSNXzZm0dviBOITWnw';
var HOJA     = 'Respuestas';

/* Columnas del Sheet. El orden manda: es el orden de las 12 preguntas.
   La primera columna es la marca de tiempo (cuándo se envió). */
var CABECERAS = [
  'Fecha y hora',
  '1. Nombre y qué vende',
  '2. Teléfono o Telegram',
  '3. Ferias o mercados al mes',
  '4. Fabrica / mezcla / reventa',
  '5. Situación con la venta online',
  '6. Lo que peor lleva de depender de las ferias',
  '7. Qué ha intentado ya y qué pasó',
  '8. Horas a la semana disponibles',
  '9. Ha pagado antes por formación',
  '10. Decide solo o entre varios',
  '11. Cuándo quiere empezar',
  '12. Dónde sigue a gente que enseñe de esto'
];

/* Clave que manda el formulario -> posición de columna (0 = Fecha y hora). */
var CLAVES = ['enviado_en', 'p01', 'p02', 'p03', 'p04', 'p05',
              'p06', 'p07', 'p08', 'p09', 'p10', 'p11', 'p12'];


function hoja_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(HOJA);

  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(HOJA);
  }

  // Cabeceras: se escriben una sola vez, la primera vez que llega algo.
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, CABECERAS.length).setValues([CABECERAS]);
    sh.getRange(1, 1, 1, CABECERAS.length)
      .setFontWeight('bold')
      .setBackground('#EEEBE4');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 150);
    for (var c = 2; c <= CABECERAS.length; c++) {
      sh.setColumnWidth(c, 260);
    }
  }
  return sh;
}


function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var p = (e && e.parameter) ? e.parameter : {};
    var sh = hoja_();

    var fila = CLAVES.map(function (k) {
      if (k === 'enviado_en') {
        // Si el navegador mandó la hora, la usamos; si no, la del servidor.
        return p[k] ? new Date(p[k]) : new Date();
      }
      return p[k] !== undefined && p[k] !== '' ? p[k] : '';
    });

    sh.appendRow(fila);
    sh.getRange(sh.getLastRow(), 1)
      .setNumberFormat('dd/MM/yyyy HH:mm');

    return json_({ ok: true, fila: sh.getLastRow() });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}


/* Sirve para comprobar desde el navegador que el despliegue responde.
   Si abres la URL /exec y ves {"ok":true,...}, el acceso público está bien. */
function doGet() {
  return json_({ ok: true, servicio: 'PQN formulario candidaturas', activo: true });
}


function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
