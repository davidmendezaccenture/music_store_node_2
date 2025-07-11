$(document).ready(function () {
  // Mostrar panel lateral al hacer clic en 'Ver más'
  $(".team-card .btn-ver-mas").on("click", function (e) {
    e.preventDefault();
    var $card = $(this).closest(".team-card");

    // Ocultar todos los paneles de información activos
    $(".team-card-info-panel.active").removeClass("active");

    // Mostrar el panel de la tarjeta actual
    $card.find(".team-card-info-panel").addClass("active");
  });

  // Ocultar panel lateral al hacer clic en cerrar
  $(".team-card .btn-cerrar-info").on("click", function (e) {
    e.preventDefault();
    var $card = $(this).closest(".team-card");
    $card.find(".team-card-info-panel").removeClass("active");
  });

  // Solicitar la clave de la API de Google Maps al servidor
  fetch("/api/google-maps-key")
    .then((response) => response.json())
    .then((data) => {
      const apiKey = data.apiKey;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.setAttribute("loading", "lazy");
      document.body.appendChild(script);
    })
    .catch((error) => {
      console.error(
        "Error al obtener la clave de la API de Google Maps:",
        error
      );
    });

  // Inicializa el mapa centrado en Madrid
  window.initMap = function () {
    var madrid = { lat: 40.4168, lng: -3.7038 };
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: madrid,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new google.maps.Marker({
      position: madrid,
      map: map,
      title: "RiffZone Music Store (Ubicación ficticia)",
    });
  };
});
