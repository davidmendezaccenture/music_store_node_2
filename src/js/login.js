function initializeLogin() {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");

  // Lógica para login
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      if (!email || !password) {
        alert("Por favor completa todos los campos.");
        return;
      }

      fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            // Guardar usuario en localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({
                email: data.user.email,
                username: data.user.username,
              })
            );
            // Guardar username plano para el carrito por usuario
            localStorage.setItem("username", data.user.username);

            // Migrar carrito temporal si existe
            const tempCarrito = localStorage.getItem("carrito");
            if (tempCarrito) {
              localStorage.setItem(
                `carrito_${data.user.username}`,
                tempCarrito
              );
              localStorage.removeItem("carrito");
            }

            // Mostrar mensaje de login exitoso en el formulario del modal
            const loginForm = document.getElementById("loginForm");
            if (loginForm) {
              let msg = document.getElementById("login-success-msg");
              if (!msg) {
                msg = document.createElement("div");
                msg.id = "login-success-msg";
                msg.className = "alert alert-success mt-2 corporate-success";
                msg.setAttribute("role", "alert");
                loginForm.prepend(msg);
              }
              msg.textContent = "¡Login exitoso! Redirigiendo...";
            }
            // Redirección inteligente: si estamos en carrito, recarga carrito; si no, recarga la página actual
            const currentPath = window.location.pathname;
            setTimeout(() => {
              if (currentPath.includes("carrito.html")) {
                window.location.reload();
              } else {
                window.location.href = window.location.href;
              }
            }, 1200);
          } else {
            alert(data.error || "Usuario o contraseña incorrectos.");
          }
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error);
          alert("Error al conectar con el servidor.");
        });
    });
  }
}

// Mostrar/ocultar contraseña en el login (ojito)
function setupPasswordToggle() {
  var toggleBtn = document.getElementById("togglePassword");
  var passwordInput = document.getElementById("loginPassword");
  var icon = document.getElementById("togglePasswordIcon");
  if (toggleBtn && passwordInput && icon) {
    // Elimina listeners previos para evitar duplicados
    toggleBtn.replaceWith(toggleBtn.cloneNode(true));
    toggleBtn = document.getElementById("togglePassword");
    toggleBtn.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
      }
    });
  }
}

// Ejecutar al cargar y tras cargar el header dinámico
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupPasswordToggle);
} else {
  setupPasswordToggle();
}
document.addEventListener("headerLoaded", setupPasswordToggle);
