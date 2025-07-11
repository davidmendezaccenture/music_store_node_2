// Configuración dinámica por página
// Ejemplo en cada HTML antes de cargar este JS:
// <script>window.PRODUCT_CATEGORY = 'drums'; window.PRODUCT_CONTAINER_ID = 'drum-products';</script>
const CATEGORY = window.PRODUCT_CATEGORY || "guitar";
const CONTAINER_ID = window.PRODUCT_CONTAINER_ID || "guitar-products";



// Cargar productos dinámicamente según categoría
fetch("../assets/data/products.json")
  .then((res) => res.json())
  .then((data) => {
    // Filtrar productos por categoría
    const productos = data.filter(
      (p) =>
        p.category &&
        (Array.isArray(CATEGORY)
          ? CATEGORY.some((cat) => p.category.includes(cat))
          : p.category.includes(CATEGORY))
    );
    const contenedor = document.getElementById(CONTAINER_ID);
    if (!contenedor) {
      console.warn(
        `Contenedor de productos con id '${CONTAINER_ID}' no encontrado en el DOM. No se renderizan productos.`
      );
      return;
    }
    productos.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${producto.image}" class="card-img-top" alt="${
        producto.name
      }">
          <div class="card-body">
          <h5 class="card-title">${producto.name}</h5>
            <p class="card-text">${producto.description || ""}</p>
            <p>
              <span class="text-muted text-decoration-line-through">${
                producto.price
              }€</span>
              <span class="fw-bold text-danger">${producto.offerPrice}€</span>
            </p>
            <div class="d-flex gap-2 justify-content-between">
              <button
                class="btn btn-outline-secondary btn-detail flex-fill"
                type="button"
                aria-label="Ver detalle de ${producto.name}"
                data-id="${producto.id}"
              >
                <i class="bi bi-eye me-2"></i>Ver detalle
              </button>
              <button
                class="btn btn-primary btn-add-cart flex-fill"
                data-producto='${JSON.stringify({
                  id: producto.id,
                  nombre: producto.name,
                  precio: producto.offerPrice,
                  image: producto.image,
                  description: producto.description,
                })}'
                aria-label="Añadir ${producto.name} al carrito"
              >
                <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });

    // Añadir funcionalidad a los botones
    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
      btn.addEventListener("click", function () {
        const producto = JSON.parse(this.getAttribute("data-producto"));
        // Usar la clave correcta según usuario
        const key = getCarritoKey();
        let carrito = localStorage.getItem(key);
        carrito = carrito ? JSON.parse(carrito) : [];
        // Buscar si ya existe el producto
        const idx = carrito.findIndex((p) => p.id === producto.id);
        if (idx !== -1) {
          carrito[idx].cantidad += 1;
        } else {
          producto.cantidad = 1;
          carrito.push(producto);
        }
        localStorage.setItem(key, JSON.stringify(carrito));
        if (typeof actualizarContadorCarrito === "function") {
          actualizarContadorCarrito();
        }
        // Feedback visual
        this.innerHTML = "¡Añadido!";
        this.disabled = true;
        setTimeout(() => {
          this.innerHTML = '<i class="bi bi-cart-plus me-2"></i>Añadir al carrito';
          this.disabled = false;
        }, 1000);
      });
    });
    // Añadir funcionalidad al botón Ver detalle
    document.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        window.location.href = `product-detail.html?id=${id}`;
      });
    });
  });

// Utilidades para carrito por usuario (igual que en cart.js)
function getCurrentUsername() {
  return localStorage.getItem("username");
}
function getCarritoKey() {
  const username = getCurrentUsername();
  return username ? `carrito_${username}` : "carrito";
}
