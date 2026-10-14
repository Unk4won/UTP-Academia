/* UTP Academia - script.js
   1) Filtro de cursos (servicios.html)
   2) Tipo de documento DNI / CE (registro.html)
   3) Mensaje de envío correcto y validación de cursos (registro.html) */

// ---------- 1. FILTRO DE CURSOS ----------
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

// ---------- 2. TIPO DE DOCUMENTO (DNI o Carné de Extranjería) ----------
const tipoDocumento = document.getElementById("tipoDocumento");
const numeroDocumento = document.getElementById("numeroDocumento");
const ayudaDocumento = document.getElementById("ayudaDocumento");

// Reglas de cada documento: cantidad de dígitos y textos de ayuda
const reglasDocumento = {
  dni: { digitos: 8, nombre: "DNI" },
  ce: { digitos: 9, nombre: "Carné de Extranjería" },
};

function actualizarDocumento() {
  const regla = reglasDocumento[tipoDocumento.value];
  numeroDocumento.minLength = regla.digitos;
  numeroDocumento.maxLength = regla.digitos;
  numeroDocumento.pattern = "[0-9]{" + regla.digitos + "}";
  numeroDocumento.placeholder = regla.digitos + " dígitos";
  numeroDocumento.title = regla.nombre + ": exactamente " + regla.digitos + " dígitos numéricos";
  ayudaDocumento.textContent = regla.nombre + ": exactamente " + regla.digitos + " dígitos numéricos.";
  numeroDocumento.value = ""; // se borra para escribir el número del documento elegido
}

if (tipoDocumento) {
  tipoDocumento.addEventListener("change", actualizarDocumento);
}

// ---------- 3. FORMULARIO DE REGISTRO ----------
const formularioRegistro = document.getElementById("formularioRegistro");
const mensajeExito = document.getElementById("mensajeExito");

if (formularioRegistro) {
  formularioRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evita recargar la página

    // Exige al menos un curso de interés marcado
    const marcados = formularioRegistro.querySelectorAll('input[name="cursos"]:checked');
    if (marcados.length === 0) {
      alert("Marca al menos un curso de tu interés.");
      return;
    }

    mensajeExito.classList.add("visible");
    formularioRegistro.reset();
    actualizarDocumento(); // vuelve a las reglas del DNI
    mensajeExito.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}
