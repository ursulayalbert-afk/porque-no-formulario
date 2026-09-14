# Formulario de candidaturas — ¿Por qué no?

Formulario de captación para el acompañamiento de seis meses. Doce preguntas,
una por pantalla, pensado para móvil (la gente entra desde Telegram).

- **Front:** `index.html`, un solo archivo, sin dependencias salvo Google Fonts.
- **Back:** `apps-script.gs`, Apps Script que escribe cada envío en un Google Sheet.
- **Sheet de respuestas:** `1L2SnK-q0sSTx7b0GbQ4CUioWxVSNXzZm0dviBOITWnw`
  → https://docs.google.com/spreadsheets/d/1L2SnK-q0sSTx7b0GbQ4CUioWxVSNXzZm0dviBOITWnw/edit

No es anónimo: se piden nombre y contacto. No hay código regalo ni mínimo de compra.
Nada de Triple Intención en ninguna parte — paleta y logo de ¿Por qué no?.

---

## Estado

| Pieza | Estado |
|---|---|
| `index.html` con las 12 preguntas | Hecho |
| Logo PQN limpio a PNG transparente | Hecho (`logo-pqn.png`) |
| Google Sheet de respuestas | Creado |
| `apps-script.gs` escrito, con el ID del Sheet dentro | Hecho |
| Repo en GitHub | Hecho |
| GitHub Pages | Hecho |
| Apps Script creado y desplegado | Hecho |
| `SCRIPT_URL` dentro del HTML | Hecho |
| Envío de prueba verificado en el Sheet | Hecho (filas de prueba borradas) |

**En vivo:** https://ursulayalbert-afk.github.io/porque-no-formulario/

Verificado el 14-sep-2026 con un navegador limpio, sin sesión de Google: el
`/exec` del despliegue devuelve `{"ok":true,...}` sin pedir login, y los envíos
escriben fila en el Sheet. Acceso público correcto.

---

## Lo que falta, paso a paso

### 1. Crear el repo en GitHub

En https://github.com/new con la cuenta `ursulayalbert-afk`:

- Nombre: `porque-no-formulario`
- Público (GitHub Pages gratuito lo exige)
- **Sin** README, **sin** .gitignore, **sin** licencia — el repo local ya los trae

Luego, desde esta carpeta:

```bash
git remote add origin https://github.com/ursulayalbert-afk/porque-no-formulario.git
git push -u origin main
```

### 2. Activar GitHub Pages

En el repo → Settings → Pages:

- Source: `Deploy from a branch`
- Branch: `main`, carpeta `/ (root)`

La URL queda en:
`https://ursulayalbert-afk.github.io/porque-no-formulario/`

Tarda un par de minutos en responder la primera vez.

### 3. Crear el Apps Script

Abrir el Sheet de respuestas → Extensiones → Apps Script.
Borrar lo que haya y pegar entero el contenido de `apps-script.gs`. Guardar.

### 4. Desplegarlo como aplicación web

Implementar → Nueva implementación → tipo **Aplicación web**:

- Descripción: `PQN formulario v1`
- Ejecutar como: **Yo** (ursulayalbert@gmail.com)
- Quién tiene acceso: **CUALQUIER PERSONA**

> Este es el paso que se rompe siempre. Si queda en "Solo yo", el visitante
> ve la pantalla de gracias igual y al Sheet no llega nada. Falla en silencio.

La primera vez pedirá autorización y avisará de que el script no está
verificado: Configuración avanzada → "Ir a (no seguro)". Es normal, el script
es tuyo.

Copiar la URL que termina en `/exec`.

**Comprobación rápida:** abrir esa URL `/exec` en el navegador. Si devuelve
`{"ok":true,...}`, el acceso público está bien puesto. Si pide iniciar sesión
o da error de permisos, el despliegue quedó privado: repetir el paso 4.

### 5. Pegar la URL en el HTML

> **Ya está hecho** (14-sep-2026). Esto queda como referencia por si algún día
> hay que volver a desplegar y cambiar la URL.

**Archivo:** `index.html`. Es la **única** línea del archivo que empieza por
`const SCRIPT_URL`. Búscala así con Ctrl+F y vas directo — hay exactamente una.

Va entre comillas simples y termina en `/exec`. Dos avisos:

- Tiene que ser la URL del **despliegue** (Implementar → Gestionar
  implementaciones), no la de la barra de direcciones del editor.
- El identificador son unas **70 letras y números seguidos, sin puntos**.
  Si lo que has pegado es corto o lleva puntos suspensivos, no es una URL real.

Luego:

```bash
git add index.html
git commit -m "Actualizar SCRIPT_URL"
git push
```

**Cómo saber que está bien:** abrir esa misma URL en el navegador. Tiene que
devolver `{"ok":true,...}` sin pedir iniciar sesión. Si pide login o da 404,
o la URL está mal copiada o el despliegue no quedó en "cualquier persona".

### 6. Envío de prueba

Abrir la URL pública en el móvil, rellenar con datos falsos y enviar.
Comprobar que aparece la fila en el Sheet. **Borrar esa fila de prueba después.**

---

## Columnas del Sheet

Las escribe el propio Apps Script la primera vez que llega un envío.
Son las 12 preguntas en orden, con una columna de fecha delante:

1. Fecha y hora *(añadida: hace falta saber cuándo se apuntó cada uno)*
2. Nombre y qué vende
3. Teléfono o Telegram
4. Ferias o mercados al mes
5. Fabrica / mezcla / reventa
6. Situación con la venta online
7. Lo que peor lleva de depender de las ferias
8. Qué ha intentado ya y qué pasó
9. Horas a la semana disponibles
10. Ha pagado antes por formación
11. Decide solo o entre varios
12. Cuándo quiere empezar
13. Dónde sigue a gente que enseñe de esto

---

## Comprobado en móvil

Pasada con Playwright a 375×667 (iPhone SE, el peor caso realista):

- Sin scroll horizontal.
- Ningún elemento táctil por debajo de 44 px.
- Ningún input con fuente menor de 16 px — no hay zoom automático en iOS.
- Las dos preguntas obligatorias (1 y 2) bloquean si se dejan vacías.
- Las opcionales dejan pasar en blanco y se guardan como `(Sin respuesta)`.
- Recorrido completo de las 12 preguntas hasta la pantalla de gracias.
- Cero errores de consola.

Capturas en `_qa/` (fuera del repo).

---

## Privacidad

Las respuestas llevan nombre y teléfono. Viven solo en el Sheet, en el Drive
de Albert. No se copian al brain de Sauron: de este formulario solo pueden
salir agregados, nunca respuestas ni identidades individuales.
