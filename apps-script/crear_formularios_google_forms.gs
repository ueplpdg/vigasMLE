/**
 * Crea los dos formularios de la tesis "Vigas de MLE" en Google Forms.
 *   Instrumento A – Empresas que fabrican o comercializan MLE
 *   Instrumento B – Profesionales que usan, han usado o usarían MLE
 * Todas las preguntas son de selección (única, múltiple, lista desplegable,
 * cuadrícula u orden). Solo el correo del panel (B, opcional) se escribe.
 *
 * USO: script.google.com → Nuevo proyecto → pegar todo este código →
 *      Guardar → elegir la función "crearFormularios" → Ejecutar → Autorizar.
 *      Los enlaces aparecen en "Registro de ejecución" y en tu Google Drive.
 */

function crearFormularios() {
  var a = crearInstrumentoA();
  var b = crearInstrumentoB();
  Logger.log('INSTRUMENTO A (editar):  ' + a.getEditUrl());
  Logger.log('INSTRUMENTO A (enviar):  ' + a.getPublishedUrl());
  Logger.log('INSTRUMENTO B (editar):  ' + b.getEditUrl());
  Logger.log('INSTRUMENTO B (enviar):  ' + b.getPublishedUrl());
}

/* Provincias con mayor actividad de construcción (INEC, Encuesta de Edificaciones 2025:
 * Guayas, Pichincha, Tungurahua, Azuay, Manabí, Santo Domingo, Loja e Imbabura) + Cañar,
 * mercado propio de JOMASA (Azogues). */
var PROVINCIAS = [
  'Pichincha (Quito)', 'Guayas (Guayaquil)', 'Azuay (Cuenca)', 'Tungurahua (Ambato)',
  'Manabí (Portoviejo, Manta)', 'Imbabura (Ibarra)', 'Loja (Loja)',
  'Santo Domingo de los Tsáchilas', 'Cañar (Azogues)', 'Otra provincia'];

/* ---------- utilidades ---------- */
// Escribe siempre "MLE (madera laminada encolada)" donde aparezca la sigla.
function M(s) {
  if (!s) return s;
  return s.replace(/madera laminada encolada \(MLE\)/g, 'MLE')
          .replace(/\bMLE\b(?! \(madera)/g, 'MLE (madera laminada encolada)');
}
function grid(form, titulo, filas, columnas, ayuda, requerido) {
  var it = form.addGridItem().setTitle(M(titulo)).setRows(filas).setColumns(columnas)
    .setRequired(requerido !== false);
  if (ayuda) it.setHelpText(M(ayuda));
  return it;
}
// Nivel de 1 a 5 por fila; se puede repetir el mismo número en varias filas.
function nivel(form, titulo, filas, ayuda, conNoAplica) {
  var cols = conNoAplica ? [conNoAplica, '1', '2', '3', '4', '5'] : ['1', '2', '3', '4', '5'];
  return grid(form, titulo, filas, cols, ayuda);
}
function unica(form, titulo, opciones, ayuda, requerido) {
  var it = form.addMultipleChoiceItem().setTitle(M(titulo)).setChoiceValues(opciones)
    .setRequired(requerido !== false);
  if (ayuda) it.setHelpText(M(ayuda));
  return it;
}
function varias(form, titulo, opciones, ayuda, requerido) {
  var it = form.addCheckboxItem().setTitle(M(titulo)).setChoiceValues(opciones)
    .setRequired(requerido !== false);
  if (ayuda) it.setHelpText(M(ayuda));
  return it;
}
function lista(form, titulo, opciones, ayuda, requerido) {
  var it = form.addListItem().setTitle(M(titulo)).setChoiceValues(opciones)
    .setRequired(requerido !== false);
  if (ayuda) it.setHelpText(M(ayuda));
  return it;
}
function orden(form, titulo, filas, ayuda) {
  var cols = [];
  for (var i = 1; i <= filas.length; i++) cols.push(String(i));
  return form.addGridItem().setTitle(M(titulo)).setHelpText(M(ayuda))
    .setRows(filas).setColumns(cols).setRequired(true)
    .setValidation(FormApp.createGridValidation()
      .setHelpText('Use cada número una sola vez.').requireLimitOneResponsePerColumn().build());
}
function pagina(form, titulo, ayuda) {
  var p = form.addPageBreakItem().setTitle(M(titulo));
  if (ayuda) p.setHelpText(M(ayuda));
  return p;
}
function consentimiento(form) {
  var it = form.addMultipleChoiceItem()
    .setTitle('Consentimiento informado')
    .setHelpText('He leído la presentación y acepto participar voluntariamente. Puedo dejar de responder en cualquier momento.')
    .setRequired(true);
  it.setChoices([
    it.createChoice('Acepto participar', FormApp.PageNavigationType.CONTINUE),
    it.createChoice('No acepto', FormApp.PageNavigationType.SUBMIT)
  ]);
}

/* =====================================================================
 * INSTRUMENTO A – EMPRESAS
 * ===================================================================== */
function crearInstrumentoA() {
  var f = FormApp.create(M('Instrumento A – Oferta de vigas de MLE en Ecuador'));
  f.setDescription(M(
    'Este cuestionario forma parte del trabajo de titulación de la Maestría en Gerencia de Proyectos BIM ' +
    'de la Universidad de Cuenca. Su objetivo es identificar las secciones, longitudes y usos de vigas de MLE ' +
    'que su empresa reporta como de mayor comercialización. La información se usará solo con fines académicos ' +
    'y los datos de cada empresa se presentarán de forma agregada. ' +
    'Todas las preguntas son de selección. Tiempo estimado: 10 a 15 minutos.'));
  f.setProgressBar(true).setAllowResponseEdits(false)
   .setConfirmationMessage('Gracias por su colaboración. Sus respuestas fueron registradas.');

  consentimiento(f);

  // Invitación (primera pregunta, para enganchar)
  pagina(f, 'Una invitación para su empresa',
    'Como resultado de este trabajo se desarrollará una familia paramétrica de vigas de MLE para Revit: ' +
    'un objeto digital que arquitectos e ingenieros podrán colocar en sus modelos BIM con las secciones, ' +
    'propiedades y datos reales del producto fabricado en Ecuador. Con ella, sus vigas aparecerían en los ' +
    'proyectos tal como usted las fabrica, y las cantidades, especificaciones y pedidos llegarían con la ' +
    'información correcta. Las empresas participantes podrán revisar la familia antes de su publicación ' +
    'para asegurar que represente fielmente sus productos.');
  unica(f, 'A1. ¿Le gustaría que su empresa sea parte de la creación de esta familia, revisando sus datos técnicos antes de su publicación?',
    ['Sí, me gustaría participar', 'Tal vez, quisiera más información', 'No por ahora']);

  // Datos de la empresa
  pagina(f, 'Datos de la empresa');
  unica(f, 'A2. Empresa', ['Madebu', 'Madel', 'Madetec', 'Otra empresa']);
  lista(f, 'A3. Provincia donde está la planta de producción', PROVINCIAS);
  unica(f, 'A4. Cargo de quien responde',
    ['Gerente o propietario', 'Jefe de producción o planta', 'Área comercial o ventas',
     'Área técnica o ingeniería', 'Otro cargo']);
  unica(f, 'A5. Años fabricando MLE', ['Menos de 3', '3 a 5', '6 a 10', 'Más de 10']);

  // Bloque 1
  pagina(f, 'Bloque 1 – Producto');
  unica(f, 'A6. ¿En qué especie de madera fabrica mayormente sus vigas de MLE?',
    ['Pino radiata', 'Pino patula', 'Eucalipto', 'Otra especie'], 'Marque la principal.');
  unica(f, 'A7. ¿Qué clase resistente o grado estructural declara para sus vigas?',
    ['GL24h', 'GL28h', 'GL32h', 'Tensiones admisibles propias de la empresa', 'No declara clase resistente']);
  unica(f, 'A8. Contenido de humedad de entrega',
    ['Menos de 10 %', '10 % a 12 %', '12,1 % a 15 %', 'Más de 15 %', 'No se mide']);
  unica(f, 'A9. Tipo de adhesivo utilizado',
    ['Melamina-urea-formaldehído (MUF)', 'Poliuretano (PUR)', 'Fenol-resorcinol-formaldehído (PRF)',
     'Emulsión polímero-isocianato (EPI)', 'Otro adhesivo', 'No sabe']);
  varias(f, 'A10. ¿Qué tratamientos ofrece?',
    ['Inmunización contra insectos y hongos', 'Protección UV', 'Hidrorrepelente', 'Retardante de fuego', 'Ninguno'],
    'Marque todos los que apliquen.');

  // Bloque 2
  pagina(f, 'Bloque 2 – Mercado');
  lista(f, 'A11. Provincia donde MÁS se comercializan sus vigas de MLE', PROVINCIAS);
  lista(f, 'A12. Segunda provincia con más ventas', PROVINCIAS.concat(['No aplica']));
  lista(f, 'A13. Tercera provincia con más ventas', PROVINCIAS.concat(['No aplica']));
  unica(f, 'A14. ¿Qué porcentaje aproximado de sus ventas de vigas se concentra en la provincia principal?',
    ['Menos del 25 %', '25 % a 50 %', '51 % a 75 %', 'Más del 75 %']);

  // Bloque 3
  pagina(f, 'Bloque 3 – Luces y longitudes',
    'Luz = distancia libre entre apoyos. Longitud = largo total de la pieza fabricada.');
  var LUCES = ['Hasta 3,00 m', '3,01 – 4,00 m', '4,01 – 5,00 m', '5,01 – 6,00 m', '6,01 – 8,00 m', 'Más de 8,00 m'];
  varias(f, 'A15. ¿Qué luz libre entre apoyos solicitan con más frecuencia sus clientes?', LUCES,
    'Marque exactamente las DOS más frecuentes.')
    .setValidation(FormApp.createCheckboxValidation().setHelpText('Marque exactamente dos opciones.')
      .requireSelectExactly(2).build());
  unica(f, 'A16. ¿Qué longitud total de pieza vende con mayor frecuencia?',
    ['3 m', '4 m', '5 m', '6 m', '8 m', '12 m', 'Otra longitud']);
  unica(f, 'A17. Longitud máxima de pieza que puede fabricar',
    ['Hasta 6 m', '6,1 a 8 m', '8,1 a 12 m', '12,1 a 16 m', 'Más de 16 m']);

  // Bloque 4
  var BASES = ['60', '70', '80', '90', '100', '110', '120', '140', '160', '180', '200', 'Otra'];
  var ALTURAS = ['100', '150', '200', '250', '300', '350', '400', '450', '500', '550', '600', '700', '800', 'Otra'];
  pagina(f, 'Bloque 4 – Secciones',
    'Indique las secciones de viga que generalmente se adaptan a los requerimientos de sus clientes, ' +
    'de la MÁS a la MENOS vendida. Las cinco primeras son obligatorias; la sexta es opcional. ' +
    'Si la medida exacta no aparece, elija la más cercana.');
  for (var i = 1; i <= 6; i++) {
    var req = i <= 5;
    f.addSectionHeaderItem().setTitle(M('Sección ' + i + (i === 1 ? ' – la más vendida' : '') + (req ? '' : ' (opcional)')));
    lista(f, 'A18.' + i + ' Sección ' + i + ' – base b (mm)', BASES, null, req);
    lista(f, 'A18.' + i + ' Sección ' + i + ' – altura h (mm)', ALTURAS, null, req);
    lista(f, 'A18.' + i + ' Sección ' + i + ' – luz típica en que se usa', LUCES, null, req);
    unica(f, 'A18.' + i + ' Sección ' + i + ' – uso típico', ['Viga de entrepiso', 'Viga de cubierta', 'Ambos'], null, req);
    unica(f, 'A18.' + i + ' Sección ' + i + ' – frecuencia de venta', ['Alta', 'Media', 'Baja'], null, req);
  }
  unica(f, 'A19. ¿Trabaja con secciones estándar de catálogo o fabrica cada sección a medida?',
    ['Solo catálogo', 'Mayormente catálogo', 'Mitad y mitad', 'Mayormente a medida', 'Solo a medida']);
  unica(f, 'A20. Espesor de lámina que utiliza',
    ['Menos de 20 mm', '20 a 29 mm', '30 a 39 mm', '40 a 45 mm', 'Más de 45 mm']);

  // Bloque 5
  pagina(f, 'Bloque 5 – Usos de las vigas');
  orden(f, 'A21. ¿Para qué usos solicitan sus clientes las vigas de MLE? Ordénelos por importancia.',
    ['Vivienda', 'Oficinas', 'Comercio', 'Galerías, pérgolas o terrazas',
     'Cubiertas de espacios amplios (coliseos, naves, salones)'],
    '1 = uso más importante (el que más solicitan) · 5 = uso menos importante. Use cada número una sola vez.');
  unica(f, 'A22. ¿Cuántas plantas tienen comúnmente las edificaciones en las que se usan sus vigas?',
    ['Una', 'Dos', 'Tres o más']);

  // Bloque 6
  pagina(f, 'Bloque 6 – Información técnica');
  varias(f, 'A23. ¿Qué información técnica entrega a sus clientes?',
    ['Ficha técnica con propiedades mecánicas', 'Catálogo de secciones', 'Tablas de luces o de predimensionamiento',
     'Planos o detalles en CAD', 'Objetos BIM (familias de Revit, archivos IFC u otros)',
     'Certificados o informes de ensayo', 'Ninguna'], 'Marque todas las que apliquen.');
  unica(f, 'A24. ¿Sus clientes le han solicitado modelos u objetos BIM de sus productos?',
    ['Sí, con frecuencia', 'Sí, ocasionalmente', 'Nunca']);

  return f;
}

/* =====================================================================
 * INSTRUMENTO B – PROFESIONALES
 * Hasta B5 se pregunta por la MLE; desde B6 por estructuras de madera en general.
 * ===================================================================== */
function crearInstrumentoB() {
  var f = FormApp.create(M('Instrumento B – Uso e información de estructuras de madera y MLE en proyectos'));
  f.setDescription(M(
    'Este cuestionario forma parte del trabajo de titulación de la Maestría en Gerencia de Proyectos BIM ' +
    'de la Universidad de Cuenca. Busca conocer cómo usan y representan los profesionales los elementos ' +
    'estructurales de madera, en especial las vigas de MLE, qué problemas de información enfrentan y qué ' +
    'datos necesitan. Está dirigido a arquitectos, ingenieros civiles y constructores. Es anónimo y las ' +
    'respuestas se usarán solo con fines académicos. Todas las preguntas son de selección. ' +
    'Tiempo estimado: 8 a 10 minutos.'));
  f.setProgressBar(true).setAllowResponseEdits(false)
   .setConfirmationMessage('Gracias por su colaboración. Sus respuestas fueron registradas.');

  consentimiento(f);

  // Bloque 1 – Perfil
  pagina(f, 'Bloque 1 – Perfil');
  unica(f, 'B1. Profesión', ['Arquitecto/a', 'Ingeniero/a civil', 'Constructor/a', 'Otra profesión']);
  unica(f, 'B2. Años de experiencia profesional', ['Menos de 5', '5 a 10', '11 a 20', 'Más de 20']);
  lista(f, 'B3. Provincia donde ejerce principalmente', PROVINCIAS);
  nivel(f, 'B4. ¿Con qué frecuencia usa cada programa?',
    ['Revit', 'ArchiCAD', 'AutoCAD u otro programa solo 2D', 'SketchUp', 'ETABS o SAP2000',
     'Robot Structural Analysis'],
    '1 = lo uso muy poco · 5 = es el que más uso. Puede repetir el mismo número en varios programas. ' +
    'Marque "No lo uso" si corresponde.', 'No lo uso');

  // Bloque 2 – Experiencia (filtro sobre MLE)
  pagina(f, 'Bloque 2 – Experiencia con MLE');
  var b5 = f.addMultipleChoiceItem().setTitle(M('B5. ¿Ha usado MLE en sus proyectos?')).setRequired(true);

  // Desde aquí: estructuras de madera en general
  pagina(f, 'Bloque 3 – Experiencia con estructuras de madera',
    'Desde esta sección, las preguntas se refieren a elementos estructurales de madera en general ' +
    '(madera aserrada, MLE u otros productos de madera).');
  unica(f, 'B6. ¿En cuántos proyectos ha utilizado elementos estructurales de madera?',
    ['Ninguno todavía', '1 a 2', '3 a 5', '6 a 10', 'Más de 10']);
  nivel(f, 'B7. ¿Con qué frecuencia usa (o usaría) la madera en cada elemento estructural?',
    ['Vigas de entrepiso', 'Vigas de cubierta', 'Columnas o pilares', 'Cerchas o armaduras', 'Paneles de piso o pared'],
    '1 = muy poco frecuente · 5 = muy frecuente. Puede repetir el mismo número en varios elementos.');
  var BARRERAS = ['Costo', 'Falta de normativa ecuatoriana específica', 'Desconocimiento de sus propiedades',
     'Poca oferta o pocos proveedores', 'Falta de información técnica de los fabricantes',
     'Falta de objetos BIM o bibliotecas para modelarla', 'Preferencia del cliente por hormigón o acero',
     'Durabilidad o mantenimiento', 'Comportamiento ante el fuego'];
  nivel(f, 'B8. ¿Qué tan importante es cada barrera para usar estructuras de madera?', BARRERAS,
    '1 = poco importante · 5 = muy importante. Puede repetir el mismo número en varias barreras.');

  // Bloque 4 – Modelado
  pagina(f, 'Bloque 4 – Modelado de estructuras de madera');
  varias(f, 'B9. ¿Cómo representa (o representaría) los elementos estructurales de madera en su modelo?',
    ['Con un objeto genérico del programa', 'Con una familia u objeto de otro material, adaptado',
     'Con una familia u objeto propio, creado por mí o por mi oficina',
     'Con un objeto descargado de un fabricante o de una biblioteca', 'Solo en dibujo 2D',
     'Nunca he modelado elementos de madera'], 'Puede marcar más de una opción.');
  varias(f, 'B10. ¿De dónde obtiene las propiedades de la madera estructural (secciones, módulo de elasticidad, resistencias)?',
    ['Fichas técnicas del fabricante', 'Normas ecuatorianas (NEC-SE-MD)', 'Normas extranjeras',
     'Bibliografía o tesis', 'Asumo valores de referencia', 'No las incorporo al modelo'],
    'Marque todas las que apliquen.');

  // Bloque 5 – Información
  pagina(f, 'Bloque 5 – Información que necesita');
  var datos = ['Dimensiones (base, altura, longitud)', 'Especie de madera', 'Clase resistente',
               'Módulo de elasticidad y resistencias', 'Luz máxima admisible por uso', 'Contenido de humedad',
               'Tratamiento o inmunización', 'Fabricante y código de producto', 'Precio referencial',
               'Volumen y área de impregnación', 'Enlace a la ficha técnica', 'Huella de carbono (kgCO₂e)'];
  nivel(f, 'B11. En un objeto de viga de madera estructural, ¿qué importancia tiene cada dato?', datos,
    '1 = nada importante · 5 = imprescindible. Puede repetir el mismo número en varios datos.');
  f.addCheckboxGridItem()
    .setTitle('B12. ¿Para qué propósitos necesita cada dato?')
    .setHelpText('Marque todos los propósitos que correspondan en cada fila. Deje la fila vacía si no lo necesita.')
    .setRows(datos).setColumns(['Diseño y coordinación', 'Cuantificación', 'Adquisición al fabricante'])
    .setRequired(false);

  // Bloque 6 – Percepción (lo más técnico, al final)
  pagina(f, 'Bloque 6 – Percepción sobre la información');
  grid(f, 'B13. Indique su grado de acuerdo con cada afirmación',
    ['a) Transcribo manualmente al modelo los datos del fabricante de la madera.',
     'b) La información disponible sobre madera estructural para modelar es suficiente.',
     'c) He tenido errores u omisiones en cantidades o especificaciones de elementos de madera por falta de información en el modelo.',
     'd) Al exportar el modelo (IFC o programas de análisis), las propiedades de la madera se pierden o deben reingresarse.',
     'e) Sería útil contar con objetos de madera estructural con información verificada del producto nacional.'],
    ['1', '2', '3', '4', '5'],
    '1 = totalmente en desacuerdo · 5 = totalmente de acuerdo');

  // Bloque 7 – Cierre
  pagina(f, 'Bloque 7 – Cierre');
  unica(f, 'B14. ¿Usaría una familia de Revit de vigas de MLE con información verificada del producto nacional?',
    ['Sí', 'Tal vez', 'No']);
  var b16 = f.addMultipleChoiceItem()
    .setTitle('B15. ¿Estaría dispuesto(a) a asistir a una charla, presencial o virtual, donde se comparta el proceso y los resultados del desarrollo de la familia?')
    .setRequired(true);

  // Contacto (solo para quien acepta el panel)
  var contacto = pagina(f, 'Invitación a la charla');
  f.addTextItem().setTitle('B16. Correo electrónico para enviarle la invitación').setRequired(true)
    .setValidation(FormApp.createTextValidation().setHelpText('Ingrese un correo válido.')
      .requireTextIsEmail().build());

  // Final para quien no usaría MLE
  var motivo = pagina(f, 'Motivo');
  motivo.setGoToPage(FormApp.PageNavigationType.SUBMIT); // quien termina "Contacto" envía sin pasar por aquí
  nivel(f, 'B5.1 ¿Qué tan importante es cada motivo para no usar MLE?', BARRERAS,
    '1 = poco importante · 5 = muy importante. Puede repetir el mismo número en varios motivos.');

  b5.setChoices([
    b5.createChoice('Sí, en proyectos construidos', FormApp.PageNavigationType.CONTINUE),
    b5.createChoice('Sí, solo en diseños o anteproyectos', FormApp.PageNavigationType.CONTINUE),
    b5.createChoice('No, pero la usaría', FormApp.PageNavigationType.CONTINUE),
    b5.createChoice('No y no la usaría', motivo)
  ]);
  b16.setChoices([
    b16.createChoice('Sí, presencial', contacto),
    b16.createChoice('Sí, virtual', contacto),
    b16.createChoice('Sí, cualquiera de las dos', contacto),
    b16.createChoice('No', FormApp.PageNavigationType.SUBMIT)
  ]);

  return f;
}
