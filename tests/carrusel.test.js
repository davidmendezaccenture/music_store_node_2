/**
 * @jest-environment jsdom
 */
describe('carrusel.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="product-item"></div>
      <div class="product-item"></div>
      <button class="carousel-control prev"></button>
      <button class="carousel-control next"></button>
      <div class="testimonials-carousel-inner">
        <div class="testimonial-card"></div>
        <div class="testimonial-card"></div>
      </div>
      <div class="testimonial-dots"></div>
    `;
    jest.useFakeTimers();
    require('../src/js/carrusel.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('activa el siguiente producto al hacer click en next', () => {
    const items = document.querySelectorAll('.product-item');
    const nextBtn = document.querySelector('.carousel-control.next');
    items[0].classList.add('active');
    nextBtn.click();
    expect(items[0].classList.contains('active')).toBe(false);
    expect(items[1].classList.contains('active')).toBe(true);
  });

  it('activa el testimonio siguiente tras intervalo', () => {
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials[0].classList.add('testimonial-active');
    jest.advanceTimersByTime(10000);
    expect(testimonials[0].classList.contains('testimonial-active')).toBe(false);
    expect(testimonials[1].classList.contains('testimonial-active')).toBe(true);
  });
});
