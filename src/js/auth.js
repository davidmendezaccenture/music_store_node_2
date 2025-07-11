// Configuración de endpoint para login/logout
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://music-store-node-2-484977869651.europe-southwest1.run.app";

// Extrae la lógica de actualización de UI de sesión a una función global
function initAuth() {
  const userData = localStorage.getItem("user");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userWelcome = document.getElementById("userWelcome");
  const userName = document.getElementById("userName");

  if (userData) {
    const user = JSON.parse(userData);
    if (userName) userName.textContent = user.username || user.email;
    if (userWelcome) userWelcome.style.display = "inline";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userWelcome) userWelcome.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      // Llamada al backend para desloguear a todos
      fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
      })
        .then(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("username");
          // Limpiar carrito del usuario logueado
          const keys = Object.keys(localStorage);
          keys.forEach((key) => {
            if (key.startsWith("carrito_")) {
              localStorage.removeItem(key);
            }
          });
          window.location.reload();
        })
        .catch(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("username");
          // Limpiar carrito del usuario logueado
          const keys = Object.keys(localStorage);
          keys.forEach((key) => {
            if (key.startsWith("carrito_")) {
              localStorage.removeItem(key);
            }
          });
          window.location.reload();
        });
    };
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   initAuth();
// });
