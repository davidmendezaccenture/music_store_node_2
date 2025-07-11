// checkout.test.js
// Pruebas básicas para la simulación de pago y validación de formulario en checkout.js

describe('Checkout', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="checkoutForm">
        <input id="checkoutName" name="name" required />
        <input id="checkoutEmail" name="email" required type="email" />
        <input id="checkoutAddress" name="address" required />
        <input id="checkoutCity" name="city" required />
        <input id="checkoutPostal" name="postal" required pattern="[0-9]{4,10}" />
        <select id="checkoutPayment" name="payment" required>
          <option value="">Selecciona</option>
          <option value="visa">Visa</option>
        </select>
        <input id="checkoutCard" name="card" />
        <button type="submit">Pagar</button>
      </form>
      <div id="confirmationMessage"></div>
      <div class="checkout-summary"></div>
    `;
    window.location.pathname = '/src/pages/checkout.html';
    localStorage.clear();
  });

  it('debe mostrar mensaje de error si el formulario está incompleto', () => {
    require('../js/checkout.js');
    const form = document.getElementById('checkoutForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(form.classList.contains('was-validated')).toBe(true);
    expect(document.getElementById('confirmationMessage').style.display).not.toBe('block');
  });

  it('debe mostrar mensaje de confirmación si el formulario es válido', () => {
    require('../js/checkout.js');
    document.getElementById('checkoutName').value = 'Test User';
    document.getElementById('checkoutEmail').value = 'test@email.com';
    document.getElementById('checkoutAddress').value = 'Calle 123';
    document.getElementById('checkoutCity').value = 'Ciudad';
    document.getElementById('checkoutPostal').value = '12345';
    document.getElementById('checkoutPayment').value = 'visa';
    document.getElementById('checkoutCard').value = '4111111111111111';
    const form = document.getElementById('checkoutForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(document.getElementById('confirmationMessage').style.display).toBe('block');
  });
});
