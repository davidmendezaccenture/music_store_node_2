/**
 * @jest-environment jsdom
 */

// Solución al error de TextEncoder/TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const vm = require('vm');

describe('Carrito', () => {
  let dom;
  let document;
  let window;
  let originalLocation;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../src/pages/carrito.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost/", // Necesario para usar localStorage
    });

    document = dom.window.document;
    window = dom.window;

    // Simula que la última página es productos.html
    window.localStorage.setItem('ultimaPagina', 'productos.html');

    // Mocks ANTES de cargar el script
    dom.window.requireLogin = jest.fn(() => true);
    dom.window.alert = jest.fn();
    dom.window.navegarA = jest.fn();

    // Ejecuta el script de carrito.js en el contexto de jsdom
    const scriptContent = fs.readFileSync(path.resolve(__dirname, '../src/js/carrito.js'), 'utf8');
    vm.runInContext(scriptContent, dom.getInternalVMContext());

    // Ejecuta la función de inicialización manualmente en el contexto de jsdom
    const { carritoInit } = require('../src/js/carrito.js');
    dom.window.carritoInit = carritoInit;
    dom.window.carritoInit();

    document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
  });

  afterEach(() => {
    // Restaurar location original
    if (originalLocation) {
      window.location = originalLocation;
    }
  });

  test('redirige a última página al hacer clic en "Seguir comprando"', () => {
    const btn = dom.window.document.getElementById('seguir-comprando');
    btn.click();
    expect(dom.window.navegarA).toHaveBeenCalledWith('productos.html');
  });

  test('muestra alerta al hacer clic en "Pagar" si se requiere login', () => {
    const btn = dom.window.document.getElementById('btn-pagar');
    btn.click();
    expect(dom.window.requireLogin).toHaveBeenCalled();
    expect(dom.window.alert).toHaveBeenCalledWith('¡Gracias por tu compra! (Simulación de pago)');
  });
});