// Banner de cookies para toda la web
(function () {
  if (localStorage.getItem("cookiesAccepted") === "true") return;

  var banner = document.createElement("div");
  banner.id = "cookies-banner";
  banner.innerHTML = `
    <div class="cookies-banner-content">
      <span>
        Utilizamos cookies para mejorar tu experiencia. Más información en nuestra
        <a href="politica-cookies.html" class="cookies-link">Política de Cookies</a>.
      </span>
      <button id="accept-cookies-btn" class="accept-cookies-btn">Aceptar</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById("accept-cookies-btn").onclick = function () {
    localStorage.setItem("cookiesAccepted", "true");
    banner.remove();
  };
})();
