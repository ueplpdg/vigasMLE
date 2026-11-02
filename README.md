# Encuesta MLE Ecuador + Simulador de Vigas MLE

Sitio web estático para la tesis de Pablo Sanango (Maestría en Gerencia de Proyectos BIM, Universidad de Cuenca).

| Archivo | Qué es |
|---|---|
| `index.html` | Formulario con el Instrumento A (empresas) y el Instrumento B (profesionales). Todas las preguntas son de selección. |
| `simulador.html` | Simulador 3D de vigas de MLE (madera laminada encolada) con cálculo estructural. |
| `apps-script/Code.gs` | Código que guarda las respuestas en Google Sheets. No se sube a GitHub como página: se pega en Apps Script. |

## 1. Conectar Google Sheets (5 minutos)

1. Cree una hoja nueva en Google Sheets, por ejemplo «Respuestas Encuesta MLE».
2. Menú **Extensiones → Apps Script**. Borre el código de ejemplo, pegue todo `apps-script/Code.gs` y guarde.
3. **Implementar → Nueva implementación →** tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
4. Autorice los permisos y copie la **URL de la aplicación web** (termina en `/exec`).
5. Abra `index.html` y pegue la URL en la línea:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```

Cada envío crea una fila en la pestaña **Instrumento A** o **Instrumento B**. Las columnas se crean solas con el primer envío.
Para comprobar que el receptor está activo, abra la URL `/exec` en el navegador: debe mostrar `{"ok":true,...}`.

> Si cambia `Code.gs` más adelante: **Implementar → Administrar implementaciones → Editar → Versión nueva**. La URL se mantiene.

## 2. Publicar en GitHub Pages

1. Cree un repositorio público en GitHub, por ejemplo `encuesta-mle`.
2. Suba `index.html` y `simulador.html` a la raíz del repositorio (la carpeta `apps-script` es opcional).
3. **Settings → Pages →** Source: **Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**.
4. En uno o dos minutos el sitio queda en `https://SU-USUARIO.github.io/encuesta-mle/`.

Enlaces directos útiles para compartir:
- Empresas: `https://SU-USUARIO.github.io/encuesta-mle/#empresas`
- Profesionales: `https://SU-USUARIO.github.io/encuesta-mle/#profesionales`
- Simulador: `https://SU-USUARIO.github.io/encuesta-mle/simulador.html`

## 3. Probar antes de difundir

- Responda una vez cada instrumento y verifique que aparezcan las filas en la hoja.
- Mientras `SCRIPT_URL` esté vacío, el formulario funciona en **modo de prueba**: guarda la respuesta solo en el navegador y lo avisa en pantalla.
- Si un envío falla por falta de internet, queda guardado en el navegador y se reenvía solo la próxima vez que se abra la página.

## Bases técnicas del simulador

- Propiedades de la madera laminada: EN 14080:2013 (GL20h, GL24h, GL28h, GL32h) o valores de ensayo propios.
- Cargas vivas: NEC-SE-CG (vivienda 2,0; oficinas 2,4; comercio 4,8; cubierta 0,7 kN/m²). Combinaciones NEC (1,4D; 1,2D + 1,6L) o Eurocódigo.
- Verificaciones: EN 1995-1-1 (flexión con kh, corte con kcr, aplastamiento, flechas instantánea y final con kdef, vibración f₁ ≥ 8 Hz) y EN 1995-1-2 (fuego, sección reducida).
- Herramienta didáctica: la tesis aplica NCh1198 con las tensiones de NCh2165:2023. No reemplaza el diseño de un profesional responsable.
