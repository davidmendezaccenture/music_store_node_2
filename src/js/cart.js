// cart.js
// Función de comprobación de login
function requireLogin() {
  // Considera logueado si existe 'user' o 'username' en localStorage
  if (!localStorage.getItem("user") && !localStorage.getItem("username")) {
    // Mostrar modal de login si existe en la página
    const modalEl = document.getElementById("loginModal");
    if (modalEl && typeof bootstrap !== "undefined") {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    } else {
      alert("¿Tienes cuenta? Inicia sesión para continuar.");
    }
    return false;
  }
  return true;
}

// Obtener el usuario actual
function getCurrentUsername() {
  return localStorage.getItem("username");
}

// Obtener la clave de carrito según usuario
function getCarritoKey() {
  const username = getCurrentUsername();
  return username ? `carrito_${username}` : "carrito";
}

// Obtener carrito desde localStorage (por usuario)
function obtenerCarrito() {
  const key = getCarritoKey();
  const carrito = localStorage.getItem(key);
  return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito en localStorage (por usuario)
function guardarCarrito(carrito) {
  const key = getCarritoKey();
  localStorage.setItem(key, JSON.stringify(carrito));
}

// Mostrar productos en el carrito
function mostrarProductosCarrito() {
  // Si estamos en checkout.html, no renderizar aquí
  if (window.location.pathname.includes('checkout.html')) return;
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById("cart-items");
  const totalPrecioEl = document.getElementById("total-price");
  if (!contenedor || !totalPrecioEl) return; // Evita errores si no existen los elementos
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  let totalGeneral = 0;

  carrito.forEach((producto, index) => {
    const total = producto.precio * producto.cantidad;
    totalGeneral += total;

    const productoHTML = `
      <div class="checkout-product-row">
        <div class="checkout-product-img-block">
          <img src="${
            producto.image
              ? producto.image
              : "../assets/images/iconos/iconBateria.png"
          }" class="checkout-product-img" alt="${producto.nombre}" onerror="this.src='../assets/images/iconos/iconBateria.png'">
        </div>
        <div class="checkout-product-info-col">
          <div class="checkout-product-info-left">
            <div class="checkout-product-title">${producto.nombre}</div>
            <div class="checkout-product-precio">${producto.precio.toFixed(2).replace('.', ',')} €</div>
          </div>
          <div class="checkout-product-info-right">
            <div class="checkout-product-controls">
              <button class="btn-restar-producto btn-cart-action" aria-label="Eliminar uno" title="Eliminar uno" onclick="eliminarProducto(${index})">
                <span>Eliminar</span>
                <i class="bi bi-dash"></i>
              </button>
              <div class="checkout-product-cantidad cart-cantidad">
                <span class="cart-cantidad-num">${producto.cantidad}</span>
              </div>
              <button class="btn-sumar-producto btn-cart-action" aria-label="Añadir uno" title="Añadir uno" onclick="aumentarCantidad(${index})">
                <span>Añadir</span>
                <i class="bi bi-plus"></i>
              </button>
            </div>
            <div class="checkout-product-total">Total: ${(producto.precio * producto.cantidad).toFixed(2).replace('.', ',')} €</div>
          </div>
        </div>
      </div>
    `;
    contenedor.innerHTML += productoHTML;
  });

  totalPrecioEl.textContent = `Total: ${totalGeneral.toFixed(2).replace('.', ',')} €`;
}

// Actualizar el contador
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  let totalCantidad = 0;
  carrito.forEach((producto) => {
    totalCantidad += producto.cantidad;
  });

  const contador = document.getElementById("cart-count");
  if (contador) {
    contador.textContent = totalCantidad;
  }
}

// Aumentar cantidad
function aumentarCantidad(index) {
  if (!requireLogin()) return;
  const carrito = obtenerCarrito();
  carrito[index].cantidad += 1;
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarProductosCarrito();
}

// Eliminar producto (ahora resta de uno en uno)
function eliminarProducto(index) {
  if (!requireLogin()) return;
  const carrito = obtenerCarrito();
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarProductosCarrito();
}


function renderizarProductosCarrito() {
  const carritoContainer = document.getElementById('cart-items');
  if (!carritoContainer) return;

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    carritoContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    actualizarTotal();
    return;
  }

  let html = '';
  carrito.forEach((producto, index) => {
    const subtotal = (producto.precio * producto.cantidad).toFixed(2).replace('.', ',');
    html += `
      <div class="cart-product-row">
        <img src="${producto.image}" class="cart-product-img cart-product-img-large" alt="${producto.nombre}" />
        <div class="cart-product-info">
          <h3 class="cart-product-title">${producto.nombre}</h3>
          <p class="cart-product-price">${producto.precio.toFixed(2).replace('.', ',')} €</p>
          <div class="cart-product-controls">
            <button class="btn-restar-producto btn-cart-action" onclick="disminuirCantidad(${index})" aria-label="Eliminar uno">
              <span class="btn-text">Eliminar</span>
              <span class="btn-symbol">-</span>
            </button>
            <span class="cart-cantidad">${producto.cantidad}</span>
            <button class="btn-sumar-producto btn-cart-action" onclick="aumentarCantidad(${index})" aria-label="Añadir uno">
              <span class="btn-text">Añadir</span>
              <span class="btn-symbol">+</span>
            </button>
          </div>
          <p class="cart-product-total">Total: ${subtotal} €</p>
        </div>
      </div>
    `;
  });

  carritoContainer.innerHTML = html;
  actualizarTotal();
}

function actualizarTotal() {
  const carrito = obtenerCarrito();
  let total = 0;
  carrito.forEach(producto => {
    total += producto.precio * producto.cantidad;
  });
  
  const totalElement = document.getElementById('total-price');
  if (totalElement) {
    totalElement.textContent = `Total: ${total.toFixed(2).replace('.', ',')} €`;
  }
  return total;
}

// Añadir producto al carrito (accesible globalmente)
function agregarAlCarrito(producto) {
  // Permitir agregar al carrito sin login en buscador.html
  if (window.location.pathname.includes("buscador.html")) {
    // No requerir login
  } else {
    if (!requireLogin()) return;
  }
  // Normalizar propiedades
  const prod = {
    nombre: producto.name || producto.nombre || "Producto",
    precio: producto.offerPrice && producto.offerPrice < producto.price ? producto.offerPrice : (producto.price || producto.precio || 0),
    cantidad: 1,
    image: producto.image || producto.imagen || "",
    id: producto.id || null
  };
  const carrito = obtenerCarrito();
  // Buscar si ya existe (por id o nombre)
  let idx = carrito.findIndex(p => (p.id && prod.id && p.id === prod.id) || p.nombre === prod.nombre);
  if (idx !== -1) {
    carrito[idx].cantidad += 1;
  } else {
    carrito.push(prod);
  }
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  // Feedback accesible
  if (window.location.pathname.includes("buscador.html") || window.location.pathname.includes("catalog") || window.location.pathname.includes("guitar") || window.location.pathname.includes("drums") || window.location.pathname.includes("keyboard")) {
    if (typeof bootstrap !== "undefined") {
      // Mostrar toast si existe
      const toastEl = document.getElementById("cart-toast");
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    }
  }
}
window.agregarAlCarrito = agregarAlCarrito;

// Iniciar todo al cargar
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  // Solo ejecutar mostrarProductosCarrito si existe el contenedor
  if (
    document.getElementById("cart-items") &&
    document.getElementById("total-price")
  ) {
    mostrarProductosCarrito();
  }
});
