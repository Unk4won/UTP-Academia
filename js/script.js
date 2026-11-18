/* ==========================================================
   UTP ACADEMIA - script.js (Avance 3)
   Índice:
   0. Constantes y utilidades
   1. Menú responsive (hamburguesa)            -> todas las páginas
   2. Saludo personalizado con prompt()        -> index.html
   3. Filtro de cursos                         -> servicios.html
   4. Ventana modal de detalle de curso        -> servicios.html
   5. Motor de validación de formularios
   6. Formulario de registro                   -> registro.html
   7. Formulario de contacto                   -> contacto.html
   8. Buscador y filtro de la tabla            -> tabla.html
   Cada bloque comprueba que sus elementos existan, de modo que
   un mismo archivo sirve para las 5 páginas sin errores en consola.
   ========================================================== */
"use strict";

// ---------- 0. CONSTANTES Y UTILIDADES ----------
const PUNTO_QUIEBRE_MOVIL = 768; // px, coincide con la media query del CSS
const MIN_PASSWORD = 8;

// Expresiones regulares reutilizables por los validadores
const PATRON = {
  soloLetras: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
  soloDigitos: /^[0-9]+$/,
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  codigoUtp: /^[Uu][0-9]{8}$/,
};

// Reglas de cada tipo de documento: cantidad de dígitos y nombre visible
const REGLAS_DOCUMENTO = {
  dni: { digitos: 8, nombre: "DNI" },
  ce: { digitos: 9, nombre: "Carné de Extranjería" },
};

// Agrega un <li> con texto a una lista (textContent evita inyectar HTML)
function agregarItem(lista, texto) {
  const item = document.createElement("li");
  item.textContent = texto;
  lista.appendChild(item);
}

// ---------- 1. MENÚ RESPONSIVE ----------
const botonMenu = document.getElementById("botonMenu");
const menuPrincipal = document.getElementById("menuPrincipal");

function cambiarMenu(abrir) {
  menuPrincipal.classList.toggle("abierto", abrir);
  botonMenu.classList.toggle("activo", abrir);
  botonMenu.setAttribute("aria-expanded", String(abrir));
  botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
}

if (botonMenu && menuPrincipal) {
  // Evento onclick (asignado como propiedad del elemento)
  botonMenu.onclick = function () {
    cambiarMenu(!menuPrincipal.classList.contains("abierto"));
  };

  // Al elegir un enlace, el menú se cierra
  menuPrincipal.addEventListener("click", function (evento) {
    if (evento.target.closest("a")) {
      cambiarMenu(false);
    }
  });

  // Si la pantalla vuelve a ser ancha, se restablece el estado del menú
  window.addEventListener("resize", function () {
    if (window.innerWidth > PUNTO_QUIEBRE_MOVIL) {
      cambiarMenu(false);
    }
  });
}

// ---------- 2. SALUDO PERSONALIZADO (prompt) ----------
const botonSaludo = document.getElementById("botonSaludo");
const saludo = document.getElementById("saludo");

if (botonSaludo && saludo) {
  botonSaludo.onclick = function () {
    const respuesta = prompt("¿Cómo te llamas?");

    if (respuesta === null) {
      return; // el usuario canceló
    }

    const nombre = respuesta.trim();
    if (nombre === "") {
      alert("No ingresaste ningún nombre. Inténtalo nuevamente.");
      return;
    }

    // Saludo según la hora del día
    const hora = new Date().getHours();
    let momento;
    if (hora < 12) {
      momento = "Buenos días";
    } else if (hora < 19) {
      momento = "Buenas tardes";
    } else {
      momento = "Buenas noches";
    }

    saludo.textContent = momento + ", " + nombre + ". Bienvenido a UTP Academia.";
    saludo.classList.add("visible");
  };
}

// ---------- 3. FILTRO DE CURSOS ----------
const botonesFiltro = document.querySelectorAll(".boton-filtro");
const tarjetasCurso = document.querySelectorAll(".tarjeta-curso");

botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    // Marca como activo solo el botón presionado
    botonesFiltro.forEach(function (b) {
      b.classList.remove("activo");
    });
    boton.classList.add("activo");

    // Muestra u oculta cada tarjeta según su categoría
    const categoria = boton.dataset.categoria;
    tarjetasCurso.forEach(function (tarjeta) {
      const coincide = categoria === "todos" || tarjeta.dataset.categoria === categoria;
      tarjeta.classList.toggle("oculta", !coincide);
    });
  });
});

// ---------- 4. VENTANA MODAL ----------
const modalCurso = document.getElementById("modalCurso");
let disparadorModal = null; // botón que abrió el modal (para devolverle el foco)

function abrirModal(tarjeta, disparador) {
  disparadorModal = disparador;

  const imagen = tarjeta.querySelector("img");
  const modalImagen = document.getElementById("modalImagen");
  modalImagen.src = imagen.src;
  modalImagen.alt = imagen.alt;

  document.getElementById("modalCategoria").textContent = tarjeta.dataset.categoria;
  document.getElementById("modalTitulo").textContent = tarjeta.querySelector("h3").textContent;
  document.getElementById("modalDescripcion").textContent = tarjeta
    .querySelector(".cuerpo-curso p")
    .textContent.replace(/\s+/g, " ")
    .trim();

  // Datos del curso (duración, nivel) tomados de la propia tarjeta
  const listaDatos = document.getElementById("modalDatos");
  listaDatos.innerHTML = "";
  const datos = tarjeta.querySelectorAll(".datos-curso span");
  for (let i = 0; i < datos.length; i++) {
    agregarItem(listaDatos, datos[i].textContent);
  }

  // Temario: el atributo data-temario es una cadena separada por "|"
  const listaTemario = document.getElementById("modalTemario");
  listaTemario.innerHTML = "";
  const temas = (tarjeta.dataset.temario || "").split("|");
  let indice = 0;
  while (indice < temas.length) {
    agregarItem(listaTemario, temas[indice]);
    indice++;
  }

  modalCurso.classList.add("visible");
  modalCurso.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // bloquea el scroll del fondo
  document.getElementById("modalCerrar").focus();
}

function cerrarModal() {
  modalCurso.classList.remove("visible");
  modalCurso.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (disparadorModal) {
    disparadorModal.focus();
  }
}

if (modalCurso) {
  document.querySelectorAll(".boton-detalle").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirModal(boton.closest(".tarjeta-curso"), boton);
    });
  });

  // Cierra con la X o al hacer clic en el fondo oscuro
  modalCurso.addEventListener("click", function (evento) {
    if (evento.target === modalCurso || evento.target.id === "modalCerrar") {
      cerrarModal();
    }
  });

  // Cierra con la tecla Escape
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && modalCurso.classList.contains("visible")) {
      cerrarModal();
    }
  });
}

// ---------- 5. MOTOR DE VALIDACIÓN ----------
/* Cada formulario define un objeto "reglas": { idDelCampo: funcionValidadora }.
   Una función validadora recibe (elemento, formulario) y devuelve un texto
   con el mensaje de error, o "" cuando el valor es válido. */

// Validadores reutilizables
function validarTexto(campo, opciones) {
  const valor = campo.value.trim();
  if (valor === "") return opciones.vacio;
  if (opciones.min && valor.length < opciones.min) {
    return "Debe tener al menos " + opciones.min + " caracteres (actualmente " + valor.length + ").";
  }
  if (opciones.max && valor.length > opciones.max) {
    return "No puede superar los " + opciones.max + " caracteres.";
  }
  if (opciones.patron && !opciones.patron.test(valor)) return opciones.msgPatron;
  return "";
}

const validar = {
  nombre: function (campo) {
    return validarTexto(campo, {
      vacio: "Ingresa tu nombre completo.",
      min: 3,
      max: 50,
      patron: PATRON.soloLetras,
      msgPatron: "El nombre solo puede contener letras y espacios.",
    });
  },
  correo: function (campo) {
    const valor = campo.value.trim();
    if (valor === "") return "Ingresa tu correo electrónico.";
    if (!PATRON.correo.test(valor)) return "Ingresa un correo válido (ej. U12345678@utp.edu.pe).";
    return "";
  },
  celular: function (campo) {
    const valor = campo.value.trim();
    if (valor === "") return "Ingresa tu número de celular.";
    if (!PATRON.soloDigitos.test(valor)) return "Solo se permiten dígitos numéricos.";
    if (valor.length !== 9) return "El número debe tener exactamente 9 dígitos.";
    return "";
  },
  seleccion: function (campo, mensaje) {
    return campo.value === "" ? mensaje : "";
  },
  password: function (campo) {
    const valor = campo.value;
    if (valor === "") return "Crea una contraseña.";
    if (valor.length < MIN_PASSWORD) return "La contraseña debe tener al menos " + MIN_PASSWORD + " caracteres.";
    if (!/[A-Z]/.test(valor)) return "Incluye al menos una letra mayúscula.";
    if (!/[a-z]/.test(valor)) return "Incluye al menos una letra minúscula.";
    if (!/[0-9]/.test(valor)) return "Incluye al menos un número.";
    return "";
  },
};

// Muestra u oculta el mensaje de error de un campo
function quitarResultado(elemento) {
  const contenedor = elemento.closest(".grupo-formulario");
  const error = contenedor.querySelector(".mensaje-error");
  if (error) error.remove();
  elemento.classList.remove("campo-invalido", "campo-valido");
  elemento.removeAttribute("aria-invalid");
}

function mostrarResultado(elemento, mensaje) {
  if (mensaje === "") {
    quitarResultado(elemento);
    if (elemento.classList.contains("campo")) {
      elemento.classList.add("campo-valido");
    }
    return;
  }

  const contenedor = elemento.closest(".grupo-formulario");
  let error = contenedor.querySelector(".mensaje-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "mensaje-error";
    error.setAttribute("role", "alert");
    contenedor.appendChild(error);
  }
  error.textContent = mensaje;
  elemento.classList.add("campo-invalido");
  elemento.classList.remove("campo-valido");
  elemento.setAttribute("aria-invalid", "true");
}

function validarUno(id, reglas, formulario) {
  const elemento = document.getElementById(id);
  const mensaje = reglas[id](elemento, formulario);
  mostrarResultado(elemento, mensaje);
  return mensaje === "";
}

// Recorre todas las reglas; devuelve el primer campo inválido o null
function validarTodo(formulario, reglas) {
  let primerInvalido = null;
  for (const id in reglas) {
    const valido = validarUno(id, reglas, formulario);
    if (!valido && primerInvalido === null) {
      primerInvalido = document.getElementById(id);
    }
  }
  return primerInvalido;
}

// Validación mientras el usuario escribe (input) o elige (change)
function activarValidacionEnVivo(formulario, reglas) {
  for (const id in reglas) {
    const elemento = document.getElementById(id);
    const usaChange = elemento.tagName === "SELECT" || elemento.classList.contains("grupo-opciones");

    if (usaChange) {
      elemento.addEventListener("change", function () {
        validarUno(id, reglas, formulario);
      });
    } else {
      // Al salir del campo se valida; desde entonces se revalida en cada tecla
      elemento.addEventListener("blur", function () {
        elemento.dataset.tocado = "si";
        validarUno(id, reglas, formulario);
      });
      elemento.addEventListener("input", function () {
        if (elemento.dataset.tocado) {
          validarUno(id, reglas, formulario);
        }
      });
    }
  }
}

function limpiarValidacion(formulario) {
  formulario.querySelectorAll(".campo, .grupo-opciones").forEach(function (elemento) {
    quitarResultado(elemento);
    delete elemento.dataset.tocado;
  });
}

function enfocarCampo(elemento) {
  const objetivo = elemento.matches("input, select, textarea") ? elemento : elemento.querySelector("input");
  objetivo.focus();
  objetivo.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Contador de caracteres para los <textarea> con maxlength
function activarContador(textarea) {
  const contador = textarea.closest(".grupo-formulario").querySelector(".contador");
  if (!contador) return;
  const actualizar = function () {
    contador.textContent = textarea.value.length + " / " + textarea.maxLength;
  };
  textarea.addEventListener("input", actualizar);
  actualizar();
}

// ---------- 6. FORMULARIO DE REGISTRO ----------
function iniciarRegistro(formulario) {
  const tipoDocumento = document.getElementById("tipoDocumento");
  const numeroDocumento = document.getElementById("numeroDocumento");
  const ayudaDocumento = document.getElementById("ayudaDocumento");
  const password = document.getElementById("password");
  const confirmarPassword = document.getElementById("confirmarPassword");
  const barraFortaleza = document.getElementById("barraFortaleza");
  const textoFortaleza = document.getElementById("textoFortaleza");
  const mensajeExito = document.getElementById("mensajeExito");
  const listaRegistros = document.getElementById("listaRegistros");
  const contadorRegistros = document.getElementById("contadorRegistros");
  const listaVacia = document.getElementById("listaVacia");
  const botonLimpiar = document.getElementById("botonLimpiar");

  // Arreglo que almacena temporalmente las inscripciones de la sesión
  const registros = [];

  // Reglas de validación: el orden coincide con el del formulario
  const reglas = {
    nombre: validar.nombre,
    tipoDocumento: function (campo) {
      return validar.seleccion(campo, "Selecciona un tipo de documento.");
    },
    numeroDocumento: function (campo) {
      const regla = REGLAS_DOCUMENTO[tipoDocumento.value];
      const valor = campo.value.trim();
      if (valor === "") return "Ingresa tu " + regla.nombre + ".";
      if (!PATRON.soloDigitos.test(valor)) return "Solo se permiten dígitos numéricos.";
      if (valor.length !== regla.digitos) {
        return "El " + regla.nombre + " debe tener exactamente " + regla.digitos + " dígitos.";
      }
      return "";
    },
    codigoUtp: function (campo) {
      return validarTexto(campo, {
        vacio: "Ingresa tu código UTP.",
        patron: PATRON.codigoUtp,
        msgPatron: "Formato inválido: la letra U seguida de 8 dígitos (ej. U12345678).",
      });
    },
    celular: validar.celular,
    email: validar.correo,
    grupoGenero: function () {
      return formulario.querySelector('input[name="genero"]:checked') ? "" : "Selecciona una opción de género.";
    },
    pais: function (campo) {
      return validar.seleccion(campo, "Selecciona tu país.");
    },
    grupoCursos: function () {
      return formulario.querySelector('input[name="cursos"]:checked') ? "" : "Marca al menos un curso de tu interés.";
    },
    opinion: function (campo) {
      return validarTexto(campo, {
        vacio: "Escribe tu recomendación u opinión.",
        min: 10,
        max: 500,
      });
    },
    password: validar.password,
    confirmarPassword: function (campo) {
      if (campo.value === "") return "Confirma tu contraseña.";
      if (campo.value !== password.value) return "Las contraseñas no coinciden.";
      return "";
    },
  };

  // --- Tipo de documento: ajusta longitud, ayuda y placeholder (change) ---
  function actualizarDocumento() {
    const regla = REGLAS_DOCUMENTO[tipoDocumento.value];
    // setAttribute no valida contra el otro límite; las propiedades minLength/maxLength
    // lanzan IndexSizeError si en algún instante min > max (ocurre al pasar de CE a DNI)
    numeroDocumento.setAttribute("minlength", regla.digitos);
    numeroDocumento.setAttribute("maxlength", regla.digitos);
    numeroDocumento.placeholder = regla.digitos + " dígitos";
    ayudaDocumento.textContent = regla.nombre + ": exactamente " + regla.digitos + " dígitos numéricos.";
    numeroDocumento.value = ""; // se borra para escribir el número del documento elegido
    quitarResultado(numeroDocumento);
    delete numeroDocumento.dataset.tocado;
  }
  tipoDocumento.addEventListener("change", actualizarDocumento);

  // --- Indicador de fortaleza de la contraseña (input) ---
  function actualizarFortaleza() {
    const valor = password.value;
    let puntaje = 0;
    if (valor.length >= MIN_PASSWORD) puntaje++;
    if (/[A-Z]/.test(valor) && /[a-z]/.test(valor)) puntaje++;
    if (/[0-9]/.test(valor)) puntaje++;
    if (/[^A-Za-z0-9]/.test(valor)) puntaje++;

    let texto = "Usa mayúsculas, minúsculas y números (mínimo " + MIN_PASSWORD + " caracteres).";
    let color = "transparent";
    if (valor !== "") {
      switch (puntaje) {
        case 0:
        case 1:
          texto = "Seguridad: débil";
          color = "#dc2626";
          break;
        case 2:
          texto = "Seguridad: regular";
          color = "#f59e0b";
          break;
        case 3:
          texto = "Seguridad: buena";
          color = "#65a30d";
          break;
        default:
          texto = "Seguridad: fuerte";
          color = "#16a34a";
      }
    }
    barraFortaleza.style.width = (valor === "" ? 0 : Math.max(puntaje, 1) * 25) + "%";
    barraFortaleza.style.backgroundColor = color;
    textoFortaleza.textContent = texto;
  }
  password.addEventListener("input", function () {
    actualizarFortaleza();
    // Si ya se escribió la confirmación, se revalida al cambiar la contraseña
    if (confirmarPassword.dataset.tocado) {
      validarUno("confirmarPassword", reglas, formulario);
    }
  });

  // --- Lista de inscripciones (recorre el arreglo y muestra resultados) ---
  function mostrarRegistros() {
    listaRegistros.innerHTML = "";
    for (let i = 0; i < registros.length; i++) {
      const registro = registros[i];
      const item = document.createElement("li");
      item.className = "item-registro";

      const titulo = document.createElement("strong");
      titulo.textContent = i + 1 + ". " + registro.nombre;

      const detalle = document.createElement("span");
      detalle.textContent = registro.codigo + " · " + registro.cursos.join(", ") + " · " + registro.hora;

      item.append(titulo, detalle);
      listaRegistros.appendChild(item);
    }
    contadorRegistros.textContent = registros.length;
    listaVacia.style.display = registros.length === 0 ? "block" : "none";
    botonLimpiar.disabled = registros.length === 0;
  }

  function construirRegistro() {
    const cursos = [];
    formulario.querySelectorAll('input[name="cursos"]:checked').forEach(function (casilla) {
      cursos.push(casilla.parentElement.textContent.trim());
    });
    return {
      nombre: formulario.elements.nombre.value.trim(),
      documento: REGLAS_DOCUMENTO[tipoDocumento.value].nombre + " " + numeroDocumento.value,
      codigo: formulario.elements.codigo_utp.value.toUpperCase(),
      email: formulario.elements.email.value.trim(),
      cursos: cursos,
      hora: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      // La contraseña no se almacena: solo se usa para validar
    };
  }

  botonLimpiar.addEventListener("click", function () {
    if (registros.length === 0) return;
    if (confirm("¿Deseas eliminar las " + registros.length + " inscripción(es) de esta sesión?")) {
      registros.length = 0;
      mostrarRegistros();
    }
  });

  // --- Envío del formulario (submit) ---
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evita recargar la página
    mensajeExito.classList.remove("visible");

    const primerInvalido = validarTodo(formulario, reglas);
    if (primerInvalido !== null) {
      enfocarCampo(primerInvalido);
      return; // hay errores: no se registra nada
    }

    if (!confirm("¿Confirmas el envío de tu registro?")) {
      return;
    }

    registros.push(construirRegistro());
    mostrarRegistros();

    formulario.reset();
    actualizarFortaleza(); // primero la barra: ningún paso posterior puede impedir su reinicio
    limpiarValidacion(formulario);
    actualizarDocumento(); // vuelve a las reglas del DNI
    formulario.querySelectorAll("textarea[maxlength]").forEach(function (area) {
      area.dispatchEvent(new Event("input")); // reinicia el contador de caracteres
    });

    mensajeExito.classList.add("visible");
    mensajeExito.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // La barra se sincroniza siempre con el valor real del campo, sin depender de "input":
  // - reset: el evento se dispara ANTES de vaciar los campos, por eso se difiere un ciclo
  // - change y pageshow: autocompletado del navegador o valores restaurados al recargar/volver
  formulario.addEventListener("reset", function () {
    setTimeout(actualizarFortaleza, 0);
  });
  password.addEventListener("change", actualizarFortaleza);
  window.addEventListener("pageshow", actualizarFortaleza);

  activarValidacionEnVivo(formulario, reglas);
  actualizarDocumento();
  actualizarFortaleza();
  mostrarRegistros();
}

// ---------- 7. FORMULARIO DE CONTACTO ----------
function iniciarContacto(formulario) {
  const reglas = {
    nombre: validar.nombre,
    email: validar.correo,
    telefono: validar.celular,
    asunto: function (campo) {
      return validar.seleccion(campo, "Selecciona un asunto.");
    },
    mensaje: function (campo) {
      return validarTexto(campo, {
        vacio: "Escribe tu mensaje.",
        min: 10,
        max: 500,
      });
    },
  };

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const primerInvalido = validarTodo(formulario, reglas);
    if (primerInvalido !== null) {
      enfocarCampo(primerInvalido);
      return;
    }

    const nombre = formulario.elements.nombre.value.trim();
    const asunto = formulario.elements.asunto.selectedOptions[0].textContent;
    alert("Gracias, " + nombre + ". Tu mensaje sobre \"" + asunto + "\" fue enviado correctamente.");

    formulario.reset();
    limpiarValidacion(formulario);
    formulario.querySelectorAll("textarea[maxlength]").forEach(function (area) {
      area.dispatchEvent(new Event("input"));
    });
  });

  activarValidacionEnVivo(formulario, reglas);
}

// ---------- 8. BUSCADOR Y FILTRO DE LA TABLA ----------
const buscadorTabla = document.getElementById("buscadorTabla");
const filtroEstado = document.getElementById("filtroEstado");
const resultadosTabla = document.getElementById("resultadosTabla");

function aplicarFiltroTabla() {
  const filas = document.querySelectorAll(".tabla-academica tbody tr");
  const texto = buscadorTabla.value.trim().toLowerCase();
  const estado = filtroEstado.value;
  let visibles = 0;

  filas.forEach(function (fila) {
    const estadoFila = fila.querySelector(".estado").textContent.trim();
    const coincideTexto = fila.textContent.toLowerCase().includes(texto);
    const coincideEstado = estado === "todos" || estadoFila === estado;
    const mostrar = coincideTexto && coincideEstado;

    fila.style.display = mostrar ? "" : "none";
    if (mostrar) visibles++;
  });

  resultadosTabla.textContent =
    visibles === 0 ? "No se encontraron cursos con esos criterios." : "Mostrando " + visibles + " de " + filas.length + " cursos.";
}

if (buscadorTabla && filtroEstado && resultadosTabla) {
  buscadorTabla.addEventListener("input", aplicarFiltroTabla); // evento input
  filtroEstado.addEventListener("change", aplicarFiltroTabla); // evento change
  aplicarFiltroTabla();
}

// ---------- INICIALIZACIÓN ----------
const formularioRegistro = document.getElementById("formularioRegistro");
const formularioContacto = document.getElementById("formularioContacto");

if (formularioRegistro) iniciarRegistro(formularioRegistro);
if (formularioContacto) iniciarContacto(formularioContacto);

document.querySelectorAll("textarea[maxlength]").forEach(activarContador);
