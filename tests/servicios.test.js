/**
 * @jest-environment jsdom
 */
const $ = require("jquery");

describe('Desplegable de servicios (servicios.html)', () => {
  // ...
});

describe('Desplegable de servicios (servicios.html)', () => {
  test('al hacer clic se despliega el cuerpo y se gira el icono', () => {
    // Configura el DOM simulado
    document.body.innerHTML = `
      <div class="servicio-desplegable">
        <span class="icono-rotar"></span>
      </div>
      <div class="servicio-body" style="display: none;"></div>
    `;

    // Simula el script jQuery
    $(".servicio-desplegable").click(function () {
      const body = $(this).next(".servicio-body");
      const icon = $(this).find(".icono-rotar");

      body.toggle(); // Simula slideToggle
      icon.toggleClass("girado");
    });

    // click
    $(".servicio-desplegable").trigger("click");

    //comprobaciones
    expect($(".servicio-body").css("display")).toBe("block");
    expect($(".icono-rotar").hasClass("girado")).toBe(true);
  });
});

describe('Carga de barra lateral (service.html)', () => {
  beforeEach(() => {
    // limpiar el DOM  para iniciar cada prueba
    document.body.innerHTML = '<div id="sidebar-placeholder"></div>';

  });

  test('fetch carga el contenido del sidebar y lo inserta en el DOM', async () => {
    // Simulacion del contenido del archivo HTML
    const fakeHTML = '<div id="offcanvasServicios">Barra cargada</div>';


    // Mock de fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(fakeHTML),
      })
    );

    // Codigo a probar
    const placeholder = document.getElementById("sidebar-placeholder");
    if (placeholder) {
      const res = await fetch("../components/service.html");
      const html = await res.text();
      placeholder.innerHTML = html;
    }

    // Comprobacion
    expect(document.getElementById("offcanvasServicios")).not.toBeNull();
    expect(document.getElementById("offcanvasServicios").textContent).toBe("Barra cargada");
  });
});