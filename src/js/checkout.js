// checkout.js
// Lógica para mostrar productos del carrito, validar formulario y simular pago

document.addEventListener("DOMContentLoaded", function () {
  // --- Utilidades para carrito (idéntico a cart.js/productos.js) ---
  function getCurrentUsername() {
    return localStorage.getItem("username");
  }
  function getCarritoKey() {
    const username = getCurrentUsername();
    return username ? `carrito_${username}` : "carrito";
  }
  function obtenerCarrito() {
    const key = getCarritoKey();
    const carrito = localStorage.getItem(key);
    try {
      return carrito ? JSON.parse(carrito) : [];
    } catch {
      return [];
    }
  }
  function guardarCarrito(carrito) {
    const key = getCarritoKey();
    localStorage.setItem(key, JSON.stringify(carrito));
  }

  // --- Renderizar productos del carrito ---
  const productsContainer = document.getElementById("checkoutProducts");
  const totalContainer = document.getElementById("checkoutTotal");
  let carrito = obtenerCarrito();

  function renderCarrito() {
    productsContainer.innerHTML = "";
    let total = 0;
    if (!carrito.length) {
      productsContainer.innerHTML = '<div class="text-center text-muted">Tu carrito está vacío.</div>';
      totalContainer.textContent = '';
      return;
    }
    carrito.forEach((prod, idx) => {
      const precio = prod.precioOferta || prod.precio || prod.price || 0;
      total += precio * (prod.cantidad || 1);
      const row = document.createElement("div");
      row.className = "checkout-product-row";
      row.innerHTML = `
        <img src="${prod.imagen || prod.image || '../assets/images/guitar7.png'}" alt="${prod.nombre || prod.name}" class="checkout-product-img" />
        <div class="checkout-product-info">
          <div style="font-weight:600;">${prod.nombre || prod.name}</div>
          <div class="text-muted small">${prod.descripcion || prod.description || ''}</div>
          <div class="text-secondary">Cantidad: ${prod.cantidad || 1}</div>
          <div class="text-primary">${precio.toLocaleString('es-ES', {style:'currency', currency:'EUR'})}</div>
        </div>
        <button class="remove-product-btn" aria-label="Eliminar producto" title="Eliminar" data-idx="${idx}"><i class="bi bi-trash"></i></button>
      `;
      productsContainer.appendChild(row);
    });
    const totalElement = document.getElementById('checkoutTotal');
    if (totalElement) {
      totalElement.textContent = `Total: ${total.toFixed(2)} €`; // Símbolo de euro separado por un espacio
    }
  }

  // Eliminar producto
  productsContainer.addEventListener("click", function (e) {
    if (e.target.closest('.remove-product-btn')) {
      const idx = e.target.closest('.remove-product-btn').dataset.idx;
      carrito.splice(idx, 1);
      guardarCarrito(carrito);
      renderCarrito();
    }
  });

  renderCarrito();

  // --- Validación y simulación de pago ---
  const form = document.getElementById("checkoutForm");
  const confirmation = document.getElementById("confirmationMessage");
  const cancelBtn = document.getElementById("cancelCheckout");

  // Validación Bootstrap + personalizada
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    let valid = true;
    // Validación extra para tarjeta si método no es PayPal
    const payment = form.checkoutPayment.value;
    const card = form.checkoutCard.value.trim();
    if (["visa","mastercard","amex"].includes(payment)) {
      if (!/^\d{13,19}$/.test(card.replace(/\s/g, ''))) {
        form.checkoutCard.classList.add("is-invalid");
        valid = false;
      } else {
        form.checkoutCard.classList.remove("is-invalid");
      }
    } else {
      form.checkoutCard.classList.remove("is-invalid");
    }
    if (!form.checkValidity()) {
      valid = false;
    }
    form.classList.add("was-validated");
    if (!valid) return;
    // Simular pago
    confirmation.style.display = "block";
    form.style.display = "none";
    document.querySelector(".checkout-summary").style.display = "none";
    // Vaciar carrito tras "pago"
    guardarCarrito([]);
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3500);
  });

  // Cancelar: volver al carrito
  cancelBtn.addEventListener("click", function () {
    window.location.href = "carrito.html";
  });

  // Accesibilidad: focus inicial
  setTimeout(() => {
    form.querySelector("input,select,textarea").focus();
  }, 300);
});
