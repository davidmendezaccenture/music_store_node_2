document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "http://localhost:3000";
  const form = document.getElementById("registroForm");
  if (!form) {
    return;
  }

  function setError(input, message) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    const errorDiv = document.getElementById(input.id + "Error");
    if (errorDiv) {
      errorDiv.textContent = message;
    }
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    const errorDiv = document.getElementById(input.id + "Error");
    if (errorDiv) {
      errorDiv.textContent = "";
    }
  }

  function validarCampo(input) {
    clearError(input);

    if (!input.checkValidity()) {
      if (input.validity.valueMissing) {
        setError(input, "Este campo es obligatorio.");
      } else if (input.validity.typeMismatch) {
        setError(input, "El valor no tiene el formato correcto.");
      } else if (input.validity.patternMismatch) {
        setError(input, "Formato no válido.");
      } else if (input.validity.tooShort) {
        setError(input, `Debe tener al menos ${input.minLength} caracteres.`);
      }
      return false;
    }
    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    const campos = [
      form.nombre,
      form.apellidos,
      form.telefono,
      form.pais,
      form.region,
      form.fechaNacimiento,
      form.direccion,
      form.email,
      form.confirmarEmail,
      form.password,
      form.confirmarPassword,
      form.captcha,
    ];

    campos.forEach((campo) => {
      if (!validarCampo(campo)) valid = false;
    });

    if (form.email.value.trim() !== form.confirmarEmail.value.trim()) {
      setError(form.confirmarEmail, "Los correos electrónicos no coinciden.");
      valid = false;
    } else {
      clearError(form.confirmarEmail);
    }

    if (form.password.value !== form.confirmarPassword.value) {
      setError(form.confirmarPassword, "Las contraseñas no coinciden.");
      valid = false;
    } else {
      clearError(form.confirmarPassword);
    }

    // 👉 ENFOCAR PRIMER CAMPO CON ERROR (Paso 3)
    if (!valid) {
      const firstError = form.querySelector(".is-invalid");
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    const usuario = {
      username: form.nombre.value.trim(),
      password: form.password.value,
      email: form.email.value.trim(),
      nombre: form.nombre.value.trim(),
      apellidos: form.apellidos.value.trim(),
      telefono: form.telefono.value.trim(),
      pais: form.pais.value,
      region: form.region.value.trim(),
      fechaNacimiento: form.fechaNacimiento.value,
      direccion: form.direccion.value.trim(),
    };

    fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        alert(data.message || data.mensaje || "Usuario registrado correctamente.");
        form.reset();
        campos.forEach((campo) => clearError(campo));
      })
      .catch(async (err) => {
        let errorMsg = "Error al registrar usuario.";
        if (err.json) {
          const errorData = await err.json();
          errorMsg = errorData.error || errorMsg;
        }
        alert(errorMsg);
      });
  });
});

// Mostrar/ocultar contraseña
document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const icon = this.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("bi-eye");
      icon.classList.add("bi-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("bi-eye-slash");
      icon.classList.add("bi-eye");
    }
  });
});