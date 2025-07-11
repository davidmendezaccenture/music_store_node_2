document.addEventListener("DOMContentLoaded", () => {
  const reviewList = document.getElementById("review-list");
  const reviewForm = document.getElementById("review-form");
  const ratingIcons = document.querySelectorAll("#rating .star");
  let selectedRating = 0;
  if (!reviewList || !reviewForm) return;

  function renderReviews(reviews) {
    reviewList.innerHTML = "";
    reviews.forEach(({ name, comment, rating }) => {
      const div = document.createElement("div");
      div.className = "review";
      div.innerHTML = `
        <strong>${name}</strong>
        <div class="stars">${"🎸".repeat(rating)}</div>
        <p>${comment}</p>
      `;
      reviewList.appendChild(div);
    });
  }

  function loadReviews() {
    const productId = new URLSearchParams(location.search).get("id");
    fetch(`/api/products/${productId}/reviews`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar reseñas");
        return res.json();
      })
      .then(data => renderReviews(data))
      .catch(err => {
        reviewList.innerHTML = `<p>Error al cargar reseñas</p>`;
        console.error(err);
      });
  }

  // Inicializamos
  loadReviews();

  // Gestión de estrellas
  ratingIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      selectedRating = parseInt(icon.dataset.value, 10);
      ratingIcons.forEach(i =>
        i.style.color =
          parseInt(i.dataset.value, 10) <= selectedRating ? "goldenrod" : "gray"
      );
    });
  });

  // Envío de nueva reseña
  reviewForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();
    if (!name || !comment || selectedRating === 0) {
      alert("Por favor completa todos los campos y selecciona una valoración.");
      return;
    }
    const productId = new URLSearchParams(location.search).get("id");
    const newReview = { name, comment, rating: selectedRating, productId };
    fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar la reseña");
        return res.json();
      })
      .then(() => {
        reviewForm.reset();
        selectedRating = 0;
        ratingIcons.forEach(i => (i.style.color = "gray"));
        loadReviews();
      })
      .catch(err => {
        alert("No se pudo guardar la reseña");
        console.error(err);
      });
  });
});
