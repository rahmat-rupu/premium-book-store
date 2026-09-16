// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // Select all slider sections dynamically (works for multiple sliders later)
  const sliders = document.querySelectorAll(".category-slider-section");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".book-slider-container");
    const prevBtn = slider.querySelector(".prev-btn");
    const nextBtn = slider.querySelector(".next-btn");

    // Scroll Amount (width of one card + gap)
    const scrollAmount = 308; // 280px card + 28px gap

    // Next Button Click
    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Previous Button Click
    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  });
});
