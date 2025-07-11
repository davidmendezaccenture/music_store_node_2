document.addEventListener("DOMContentLoaded", function () {
  const sidebarElement = document.getElementById("offcanvasServicios");
  if (sidebarElement) {
    const offcanvas = new bootstrap.Offcanvas(sidebarElement);
    offcanvas.show();

    // Accesibilidad .....foco al abrir el offcanvas
    sidebarElement.addEventListener("shown.bs.offcanvas", () => {
      const firstLink = sidebarElement.querySelector("a");
      if (firstLink) firstLink.focus();
    });

    // Accesibilidad......foco al cerrar vuelve al botón que lo activó
    sidebarElement.addEventListener("hidden.bs.offcanvas", () => {
      const triggerBtn = document.getElementById("hamburgerBtn");
      if (triggerBtn) triggerBtn.focus();
    });
  }
});
