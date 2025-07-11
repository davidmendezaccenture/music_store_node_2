$(document).ready(function () {
  $(".servicio-desplegable").click(function () {
    const actualBody = $(this).next(".servicio-body");
    const actualIcon = $(this).find(".icono-rotar");
    const isExpanded = $(this).attr("aria-expanded") === "true";

    // Cierra todos los desplegables menos el actual
    $(".servicio-body").not(actualBody).slideUp(300);
    $(".servicio-desplegable").not(this).attr("aria-expanded", "false");
    $(".icono-rotar").not(actualIcon).removeClass("girado");

    if (isExpanded) {
      // Si ya está abierto, cerralo
      actualBody.slideUp(300);
      actualIcon.removeClass("girado");
      $(this).attr("aria-expanded", "false");
    } else {
      // Esperá a que se cierren los demás antes de abrir
      actualBody.delay(300).slideDown(300);
      actualIcon.addClass("girado");
      $(this).attr("aria-expanded", "true");
    }
  });
});
