document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. Product Details Page (PDP) Logic
  // ==========================================
  const mainImage = document.getElementById("main-product-img");
  const thumbnails = document.querySelectorAll(".thumbnail");

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        thumbnails.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
        const newSrc = this.querySelector("img").src;

        mainImage.style.opacity = "0.4";
        setTimeout(() => {
          mainImage.src = newSrc;
          mainImage.style.opacity = "1";
        }, 150);
      });
    });
  }

  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  if (tabBtns.length > 0 && tabPanes.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabPanes.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const targetId = btn.getAttribute("data-tab");
        document.getElementById(targetId).classList.add("active");
      });
    });
  }

  // ==========================================
  // 2. Shopping Cart Logic (With Bengali Digits)
  // ==========================================
  const cartLayout = document.querySelector(".cart-layout");

  if (cartLayout && !document.querySelector(".checkout-layout")) {
    function parsePrice(text) {
      const benToEng = {
        "০": 0,
        "১": 1,
        "২": 2,
        "৩": 3,
        "৪": 4,
        "৫": 5,
        "৬": 6,
        "৭": 7,
        "৮": 8,
        "৯": 9,
      };
      let converted = text.replace(/[০-৯]/g, (m) => benToEng[m]);
      return parseInt(converted.replace(/[^0-9]/g, "")) || 0;
    }
    function toBengali(num) {
      const engToBen = {
        0: "০",
        1: "১",
        2: "২",
        3: "৩",
        4: "৪",
        5: "৫",
        6: "৬",
        7: "৭",
        8: "৮",
        9: "৯",
      };
      return num.toString().replace(/[0-9]/g, (m) => engToBen[m]);
    }

    const summarySubtotal = document.querySelectorAll(
      ".summary-row span:nth-child(2)",
    )[0];
    const summaryTotal = document.querySelector(".total-row .text-gold");
    const cartCountBadge = document.querySelector(".cart-count-badge");
    const shippingCost = 60;
    let discount = 0;

    function updateCartTotals() {
      const cartItems = document.querySelectorAll(".cart-item");
      let subtotal = 0;
      let itemCount = 0;

      cartItems.forEach((item) => {
        const price = parsePrice(
          item.querySelector(".cart-item-price").innerText,
        );
        const qty = parseInt(item.querySelector(".qty-input").value) || 1;
        subtotal += price * qty;
        itemCount += qty;
      });

      if (summarySubtotal)
        summarySubtotal.innerText = `৳${toBengali(subtotal)}`;
      let total = subtotal + shippingCost - discount;
      if (cartItems.length === 0) total = 0;
      if (summaryTotal) summaryTotal.innerText = `৳${toBengali(total)}`;
      if (cartCountBadge)
        cartCountBadge.innerText = `${toBengali(itemCount)} Items`;
    }
    updateCartTotals();

    const qtySelectors = document.querySelectorAll(".cart-qty");
    qtySelectors.forEach((selector) => {
      const minusBtn = selector.querySelector(".minus-btn");
      const plusBtn = selector.querySelector(".plus-btn");
      const input = selector.querySelector(".qty-input");

      if (minusBtn)
        minusBtn.addEventListener("click", (e) => {
          e.preventDefault();
          let val = parseInt(input.value) || 1;
          if (val > 1) {
            input.value = val - 1;
            updateCartTotals();
          }
        });
      if (plusBtn)
        plusBtn.addEventListener("click", (e) => {
          e.preventDefault();
          let val = parseInt(input.value) || 1;
          input.value = val + 1;
          updateCartTotals();
        });
      if (input)
        input.addEventListener("change", () => {
          if (input.value < 1 || isNaN(input.value)) input.value = 1;
          updateCartTotals();
        });
    });

    const removeBtns = document.querySelectorAll(".remove-item-btn");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const item = this.closest(".cart-item");
        item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        item.style.opacity = "0";
        item.style.transform = "translateX(-20px)";
        setTimeout(() => {
          item.remove();
          updateCartTotals();
        }, 300);
      });
    });
  }

  // ==========================================
  // 3. Multi-Step Checkout Logic
  // ==========================================
  const checkoutContainer = document.querySelector(
    ".checkout-progress-container",
  );

  if (checkoutContainer) {
    const steps = document.querySelectorAll(".checkout-step-content");
    const progressSteps = document.querySelectorAll(".progress-step");
    const progressLines = document.querySelectorAll(".progress-line");

    const btnNext1 = document.getElementById("btn-next-1");
    const btnNext2 = document.getElementById("btn-next-2");
    const btnNext3 = document.getElementById("btn-next-3");
    const btnBack1 = document.getElementById("btn-back-1");
    const btnBack2 = document.getElementById("btn-back-2");
    const verificationForm = document.getElementById("verification-form");

    const paymentRadios = document.querySelectorAll(
      'input[name="payment_type"]',
    );
    const mfsOptions = document.getElementById("mfs-options");
    paymentRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        if (mfsOptions)
          mfsOptions.style.display =
            e.target.value === "online" ? "block" : "none";
      });
    });

    const deliveryRadios = document.querySelectorAll(
      'input[name="delivery_area"]',
    );
    const displayShipping = document.getElementById("display-shipping-cost");
    const displayTotal = document.getElementById("display-total-cost");
    const baseSubtotal = 1449;

    deliveryRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const shippingCost = parseInt(e.target.value);
        displayShipping.innerText = `৳${shippingCost}`;
        displayTotal.innerText = `৳${baseSubtotal + shippingCost}`;

        document.getElementById("sum-delivery-type").innerText =
          e.target.nextElementSibling.querySelector("h4").innerText;
        document.getElementById("sum-delivery-price").innerText =
          `৳${shippingCost}`;
      });
    });

    window.goToStep = function (stepNumber) {
      steps.forEach((step) => step.classList.remove("active"));
      document.getElementById(`step-${stepNumber}`).classList.add("active");

      progressSteps.forEach((pStep, index) => {
        if (index + 1 < stepNumber) {
          pStep.classList.add("completed");
          pStep.classList.remove("active");
        } else if (index + 1 === stepNumber) {
          pStep.classList.add("active");
          pStep.classList.remove("completed");
        } else {
          pStep.classList.remove("active", "completed");
        }
      });

      progressLines.forEach((line, index) => {
        line.style.backgroundColor =
          index + 1 < stepNumber ? "var(--text-dark)" : "var(--border-color)";
      });

      if (stepNumber > 1) {
        const fName = document.getElementById("f-name").value || "Guest";
        const phone = document.getElementById("phone").value || "";
        const address = document.getElementById("address").value || "";
        const city = document.getElementById("city").value || "";

        document.getElementById("sum-name-phone").innerText =
          `${fName} • ${phone}`;
        document.getElementById("sum-full-address").innerText =
          `${address}, ${city}`;

        document
          .querySelectorAll(".sum-name-phone-small")
          .forEach((el) => (el.innerText = fName));
        document
          .querySelectorAll(".sum-city-small")
          .forEach((el) => (el.innerText = city));
      }
    };

    if (btnNext1) btnNext1.addEventListener("click", () => goToStep(2));
    if (btnNext2) btnNext2.addEventListener("click", () => goToStep(3));
    if (btnBack1) btnBack1.addEventListener("click", () => goToStep(1));
    if (btnBack2) btnBack2.addEventListener("click", () => goToStep(2));

    if (btnNext3) {
      btnNext3.addEventListener("click", () => {
        goToStep(4);
        const paymentType = document.querySelector(
          'input[name="payment_type"]:checked',
        ).value;
        const shippingCost = parseInt(
          document.querySelector('input[name="delivery_area"]:checked').value,
        );
        const targetAmount = document.getElementById("dynamic-payment-amount");

        if (paymentType === "cod") {
          targetAmount.innerText = `৳${shippingCost} via bKash`;
        } else {
          targetAmount.innerText = `৳${baseSubtotal + shippingCost} via bKash`;
        }
      });
    }

    if (verificationForm) {
      verificationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        document.querySelector(".verify-payment-box").style.display = "none";
        document.querySelector(".mini-tracker").style.display = "none";
        document.querySelector(".selected-method-box").style.display = "none";

        const successMsg = document.getElementById("success-message");
        successMsg.style.display = "block";
        successMsg.style.animation = "fadeIn 0.5s ease";
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }
});
