// Carrusel de productos
      document.addEventListener("DOMContentLoaded", function () {
        const items = document.querySelectorAll(".product-item");
        const prevBtn = document.querySelector(".carousel-control.prev");
        const nextBtn = document.querySelector(".carousel-control.next");
        let current = 0;
        let productInterval;

        function showItem(index) {
          items.forEach((item, i) => {
            item.classList.toggle("active", i === index);
          });
        }

        function nextProduct() {
          current = (current + 1) % items.length;
          showItem(current);
        }

        function prevProduct() {
          current = (current - 1 + items.length) % items.length;
          showItem(current);
        }

        prevBtn.addEventListener("click", () => {
          prevProduct();
          resetProductInterval();
        });

        nextBtn.addEventListener("click", () => {
          nextProduct();
          resetProductInterval();
        });

        function resetProductInterval() {
          clearInterval(productInterval);
          productInterval = setInterval(nextProduct, 4000); // 4 segundos
        }

        productInterval = setInterval(nextProduct, 4000); // 4 segundos
      });

      // Carrusel de testimonios
      document.addEventListener("DOMContentLoaded", function () {
        const testimonials = document.querySelectorAll(
          ".testimonials-carousel-inner .testimonial-card"
        );
        const dotsContainer = document.querySelector(".testimonial-dots");
        let currentTest = 0;
        let testimonialInterval;

        // Crear puntos dinámicamente
        testimonials.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
          dot.type = "button";
          dot.setAttribute("aria-label", `Ver testimonio ${i + 1}`);
          dot.addEventListener("click", () => {
            showTestimonial(i);
            resetTestimonialInterval();
            dot.blur(); // <-- Añade esta línea para quitar el foco tras pulsar
          });
          dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll(".testimonial-dot");

        function showTestimonial(index) {
          testimonials.forEach((item, i) => {
            item.classList.toggle("testimonial-active", i === index);
            dots[i].classList.toggle("active", i === index);
          });
          currentTest = index;
        }

        function nextTestimonial() {
          showTestimonial((currentTest + 1) % testimonials.length);
        }

        function resetTestimonialInterval() {
          clearInterval(testimonialInterval);
          testimonialInterval = setInterval(nextTestimonial, 10000);
        }

        testimonialInterval = setInterval(nextTestimonial, 10000);
      });

      // Quitar el foco de los controles de ambos carruseles tras hacer clic
      document.addEventListener("DOMContentLoaded", function () {
        // Carrusel de productos
        document.querySelectorAll(".carousel-control").forEach((btn) => {
          btn.addEventListener("mouseup", function () {
            this.blur();
          });
        });
        // Carrusel de testimonios
        document.querySelectorAll(".testimonial-control").forEach((btn) => {
          btn.addEventListener("mouseup", function () {
            this.blur();
          });
        });
      });