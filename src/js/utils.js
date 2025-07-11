//Este archivo maneja la loguica de las validaciones, almacenamiento local y formateo de datos.

// Función para guardar la última página de catálogo/productos visitada
function guardarUltimaPaginaCatalogo() {
  // Páginas válidas para "seguir comprando" (solo catálogos y productos)
  const paginasValidas = ['index.html', 'buscador.html', 'guitar.html', 'drums.html', 'keyboard.html', 'product-detail.html'];
  
  // Obtener el nombre de la página actual
  const paginaActual = window.location.pathname.split('/').pop().split('?')[0];
  
  // Solo guardar si es una página válida de catálogo/productos
  if (paginasValidas.includes(paginaActual)) {
    localStorage.setItem("ultimaPaginaCatalogo", window.location.href);
    console.log('Última página de catálogo guardada:', paginaActual);
  }
}

// Guardar la página actual si es válida
guardarUltimaPaginaCatalogo();

// También guardar cuando se navega (para SPAs o navegación dinámica)
window.addEventListener('beforeunload', guardarUltimaPaginaCatalogo);