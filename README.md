# Encuesta MLE Ecuador

Dos encuestas independientes, cada una con su propio enlace:

| Archivo | Para quién | Enlace final (ejemplo) |
|---|---|---|
| `empresas.html` | Instrumento A – empresas fabricantes o comercializadoras | `https://SU-USUARIO.github.io/encuesta-mle/empresas.html` |
| `profesionales.html` | Instrumento B – arquitectos, ingenieros civiles y constructores | `https://SU-USUARIO.github.io/encuesta-mle/profesionales.html` |
| `index.html` | Portada opcional con los dos botones | `https://SU-USUARIO.github.io/encuesta-mle/` |
| `apps-script/Code.gs` | Receptor que guarda las respuestas en Google Sheets (no se sube a GitHub) | — |

Las dos encuestas guardan en la **misma** hoja de cálculo, cada una en su pestaña: «Instrumento A» e «Instrumento B».

---

## Paso 1 · Crear la hoja de Google Sheets y el receptor (una sola vez)

1. Entre a **sheets.google.com** y cree una hoja en blanco. Nómbrela «Respuestas Encuesta MLE».
2. Menú **Extensiones → Apps Script**.
3. Borre todo el código de ejemplo, pegue completo el archivo `apps-script/Code.gs` y pulse **Guardar** (ícono de disquete).
4. Arriba a la derecha: **Implementar → Nueva implementación**.
5. En el engranaje junto a «Seleccionar tipo», elija **Aplicación web** y configure:
   - Descripción: `Encuesta MLE`
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
6. Pulse **Implementar** y **Autorizar acceso**. Elija su cuenta. Si aparece «Google no ha verificado esta app», pulse **Configuración avanzada → Ir a … (no seguro)** y **Permitir** (el script es suyo).
7. Copie la **URL de la aplicación web**. Termina en `/exec`.
8. Para comprobarla, péguela en el navegador: debe aparecer `{"ok":true,"mensaje":"Receptor de la Encuesta MLE activo"}`.

## Paso 2 · Pegar la URL en las dos encuestas

Abra `empresas.html` y `profesionales.html` con cualquier editor de texto (Bloc de notas sirve). En cada uno busque esta línea:

```js
const SCRIPT_URL = "";
```

y pegue la URL entre las comillas:

```js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

Guarde los dos archivos. Es la misma URL en ambos.

## Paso 3 · Publicar en GitHub Pages

1. Entre a **github.com** (cree una cuenta si no tiene) y pulse **New repository**.
2. Nombre: `encuesta-mle` · visibilidad **Public** · **Create repository**.
3. En la página del repositorio pulse **uploading an existing file** (o **Add file → Upload files**).
4. Arrastre `index.html`, `empresas.html` y `profesionales.html` (no hace falta subir la carpeta `apps-script`). Pulse **Commit changes**.
5. Vaya a **Settings → Pages**. En «Build and deployment» elija **Deploy from a branch**, rama **main**, carpeta **/ (root)** y pulse **Save**.
6. Espere uno o dos minutos y recargue esa página: arriba aparece «Your site is live at `https://SU-USUARIO.github.io/encuesta-mle/`».

Los dos enlaces para enviar quedan así:

- Empresas: `https://SU-USUARIO.github.io/encuesta-mle/empresas.html`
- Profesionales: `https://SU-USUARIO.github.io/encuesta-mle/profesionales.html`

> **¿Prefiere dos repositorios separados?** Repita el Paso 3 creando, por ejemplo, `encuesta-mle-empresas` y `encuesta-mle-profesionales`. Suba a cada uno solo su archivo y **renómbrelo a `index.html`** antes de subirlo. Así cada enlace queda corto: `https://SU-USUARIO.github.io/encuesta-mle-empresas/`.

## Paso 4 · Probar antes de difundir

1. Abra cada enlace, responda una vez y pulse **Enviar respuestas**.
2. Revise la hoja: deben aparecer las pestañas «Instrumento A» e «Instrumento B», con una fila cada una.
3. Borre esas filas de prueba (deje la fila 1 de encabezados) y envíe los enlaces.

## Cambios posteriores

- **Cambiar una pregunta:** edite el archivo `.html`, vuelva a subirlo a GitHub (Add file → Upload files, mismo nombre) y espere un minuto. Las respuestas nuevas agregan sus columnas solas en la hoja.
- **Cambiar `Code.gs`:** en Apps Script, **Implementar → Administrar implementaciones → lápiz (Editar) → Versión: Nueva versión → Implementar**. La URL no cambia.
- Si falla el internet al enviar, la respuesta queda guardada en el navegador de la persona y se reenvía sola la próxima vez que abra el enlace.
