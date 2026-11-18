# Diccionario de Funciones — UTP Academia (`js/script.js`)

Documentación técnica de las funciones, validadores y manejadores de eventos implementados en **`js/script.js`** para la plataforma web **UTP Academia** (Taller de Programación Web — Grupo 7).

El archivo utiliza modo estricto (`"use strict"`) y comprueba la existencia de los nodos en el DOM antes de asociar eventos, lo que permite reutilizar un único script en las 5 vistas HTML (`index.html`, `servicios.html`, `registro.html`, `contacto.html` y `tabla.html`) sin generar errores en consola.

---

## Tabla Resumen

| Función / Módulo | Sección | Páginas donde actúa | Propósito principal |
| :--- | :--- | :--- | :--- |
| `agregarItem(lista, texto)` | 0. Utilidades | `servicios.html` | Crea e inserta un elemento `<li>` seguro en el DOM. |
| `cambiarMenu(abrir)` | 1. Menú Responsive | Todas las páginas | Alterna la visibilidad del menú móvil y atributos ARIA. |
| *Evento `botonSaludo.onclick`* | 2. Saludo Dinámico | `index.html` | Solicita nombre con `prompt()` y saluda según la hora. |
| *Filtro `.boton-filtro`* | 3. Filtro de Cursos | `servicios.html` | Filtra tarjetas de cursos por atributo `data-categoria`. |
| `abrirModal(tarjeta, disparador)` | 4. Ventana Modal | `servicios.html` | Rellena y despliega el modal con el temario del curso. |
| `cerrarModal()` | 4. Ventana Modal | `servicios.html` | Oculta el modal y restaura el foco y scroll del documento. |
| `validarTexto(campo, opciones)` | 5. Validación | `registro.html`, `contacto.html` | Valida longitud mínima/máxima y expresiones regulares. |
| `validar` *(objeto validador)* | 5. Validación | `registro.html`, `contacto.html` | Agrupa reglas para nombre, correo, celular, select y clave. |
| `quitarResultado(elemento)` | 5. Validación | `registro.html`, `contacto.html` | Limpia mensajes de error y clases visuales de un campo. |
| `mostrarResultado(elemento, mensaje)` | 5. Validación | `registro.html`, `contacto.html` | Renderiza alertas de error o marca el campo como válido. |
| `validarUno(id, reglas, formulario)` | 5. Validación | `registro.html`, `contacto.html` | Ejecuta la regla de validación de un campo individual. |
| `validarTodo(formulario, reglas)` | 5. Validación | `registro.html`, `contacto.html` | Valida todos los campos y devuelve el primer inválido. |
| `activarValidacionEnVivo(formulario, reglas)` | 5. Validación | `registro.html`, `contacto.html` | Activa validación dinámica en eventos `blur`, `input` y `change`. |
| `limpiarValidacion(formulario)` | 5. Validación | `registro.html`, `contacto.html` | Restablece el estado visual de todos los campos del formulario. |
| `enfocarCampo(elemento)` | 5. Validación | `registro.html`, `contacto.html` | Desplaza la vista y enfoca el primer campo con error. |
| `activarContador(textarea)` | 5. Validación | `registro.html`, `contacto.html` | Actualiza en tiempo real el contador de caracteres (`0 / 500`). |
| `iniciarRegistro(formulario)` | 6. Registro | `registro.html` | Controla validación, fortaleza de clave y lista de sesión. |
| `iniciarContacto(formulario)` | 7. Contacto | `contacto.html` | Gestiona la validación y envío simulado de consultas. |
| `aplicarFiltroTabla()` | 8. Directorio | `tabla.html` | Filtra filas de la tabla por texto y estado académico. |

---

## 0. Constantes y Utilidades

### `agregarItem(lista, texto)`
* **Ubicación:** `js/script.js` (líneas 34–38)
* **Parámetros:**
  * `lista` (`HTMLElement`): Nodo `<ul>` u `<ol>` de destino.
  * `texto` (`string`): Contenido textual del elemento.
* **Retorno:** `void`
* **Qué hace:** Crea dinámicamente un nodo `<li>`, le asigna el texto recibido y lo inserta como hijo de `lista`.
* **Por qué está así:** Utiliza `textContent` en lugar de `innerHTML` para evitar la interpretación de etiquetas HTML y prevenir vulnerabilidades XSS.

---

## 1. Menú Responsive

### `cambiarMenu(abrir)`
* **Ubicación:** `js/script.js` (líneas 44–49)
* **Parámetros:**
  * `abrir` (`boolean`): `true` para desplegar el menú, `false` para cerrarlo.
* **Retorno:** `void`
* **Qué hace:** Alterna las clases CSS `.abierto` en `#menuPrincipal` y `.activo` en `#botonMenu`, además de actualizar los atributos `aria-expanded` y `aria-label`.
* **Por qué está así:** Aplica separación de responsabilidades (JS solo gestiona el estado lógico y CSS controla la presentación visual mediante media queries) y garantiza accesibilidad para lectores de pantalla. Incluye delegación de eventos (`evento.target.closest("a")`) y escucha el evento `window.resize` para cerrar el menú si el ancho supera `768 px`.

---

## 2. Saludo Personalizado (`index.html`)

### Manejador `botonSaludo.onclick`
* **Ubicación:** `js/script.js` (líneas 78–105)
* **Parámetros:** Ninguno (evento `click` sobre `#botonSaludo`).
* **Retorno:** `void`
* **Qué hace:** Abre un cuadro `prompt()` solicitando el nombre del usuario, valida que no sea `null` ni una cadena vacía tras aplicar `.trim()`, determina el saludo adecuado según `new Date().getHours()` (*Buenos días*, *Buenas tardes* o *Buenas noches*) y muestra el mensaje en `<p id="saludo">` añadiendo la clase `.visible`.
* **Por qué está así:** Valida casos borde para evitar imprimir `"null"` o mensajes en blanco, e inyecta el resultado con `textContent` para neutralizar cualquier código HTML ingresado por el usuario.

---

## 3. Filtro de Cursos (`servicios.html`)

### Manejadores de `.boton-filtro`
* **Ubicación:** `js/script.js` (líneas 112–124)
* **Parámetros:** `boton` (`HTMLElement` iterado mediante `forEach`).
* **Retorno:** `void`
* **Qué hace:** Al pulsar un botón de categoría, remueve `.activo` de todos los botones, marca el seleccionado y alterna la clase `.oculta` en cada `.tarjeta-curso` comparando su `dataset.categoria` con la categoría elegida (o `"todos"`).
* **Por qué está así:** Evita recargar la página o duplicar tarjetas en el HTML usando atributos personalizados `data-*` nativos.

---

## 4. Ventana Modal de Detalle (`servicios.html`)

### `abrirModal(tarjeta, disparador)`
* **Ubicación:** `js/script.js` (líneas 130–166)
* **Parámetros:**
  * `tarjeta` (`HTMLElement`): Artículo `.tarjeta-curso` seleccionado.
  * `disparador` (`HTMLElement`): Botón `.boton-detalle` que originó la apertura.
* **Retorno:** `void`
* **Qué hace:** Extrae imagen, categoría, título, descripción, metadatos y la cadena `data-temario` (separada por `|`) de la tarjeta para poblar el modal `#modalCurso`. Añade `.visible`, bloquea el desplazamiento del fondo (`document.body.style.overflow = "hidden"`) y mueve el foco al botón de cierre.
* **Por qué está así:** Permite mantener un único contenedor modal reutilizable en el HTML en lugar de crear seis modales estáticos, mejorando el rendimiento y la accesibilidad mediante gestión de foco y `aria-hidden`.

### `cerrarModal()`
* **Ubicación:** `js/script.js` (líneas 168–175)
* **Parámetros:** Ninguno.
* **Retorno:** `void`
* **Qué hace:** Oculta `#modalCurso`, restablece `aria-hidden="true"`, habilita nuevamente el scroll del `<body>` y devuelve el foco al botón `disparadorModal`.
* **Por qué está así:** Se invoca desde tres vías (botón `×`, clic fuera del cuadro modal y tecla `Escape`) para cumplir con estándares de usabilidad y navegación por teclado.

---

## 5. Motor de Validación de Formularios

### `validarTexto(campo, opciones)`
* **Ubicación:** `js/script.js` (líneas 200–211)
* **Parámetros:**
  * `campo` (`HTMLInputElement | HTMLTextAreaElement`): Campo a evaluar.
  * `opciones` (`Object`): Configuración con `vacio`, `min`, `max`, `patron` (`RegExp`) y `msgPatron`.
* **Retorno:** `string` — Mensaje de error o cadena vacía `""` si es válido.
* **Qué hace:** Comprueba espacios vacíos con `.trim()`, límites de longitud y coincidencia contra expresiones regulares.
* **Por qué está así:** Centraliza la lógica repetitiva de validación de cadenas en una sola función parametrizable.

### Objeto `validar`
* **Ubicación:** `js/script.js` (líneas 213–249)
* **Métodos:**
  * `validar.nombre(campo)`: Exige mínimo 3 y máximo 50 caracteres, solo letras y espacios (`PATRON.soloLetras`).
  * `validar.correo(campo)`: Verifica formato de correo electrónico (`PATRON.correo`).
  * `validar.celular(campo)`: Exige exactamente 9 dígitos numéricos (`PATRON.soloDigitos`).
  * `validar.seleccion(campo, mensaje)`: Verifica que un `<select>` tenga una opción distinta de `""`.
  * `validar.password(campo)`: Exige mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.
* **Retorno:** `string` — Mensaje de error o `""`.
* **Por qué está así:** Encapsula reglas reutilizables entre `registro.html` y `contacto.html` sin duplicar código.

### `quitarResultado(elemento)` y `mostrarResultado(elemento, mensaje)`
* **Ubicación:** `js/script.js` (líneas 252–280)
* **Parámetros:**
  * `elemento` (`HTMLElement`): Campo o contenedor `.grupo-opciones`.
  * `mensaje` (`string`): Texto de error (solo en `mostrarResultado`).
* **Retorno:** `void`
* **Qué hace:** `quitarResultado` elimina nodos `.mensaje-error` y clases de estado. `mostrarResultado` aplica `.campo-valido` si `mensaje === ""` o inserta un `<p class="mensaje-error" role="alert">` y aplica `.campo-invalido` + `aria-invalid="true"` si hay error.
* **Por qué está así:** El atributo `role="alert"` anuncia los errores de validación de forma inmediata a tecnologías asistivas.

### `validarUno(id, reglas, formulario)` y `validarTodo(formulario, reglas)`
* **Ubicación:** `js/script.js` (líneas 282–299)
* **Parámetros:**
  * `id` (`string`): Identificador del campo en el DOM.
  * `reglas` (`Object`): Diccionario `{ idCampo: funcionValidadora }`.
  * `formulario` (`HTMLFormElement`): Formulario activo.
* **Retorno:** `boolean` en `validarUno`; `HTMLElement | null` (primer campo con error) en `validarTodo`.
* **Qué hace:** Ejecuta la validación unitaria o recorre todas las reglas del formulario al intentar enviarlo.
* **Por qué está así:** Permite mostrar todos los errores simultáneamente en el `submit` sin detenerse en el primer fallo, devolviendo la referencia exacta para enfocarlo.

### `activarValidacionEnVivo(formulario, reglas)`
* **Ubicación:** `js/script.js` (líneas 302–322)
* **Parámetros:** `formulario` (`HTMLFormElement`), `reglas` (`Object`).
* **Retorno:** `void`
* **Qué hace:** Escucha `change` en listas desplegables y grupos de opciones, y combina `blur` + `input` en cajas de texto marcando `dataset.tocado = "si"`.
* **Por qué está así:** Evita mostrar mensajes de error agresivos mientras el usuario escribe por primera vez; solo valida en cada pulsación una vez que el usuario ha salido del campo (`blur`).

### `limpiarValidacion(formulario)`, `enfocarCampo(elemento)` y `activarContador(textarea)`
* **Ubicación:** `js/script.js` (líneas 324–346)
* **Parámetros:** `formulario` (`HTMLFormElement`), `elemento` (`HTMLElement`), `textarea` (`HTMLTextAreaElement`).
* **Retorno:** `void`
* **Qué hace:** `limpiarValidacion` reinicia clases y flags tras el envío; `enfocarCampo` hace scroll suave y posiciona el cursor en el primer error; `activarContador` sincroniza el conteo `longitud / maxlength` en cada evento `input`.
* **Por qué está así:** Mejora la experiencia de usuario (UX) en formularios extensos con validación personalizada (`novalidate`).

---

## 6. Formulario de Registro (`registro.html`)

### `iniciarRegistro(formulario)`
* **Ubicación:** `js/script.js` (líneas 349–516)
* **Parámetros:** `formulario` (`HTMLFormElement` correspondiente a `#formularioRegistro`).
* **Retorno:** `void`
* **Qué hace:** Inicializa el arreglo en memoria `registros = []`, define las reglas específicas (incluyendo código UTP `U + 8 dígitos` y confirmación de contraseña) y coordina cuatro funciones internas:
  * `actualizarDocumento()` *(líneas 414–425)*: Ajusta `minlength`, `maxlength`, `placeholder` y texto de ayuda dinámicamente al alternar entre **DNI (8 dígitos)** y **Carné de Extranjería (9 dígitos)**.
  * `actualizarFortaleza()` *(líneas 429–458)*: Evalúa la contraseña en 4 criterios (longitud, mayúsculas/minúsculas, números y símbolos) para actualizar el ancho y color de `#barraFortaleza`.
  * `mostrarRegistros()` *(líneas 468–486)*: Renderiza en `#listaRegistros` las inscripciones acumuladas durante la sesión y habilita o deshabilita `#botonLimpiar`.
  * `construirRegistro()` *(líneas 488–501)*: Construye el objeto con los datos sanitizados del estudiante y la hora de inscripción (`toLocaleTimeString("es-PE")`).
* **Por qué está así:** Por seguridad, `construirRegistro()` omite almacenar la contraseña en el arreglo de sesión, y `actualizarDocumento()` usa `setAttribute` para evitar excepciones `IndexSizeError` al reducir `maxlength` de 9 a 8 dígitos.

---

## 7. Formulario de Contacto (`contacto.html`)

### `iniciarContacto(formulario)`
* **Ubicación:** `js/script.js` (líneas 519–555)
* **Parámetros:** `formulario` (`HTMLFormElement` correspondiente a `#formularioContacto`).
* **Retorno:** `void`
* **Qué hace:** Configura las reglas para nombre, correo, teléfono, asunto y mensaje; intercepta `submit` con `evento.preventDefault()`, valida todos los campos, muestra una confirmación con `alert()` y reinicia el formulario junto con sus contadores y estilos.
* **Por qué está así:** Reutiliza al 100 % el motor de validación de la sección 5 sin duplicar lógica.

---

## 8. Buscador y Filtro de la Tabla (`tabla.html`)

### `aplicarFiltroTabla()`
* **Ubicación:** `js/script.js` (líneas 562–576)
* **Parámetros:** Ninguno (lee `#buscadorTabla` y `#filtroEstado`).
* **Retorno:** `void`
* **Qué hace:** Recorre todas las filas `tbody tr` de `.tabla-academica`, comprueba coincidencia insensible a mayúsculas con el texto ingresado y coincidencia exacta con el estado (`Activo` o `Próximo Ciclo`), oculta las filas no coincidentes (`display = "none"`) y actualiza el contador dinámico en `#resultadosTabla`.
* **Por qué está así:** Combina búsqueda libre (`input`) y filtrado categórico (`change`) en tiempo real directamente sobre el DOM sin dependencias externas.
