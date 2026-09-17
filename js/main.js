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

// ==========================================
// Product Details Page (PDP) Logic
// ==========================================

// 1. Image Gallery Logic
const mainImage = document.getElementById("main-product-img");
const thumbnails = document.querySelectorAll(".thumbnail");

if (mainImage && thumbnails.length > 0) {
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      // Remove active class from all thumbnails
      thumbnails.forEach((t) => t.classList.remove("active"));

      // Add active class to the clicked thumbnail
      this.classList.add("active");

      // Get the image source of the clicked thumbnail
      const newSrc = this.querySelector("img").src;

      // Apply a smooth fade effect
      mainImage.style.opacity = "0.4";

      setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = "1";
      }, 150); // Matches the CSS transition time for a premium feel
    });
  });
}

// 2. Quantity Selector Logic
const minusBtn = document.querySelector(".minus-btn");
const plusBtn = document.querySelector(".plus-btn");
const qtyInput = document.querySelector(".qty-input");

if (minusBtn && plusBtn && qtyInput) {
  // Decrease quantity
  minusBtn.addEventListener("click", () => {
    let currentValue = parseInt(qtyInput.value);
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1;
    }
  });

  // Increase quantity
  plusBtn.addEventListener("click", () => {
    let currentValue = parseInt(qtyInput.value);
    qtyInput.value = currentValue + 1;
  });

  // Prevent invalid manual inputs (e.g., negative numbers or typing text)
  qtyInput.addEventListener("change", () => {
    if (qtyInput.value < 1 || isNaN(qtyInput.value)) {
      qtyInput.value = 1;
    }
  });
}

// 3. Product Tabs Logic
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

if (tabBtns.length > 0 && tabPanes.length > 0) {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons and panes
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanes.forEach((p) => p.classList.remove("active"));

      // Add active class to clicked button
      btn.classList.add("active");

      // Show corresponding tab content
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });
}
