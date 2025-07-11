function formatCurrency(amount) {
        return `${amount.toFixed(2)} €`;
      }
      
      function carritoInit() {
        // Botón "Seguir comprando"
        const btnSeguir = document.getElementById('seguir-comprando');
        if (btnSeguir) {
          btnSeguir.addEventListener('click', function () {
            // Obtener la última página de catálogo/productos visitada
            const ultimaPaginaCatalogo = localStorage.getItem('ultimaPaginaCatalogo');
            
            // Páginas válidas para "seguir comprando" (solo catálogos y productos)
            const paginasValidas = ['index.html', 'buscador.html', 'guitar.html', 'drums.html', 'keyboard.html', 'product-detail.html'];
            
            // Verificar si la última página es válida
            let paginaDestino = 'buscador.html'; // Por defecto ir a buscador
            
            if (ultimaPaginaCatalogo) {
              // Extraer solo el nombre del archivo de la URL completa
              const nombrePagina = ultimaPaginaCatalogo.split('/').pop().split('?')[0];
              
              if (paginasValidas.includes(nombrePagina)) {
                // Si es una página válida, usar solo el nombre del archivo
                paginaDestino = nombrePagina;
              }
            }
            
            console.log('Redirigiendo a:', paginaDestino);
            window.location.href = paginaDestino;
          });
        }
        // Botón "Pagar"
        const btnPagar = document.getElementById('btn-pagar');
        if (btnPagar) {
          btnPagar.addEventListener('click', function () {
            // Usar window.requireLogin para asegurar contexto correcto
            if (typeof window.requireLogin === 'function') {
              if (window.requireLogin()) {
                window.location.href = 'checkout.html';
              }
            } else {
              window.location.href = 'checkout.html';
            }
          });
        }
      }
      document.addEventListener('DOMContentLoaded', () => {
        carritoInit();
        updateCartTotal();
      });
      
      function updateCartTotal() {
  const totalElement = document.getElementById('total-price');
  if (totalElement) {
    const total = actualizarTotal(); // Calcula el total del carrito
    totalElement.textContent = `Total: ${total.toFixed(2).replace('.', ',')} €`; // Símbolo de euro con coma decimal
  }
}
      
      function actualizarTotal() {
  const carrito = obtenerCarrito(); // Obtiene los productos del carrito
  let total = 0;
  carrito.forEach(producto => {
    total += (producto.precioOferta || producto.precio || 0) * (producto.cantidad || 1);
  });
  return total;
}
      
      function mostrarPrecioTotalPorProducto() {
  const carrito = obtenerCarrito();
  carrito.forEach(producto => {
    const productoElement = document.getElementById(`producto-${producto.id}`);
    if (productoElement) {
      const precioTotal = (producto.precioOferta || producto.precio || 0) * (producto.cantidad || 1);
      const precioTotalElement = productoElement.querySelector('.precio-total');
      if (precioTotalElement) {
        precioTotalElement.textContent = `Total: ${precioTotal.toFixed(2).replace('.', ',')} €`;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  carritoInit();
  updateCartTotal();
  mostrarPrecioTotalPorProducto();
});
      
      function renderizarProductosCarrito() {
  carrito.forEach((producto, index) => {
    const subtotal = (producto.precioOferta || producto.precio) * producto.cantidad;
    html += `
      <div class="cart-product-row">
        <img src="${producto.image}" class="cart-product-img cart-product-img-large" alt="${producto.nombre}" />
        <div class="cart-product-info">
          <h3 class="cart-product-title">${producto.nombre}</h3>
          <p class="cart-product-price">€${producto.precio}</p>
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
          <p class="cart-product-total">Total: €${subtotal.toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  carritoContainer.innerHTML = html;
  actualizarTotal();
}
      
      // Para test
      if (typeof module !== 'undefined') {
        module.exports = { carritoInit };
      }