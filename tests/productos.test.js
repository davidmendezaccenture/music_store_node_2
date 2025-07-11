/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: 1,
          name: 'Guitarra Test',
          price: 100,
          offerPrice: 80,
          image: 'img.png',
          description: 'desc',
          category: ['guitar'],
        },
      ]),
  })
);

const waitForElement = (selector, timeout = 2000) => {
  return new Promise((resolve, reject) => {
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      } else {
        elapsed += interval;
        if (elapsed >= timeout) {
          clearInterval(timer);
          reject(new Error(`Elemento ${selector} no encontrado en el DOM`));
        }
      }
    }, interval);
  });
};

describe('productos.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="guitar-products"></div>`;
    localStorage.clear();
    window.actualizarContadorCarrito = jest.fn();
    jest.resetModules(); // muy importante para recargar productos.js limpio
  });

  it('carga productos y los muestra en el DOM', async () => {
    await require('../src/js/productos.js');
    const card = await waitForElement('.card-title');
    expect(card.textContent).toBe('Guitarra Test');
  });

  it('añade producto al carrito al hacer click', async () => {
    await require('../src/js/productos.js');
    const btn = await waitForElement('.btn-add-cart');
    btn.click();
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    expect(carrito[0].nombre).toBe('Guitarra Test');
    expect(window.actualizarContadorCarrito).toHaveBeenCalled();
  });
});
