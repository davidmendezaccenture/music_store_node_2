// header-search.js
// Lógica de búsqueda y filtrado para el nuevo buscador del header

let products = [];
let filteredProducts = [];
let hasSearched = false;

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function initCatalogSearch() {
  // Verificar que los elementos existen
  let searchInput = document.getElementById("search-input");
  let searchButton = document.getElementById("search-button");
  let catalogForm = document.getElementById("catalog-search-form");
  
  fetch("../assets/data/products.json")
    .then(res => res.json())
    .then(data => {
      products = data.filter(p => p.name);
      
      // Si estamos en buscador.html, sincronizar con la URL y aplicar filtros
      const isBuscador = window.location.pathname.includes("buscador.html");
      if (isBuscador) {
        // Dar tiempo para que el DOM se cargue completamente
        setTimeout(() => {
          syncFiltersFromURL();
          hasSearched = true; // Marcar que se ha realizado una búsqueda
          
          // Si hay parámetros en la URL, también mostrar productos sin filtros
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.toString() === "") {
            // No hay parámetros, mostrar todos los productos
            hasSearched = true;
          }
          
          // Aplicar filtros nuevamente después de sincronizar
          applyFilters();
        }, 100);
      }
      
      applyFilters();
    });

  // Mostrar filtros al enfocar el input de búsqueda
  searchInput = document.getElementById("search-input");
  const filters = document.getElementById("advanced-filters");
  
  if (searchInput && filters) {
    searchInput.addEventListener("focus", () => {
      filters.classList.remove("visually-hidden");
    });
    filters.addEventListener("focusout", () => {
      setTimeout(() => {
        if (!filters.contains(document.activeElement) && document.activeElement !== searchInput) {
          filters.classList.add("visually-hidden");
        }
      }, 100);
    });
    searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (!filters.contains(document.activeElement)) {
          filters.classList.add("visually-hidden");
        }
      }, 100);
    });
  }

  // --- SOLUCIÓN REFORZADA: Evitar que el menú hamburguesa y sus desplegables se cierren por el buscador/filtros ---
  // Si existe el menú móvil, nunca lo cierres por focus/blur del buscador/filtros
  // Si tienes lógica en headerMenu.js que cierra el menú móvil, asegúrate de que solo se cierre al hacer clic fuera del propio menú móvil (no por focus/blur en buscador/filtros)
  // Aquí reforzamos que el buscador/filtros no afectan al menú móvil ni a sus submenús:
  const mobileNav = document.getElementById("mobileNav");
  if (mobileNav) {
    // Evita que cualquier focus/blur en el buscador/filtros cierre el menú móvil
    const stopPropagation = e => e.stopPropagation();
    if (searchInput) {
      searchInput.addEventListener("focus", stopPropagation, true);
      searchInput.addEventListener("blur", stopPropagation, true);
      searchInput.addEventListener("mousedown", stopPropagation, true);
      searchInput.addEventListener("touchstart", stopPropagation, true);
    }
    if (filters) {
      filters.addEventListener("focusin", stopPropagation, true);
      filters.addEventListener("focusout", stopPropagation, true);
      filters.addEventListener("mousedown", stopPropagation, true);
      filters.addEventListener("touchstart", stopPropagation, true);
    }
    // Si tienes submenús dentro de mobileNav, aplica lo mismo a sus inputs/selects si es necesario
  }

  // Listeners para filtros y búsqueda
  catalogForm = document.getElementById("catalog-search-form");
  
  if (catalogForm) {
    catalogForm.addEventListener("input", function() {
      hasSearched = true;
      applyFilters();
    });

    // Función para manejar la redirección y filtros
  function handleSearch() {
    const isBuscador = window.location.pathname.includes("buscador.html");
    const searchValue = document.getElementById("search-input")?.value.trim() || "";
    const category = document.getElementById("category-filter")?.value || "";
    const offer = document.getElementById("offer-filter")?.value || "";
    const minPrice = document.getElementById("min-price")?.value || "";
    const maxPrice = document.getElementById("max-price")?.value || "";
    const brand = document.getElementById("brand-filter")?.value || "";
    const sort = document.getElementById("sort-filter")?.value || "";

    if (!isBuscador) {
      const params = new URLSearchParams();
      if (searchValue) params.set("search", searchValue);
      if (category) params.set("category", category);
      if (offer) params.set("offer", offer);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (brand) params.set("brand", brand);
      if (sort) params.set("sort", sort);
      
      // Determinar la ruta correcta dependiendo de dónde estemos
      const currentPath = window.location.pathname;
      let targetPath = "";
      
      if (currentPath.includes("/pages/")) {
        targetPath = "buscador.html";
      } else {
        targetPath = "pages/buscador.html";
      }
      
      const fullUrl = `${targetPath}?${params.toString()}`;
      window.location.href = fullUrl;
      return;
    }

    // Si estamos en buscador.html, aplicar filtros normalmente
    hasSearched = true;
    applyFilters();
  }

    // Event listener para el formulario de búsqueda
    catalogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSearch();
      // Actualizar la URL para compartir el filtro (solo si estamos en buscador.html)
      const isBuscador = window.location.pathname.includes("buscador.html");
      if (isBuscador) {
        const searchValue = document.getElementById("search-input")?.value.trim() || "";
        const category = document.getElementById("category-filter")?.value || "";
        const offer = document.getElementById("offer-filter")?.value || "";
        const minPrice = document.getElementById("min-price")?.value || "";
        const maxPrice = document.getElementById("max-price")?.value || "";
        const brand = document.getElementById("brand-filter")?.value || "";
        const sort = document.getElementById("sort-filter")?.value || "";
        
        const url = new URL(window.location);
        if (searchValue) {
          url.searchParams.set('search', searchValue);
        } else {
          url.searchParams.delete('search');
        }
        if (category) {
          url.searchParams.set('category', category);
        } else {
          url.searchParams.delete('category');
        }
        if (offer) {
          url.searchParams.set('offer', offer);
        } else {
          url.searchParams.delete('offer');
        }
        if (minPrice) {
          url.searchParams.set('minPrice', minPrice);
        } else {
          url.searchParams.delete('minPrice');
        }
        if (maxPrice) {
          url.searchParams.set('maxPrice', maxPrice);
        } else {
          url.searchParams.delete('maxPrice');
        }
        if (brand) {
          url.searchParams.set('brand', brand);
        } else {
          url.searchParams.delete('brand');
        }
        if (sort) {
          url.searchParams.set('sort', sort);
        } else {
          url.searchParams.delete('sort');
        }
        window.history.replaceState({}, '', url);
      }
    });
  }

  // Event listener específico para el botón de búsqueda (lupa)
  searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleSearch();
    });
  }

  // Event listener para Enter en el input de búsqueda
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    });
  }

  // Event listener para el botón "Aplicar filtros"
  const applyFiltersBtn = document.getElementById("apply-filters-btn");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Aplicar filtros
      hasSearched = true;
      applyFilters();
      
      // Cerrar el offcanvas de filtros después de aplicar
      const filtersOffcanvas = document.getElementById("filtersOffcanvas");
      if (filtersOffcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(filtersOffcanvas);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
      
      // Feedback visual temporal
      const originalText = applyFiltersBtn.innerHTML;
      applyFiltersBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>¡Filtros aplicados!';
      applyFiltersBtn.disabled = true;
      
      setTimeout(() => {
        applyFiltersBtn.innerHTML = originalText;
        applyFiltersBtn.disabled = false;
      }, 1500);
    });
  }
}

function applyFilters() {
  const search = document.getElementById("search-input")?.value.trim().toLowerCase() || "";
  const category = document.getElementById("category-filter")?.value || "";
  const offer = document.getElementById("offer-filter")?.value || "";
  const minPrice = parseFloat(document.getElementById("min-price")?.value || 0) || 0;
  const maxPrice = parseFloat(document.getElementById("max-price")?.value || Infinity) || Infinity;
  const brand = document.getElementById("brand-filter")?.value || "";
  const sort = document.getElementById("sort-filter")?.value || "";

  filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search) || (p.category && p.category.toLowerCase().includes(search));
    const matchesCategory = !category || (p.category && p.category === category);
    const matchesBrand = !brand || (p.brand && p.brand === brand);
    const matchesOffer = offer !== "on-offer" || (p.offerPrice && p.offerPrice < p.price);
    
    // Calcular el precio efectivo final (con descuento aplicado)
    let finalPrice = p.price;
    if (p.offerPrice && p.offerPrice > 0 && p.offerPrice < p.price) {
      finalPrice = p.offerPrice;
    }
    
    // Usar el precio efectivo para el filtrado
    const matchesPrice = finalPrice >= minPrice && finalPrice <= maxPrice;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesOffer && matchesPrice;
  });

  switch (sort) {
    case "price-asc":
      filteredProducts.sort((a, b) => {
        const priceA = (a.offerPrice && a.offerPrice > 0 && a.offerPrice < a.price) ? a.offerPrice : a.price;
        const priceB = (b.offerPrice && b.offerPrice > 0 && b.offerPrice < b.price) ? b.offerPrice : b.price;
        return priceA - priceB;
      });
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => {
        const priceA = (a.offerPrice && a.offerPrice > 0 && a.offerPrice < a.price) ? a.offerPrice : a.price;
        const priceB = (b.offerPrice && b.offerPrice > 0 && b.offerPrice < b.price) ? b.offerPrice : b.price;
        return priceB - priceA;
      });
      break;
    case "popularity":
      filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    case "newest":
      filteredProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
    // "relevance" o default: no ordenar extra
  }

  renderProducts(filteredProducts);
}

function renderProducts(products) {
  const container = document.getElementById("catalog-products");
  
  if (!container) return;
  container.innerHTML = "";
  container.classList.remove("centered-products");
  if (!hasSearched) return;
  if (products.length === 0) {
    container.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }
  const isBuscador = window.location.pathname.includes("buscador.html");
  if (isBuscador && (products.length === 1 || products.length === 2)) {
    container.classList.add("centered-products");
  }
  
  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 guitar-card product-card" tabindex="0" role="button" aria-label="Ver detalles de ${product.name}">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body guitar-card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.category || ""} <span class="text-muted">${product.brand ? ' - ' + product.brand : ''}</span></p>
          <p class="card-text">
            ${product.offerPrice && product.offerPrice < product.price
              ? `<span class='badge bg-success'>Oferta</span> <span class='price-regular text-decoration-line-through'>$${product.price}</span> <span class='price-offer fw-bold text-danger'>$${product.offerPrice}</span>`
              : `<span class='price-offer fw-bold'>$${product.price}</span>`}
          </p>
          <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-outline-secondary btn-detail flex-fill" type="button" aria-label="Ver detalle de ${product.name}">
              <i class="bi bi-eye me-2"></i>Ver detalle
            </button>
            <button class="btn btn-primary btn-add-cart flex-fill" data-product='${JSON.stringify(product)}' aria-label="Añadir ${product.name} a la cesta">
              <i class="bi bi-cart-plus me-2"></i>Añadir a la cesta
            </button>
          </div>
        </div>
      </div>
    `;
    col.querySelector('.btn-detail').addEventListener('click', (e) => {
      e.stopPropagation();
      goToProductDetail(product);
    });
    col.querySelector('.product-card').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToProductDetail(product);
      }
    });
    container.appendChild(col);
  });

  container.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const prod = JSON.parse(btn.getAttribute("data-product"));
      if (typeof window.agregarAlCarrito === "function") {
        window.agregarAlCarrito(prod);
        // Feedback visual igual que en productos.js
        btn.innerHTML = "¡Añadido!";
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = '<i class="bi bi-cart-plus me-2"></i>Añadir a la cesta';
          btn.disabled = false;
        }, 1000);
      }
    });
  });
}

function goToProductDetail(product) {
  window.location.href = `product-detail.html?id=${product.id}`;
}

function syncFiltersFromURL() {
  const searchInputSync = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const offerFilter = document.getElementById("offer-filter");
  const minPriceFilter = document.getElementById("min-price");
  const maxPriceFilter = document.getElementById("max-price");
  const brandFilter = document.getElementById("brand-filter");
  const sortFilter = document.getElementById("sort-filter");

  // Obtener parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  
  // Sincronizar cada filtro con la URL
  if (searchInputSync && urlParams.get("search")) {
    searchInputSync.value = urlParams.get("search");
  }
  if (categoryFilter && urlParams.get("category")) {
    categoryFilter.value = urlParams.get("category");
  }
  if (offerFilter && urlParams.get("offer")) {
    offerFilter.value = urlParams.get("offer");
  }
  if (minPriceFilter && urlParams.get("minPrice")) {
    minPriceFilter.value = urlParams.get("minPrice");
  }
  if (maxPriceFilter && urlParams.get("maxPrice")) {
    maxPriceFilter.value = urlParams.get("maxPrice");
  }
  if (brandFilter && urlParams.get("brand")) {
    brandFilter.value = urlParams.get("brand");
  }
  if (sortFilter && urlParams.get("sort")) {
    sortFilter.value = urlParams.get("sort");
  }
}

// La función initCatalogSearch se llama desde loadComponents.js después de cargar el header
