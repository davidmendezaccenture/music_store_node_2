document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formContacto");
  if (!form) return; // Evita errores si el formulario no existe
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");
  const telefono = document.getElementById("telefono");
  const mensajeExito = document.getElementById("mensajeExito");
  const contador = document.getElementById("contadorMensaje");
  const maxCaracteres = 100;

  // Contador de caracteres en vivo
  mensaje.addEventListener("input", function () {
    const longitud = mensaje.value.length;
    contador.textContent = `${longitud} / ${maxCaracteres} caracteres`;
    if (longitud > maxCaracteres) {
      contador.classList.add("text-danger");
    } else {
      contador.classList.remove("text-danger");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valido = true;

    nombre.value = nombre.value.trim();
    email.value = email.value.trim();
    mensaje.value = mensaje.value.trim();
    telefono.value = telefono.value.trim();

    // Validación nombre
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;
    if (!nombre.value || !nombreValido.test(nombre.value)) {
      nombre.classList.add("is-invalid");
      valido = false;
    } else {
      nombre.classList.remove("is-invalid");
    }

    // Validación email
    const emailValidacion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value || !emailValidacion.test(email.value)) {
      email.classList.add("is-invalid");
      valido = false;
    } else {
      email.classList.remove("is-invalid");
    }

    // Validación mensaje
    if (!mensaje.value || mensaje.value.length < 10) {
      mensaje.classList.add("is-invalid");
      valido = false;
    } else {
      mensaje.classList.remove("is-invalid");
    }

    // Validación teléfono (opcional)
    const telefonoLimpio = telefono.value.replace(/[^\d]/g, "");
    if (telefono.value && telefonoLimpio.length < 7) {
      telefono.classList.add("is-invalid");
      valido = false;
    } else {
      telefono.classList.remove("is-invalid");
    }

    // envio con ajax
    if (valido) {
      const datos = {
        nombre: nombre.value,
        email: email.value,
        mensaje: mensaje.value,
        telefono: telefono.value,
      };

      $.ajax({
        type: "POST",
        url: "/api/contacto",
        contentType: "application/json",
        data: JSON.stringify(datos),
        success: function (respuesta) {
          mensajeExito.classList.remove("d-none");
          mensajeExito.classList.add("show");
          form.reset();
          contador.textContent = "0 / 100 caracteres";
        },
        error: function () {
          alert("Error al enviar el mensaje");
        },
      });
    } else {
      mensajeExito.classList.add("d-none");
    }
  });
});
