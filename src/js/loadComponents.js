document.addEventListener("DOMContentLoaded", () => {
  // Cargar utils.js si no está disponible
  if (typeof guardarUltimaPaginaCatalogo !== "function") {
    var utilsScript = document.createElement("script");
    utilsScript.src = "../js/utils.js";
    document.head.appendChild(utilsScript);
  }
  
  // Header
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch("../components/header.html")
      .then((res) => res.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;

        if (typeof initAuth === "function") initAuth();
        if (typeof actualizarContadorCarrito === "function")
          actualizarContadorCarrito();

        if (typeof initHeaderMenu === "function") {
          initHeaderMenu();
        } else {
          const script = document.createElement("script");
          script.src = "../js/headerMenu.js";
          script.onload = () => {
            if (typeof initHeaderMenu === "function") initHeaderMenu();
          };
          document.body.appendChild(script);
        }

        // Disparar evento personalizado para que otros scripts puedan engancharse tras cargar header
      // Disparar evento personalizado para que otros scripts puedan engancharse tras cargar header
document.dispatchEvent(new Event("headerLoaded"));

// --- INICIO: Cargar e inicializar header-search.js ---
if (typeof initCatalogSearch === "function") {
  initCatalogSearch();
} else {
  // Si aún no está cargado, carga el script y luego inicializa
  var searchScript = document.createElement("script");
  searchScript.src = "../js/header-search.js";
  searchScript.onload = function () {
    console.log("header-search.js loaded");
    if (typeof initCatalogSearch === "function") initCatalogSearch();
  };
  document.body.appendChild(searchScript);
}
// --- FIN ---

      
      });
  }

  // Products-nav
  const productsNavPlaceholder = document.getElementById("products-nav-placeholder");
  if (productsNavPlaceholder) {
    fetch("../components/products-nav.html")
      .then((res) => res.text())
      .then((html) => {
        productsNavPlaceholder.innerHTML = html;
      });
  }

  // Sidebar de service
  const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
  if (sidebarPlaceholder) {
    fetch("../components/service.html")
      .then((res) => res.text())
      .then((html) => {
        sidebarPlaceholder.innerHTML = html;
        setTimeout(() => {
          const sidebarElement = document.getElementById("offcanvasServicios");
          if (sidebarElement) {
            const offcanvas = new bootstrap.Offcanvas(sidebarElement);
            offcanvas.show();
          }
        }, 100);
      });
  }

  // Footer
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch("../components/footer.html")
      .then((res) => res.text())
      .then((html) => {
        footerPlaceholder.innerHTML = html;
      });
  }

  // Modal de Login
  const loginPlaceholder = document.getElementById("login-modal-placeholder");
  if (loginPlaceholder) {
    fetch("../components/login.html")
      .then((res) => res.text())
      .then((html) => {
        loginPlaceholder.innerHTML = html;

        setTimeout(() => {
          if (typeof initializeLogin === "function") initializeLogin();
          if (typeof setupPasswordToggle === "function") setupPasswordToggle();
        }, 100);
      });
  }
});
