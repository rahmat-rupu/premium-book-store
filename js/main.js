document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. HELPER FUNCTIONS (অটো কনভার্টার)
  // ==========================================
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

  // প্রিমিয়াম টোস্ট নোটিফিকেশন (CSS ছাড়া সরাসরি কাজ করবে)
  function showToast(message) {
    let toast = document.createElement("div");
    toast.style.cssText =
      "position:fixed; bottom:30px; right:-400px; background:#1A1A1A; color:#fff; padding:16px 24px; border-radius:8px; border-left:4px solid #059669; z-index:9999; font-weight:500; font-family:inherit; display:flex; align-items:center; gap:12px; transition: right 0.5s ease; box-shadow:0 10px 30px rgba(0,0,0,0.2);";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#059669; font-size:20px;"></i> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => (toast.style.right = "30px"), 100);
    setTimeout(() => {
      toast.style.right = "-400px";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  // ==========================================
  // 2. GLOBAL CART LOGIC (Add to Cart)
  // ==========================================
  let cart = JSON.parse(localStorage.getItem("boimoi_cart")) || [];

  // কার্টের ব্যাজ আপডেট
  function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll(".cart-badge").forEach((badge) => {
      badge.innerText = toBengali(totalItems);
      // পপ-আপ এনিমেশন
      badge.style.transform = "scale(1.3)";
      setTimeout(() => (badge.style.transform = "scale(1)"), 200);
    });
  }
  updateCartBadge(); // পেজ লোড হলেই রান হবে

  // Bulletproof Add to Cart Click Handler
  document.body.addEventListener("click", function (e) {
    // বাটনের ক্লাস চেক (add-to-cart, add-cart বা add-to-card লিখলেও কাজ করবে)
    const addBtn =
      e.target.closest(".add-to-cart-btn") ||
      e.target.closest(".add-cart-btn") ||
      e.target.closest(".add-to-card-btn");

    if (addBtn) {
      e.preventDefault();
      const card =
        addBtn.closest(".book-card") ||
        addBtn.closest(".product-info-panel") ||
        addBtn.closest(".product-details-container");

      if (!card) return;

      const titleEl =
        card.querySelector(".book-title") ||
        card.querySelector(".product-title") ||
        card.querySelector("h3");
      const title = titleEl ? titleEl.innerText.trim() : "Unknown Book";

      const priceEl = card.querySelector(".current-price");
      const priceText = priceEl ? priceEl.innerText.trim() : "0";

      const imgEl =
        card.querySelector(".book-cover") ||
        card.querySelector(".main-img") ||
        document.getElementById("main-product-img");
      const img = imgEl ? imgEl.src : "https://via.placeholder.com/150";

      const qtyInput = card.querySelector(".qty-input");
      const qty = qtyInput ? parseInt(qtyInput.value) : 1;

      const id = title.replace(/\s+/g, "-").toLowerCase();

      // কার্টে ডাটা পুশ করা
      const existingItem = cart.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.push({ id, title, priceText, img, quantity: qty });
      }

      localStorage.setItem("boimoi_cart", JSON.stringify(cart));
      updateCartBadge();

      // কার্ট পেজে থাকলে সাথে সাথে রেন্ডার হবে
      if (typeof renderCartItems === "function") {
        renderCartItems();
      }

      showToast(`<b style="color:#D4AF37">${title}</b> কার্টে যুক্ত হয়েছে!`);
    }
  });

  // ==========================================
  // 3. DYNAMIC CART PAGE LOGIC (New Feature!)
  // ==========================================
  const cartLayout = document.querySelector(".cart-layout");

  if (cartLayout && !document.querySelector(".checkout-layout")) {
    const cartItemsContainer = document.querySelector(".cart-items-container");
    const summarySubtotal = document.querySelectorAll(
      ".summary-row span:nth-child(2)",
    )[0];
    const summaryTotal = document.querySelector(".total-row .text-gold");
    const shippingCost = 60;
    let discount = 0;

    // ডাইনামিক কার্ট রেন্ডার ফাংশন
    window.renderCartItems = function () {
      if (!cartItemsContainer) return;
      cartItemsContainer.innerHTML = "";
      let subtotal = 0;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML =
          '<div style="text-align:center; padding:40px; color:#6B7280; background:#fff; border-radius:12px; border:1px solid #E5E7EB;">আপনার কার্ট সম্পূর্ণ ফাঁকা!<br><br><a href="index.html" class="btn btn-primary">বই কেনা শুরু করুন</a></div>';
      } else {
        cart.forEach((item, index) => {
          const price = parsePrice(item.priceText);
          subtotal += price * item.quantity;

          const html = `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.img}" alt="Book" class="cart-item-img">
                        <div class="cart-item-details">
                            <h3 class="cart-item-title"><a href="#">${item.title}</a></h3>
                            <p class="cart-item-category">বইমই প্রিমিয়াম</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-selector cart-qty" style="height:44px;">
                                <button class="qty-btn minus-btn"><i class="fa-solid fa-minus"></i></button>
                                <input type="number" value="${item.quantity}" class="qty-input" readonly>
                                <button class="qty-btn plus-btn"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="cart-item-price">${item.priceText}</div>
                            <button class="remove-item-btn" title="Remove"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>`;
          cartItemsContainer.insertAdjacentHTML("beforeend", html);
        });
      }

      // হিসাব আপডেট
      if (summarySubtotal)
        summarySubtotal.innerText = `৳${toBengali(subtotal)}`;
      let total = cart.length > 0 ? subtotal + shippingCost - discount : 0;
      if (summaryTotal) summaryTotal.innerText = `৳${toBengali(total)}`;
    };

    renderCartItems();

    // কার্ট পেজের প্লাস, মাইনাস ও ডিলিট বাটন লজিক
    cartItemsContainer.addEventListener("click", (e) => {
      const itemEl = e.target.closest(".cart-item");
      if (!itemEl) return;
      const index = itemEl.getAttribute("data-index");

      if (e.target.closest(".plus-btn")) {
        cart[index].quantity += 1;
        localStorage.setItem("boimoi_cart", JSON.stringify(cart));
        renderCartItems();
        updateCartBadge();
      } else if (e.target.closest(".minus-btn")) {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          localStorage.setItem("boimoi_cart", JSON.stringify(cart));
          renderCartItems();
          updateCartBadge();
        }
      } else if (e.target.closest(".remove-item-btn")) {
        itemEl.style.opacity = "0";
        itemEl.style.transform = "translateX(-20px)";
        setTimeout(() => {
          cart.splice(index, 1);
          localStorage.setItem("boimoi_cart", JSON.stringify(cart));
          renderCartItems();
          updateCartBadge();
        }, 300);
      }
    });

    // প্রোমো কোড লজিক
    const promoBtn = document.querySelector(".promo-btn");
    const promoInput = document.querySelector(".promo-input");
    if (promoBtn && promoInput) {
      promoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (promoInput.value.trim().toUpperCase() === "BOIMOI20") {
          discount = 200;
          promoBtn.innerText = "Applied";
          promoBtn.style.background = "#059669";
          promoBtn.style.borderColor = "#059669";
          promoBtn.style.pointerEvents = "none";
          renderCartItems();
        }
      });
    }
  }

  // ==========================================
  // 4. PRODUCT DETAILS PAGE (PDP) LOGIC
  // ==========================================
  const mainImage = document.getElementById("main-product-img");
  const thumbnails = document.querySelectorAll(".thumbnail");

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        thumbnails.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
        mainImage.style.opacity = "0.4";
        setTimeout(() => {
          mainImage.src = this.querySelector("img").src;
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
        document
          .getElementById(btn.getAttribute("data-tab"))
          .classList.add("active");
      });
    });
  }

  // ==========================================
  // 5. CHECKOUT PAGE LOGIC
  // ==========================================
  const checkoutContainer = document.querySelector(
    ".checkout-progress-container",
  );
  if (checkoutContainer) {
    const steps = document.querySelectorAll(".checkout-step-content");
    const progressSteps = document.querySelectorAll(".progress-step");
    const progressLines = document.querySelectorAll(".progress-line");

    // MFS Show/Hide
    const mfsOptions = document.getElementById("mfs-options");
    document.querySelectorAll('input[name="payment_type"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        if (mfsOptions)
          mfsOptions.style.display =
            e.target.value === "online" ? "block" : "none";
      });
    });

    // Checkout Amount Logic
    let baseSubtotal = cart.reduce(
      (sum, item) => sum + parsePrice(item.priceText) * item.quantity,
      0,
    );
    if (baseSubtotal === 0) baseSubtotal = 1449; // Testing fallback

    const displayShipping = document.getElementById("display-shipping-cost");
    const displayTotal = document.getElementById("display-total-cost");

    document
      .querySelectorAll('input[name="delivery_area"]')
      .forEach((radio) => {
        radio.addEventListener("change", (e) => {
          const shippingCost = parseInt(e.target.value);
          if (displayShipping) displayShipping.innerText = `৳${shippingCost}`;
          if (displayTotal)
            displayTotal.innerText = `৳${baseSubtotal + shippingCost}`;

          const typeEl = document.getElementById("sum-delivery-type");
          const priceEl = document.getElementById("sum-delivery-price");
          if (typeEl)
            typeEl.innerText =
              e.target.nextElementSibling.querySelector("h4").innerText;
          if (priceEl) priceEl.innerText = `৳${shippingCost}`;
        });
      });

    // Step Navigation
    window.goToStep = function (stepNumber) {
      steps.forEach((step) => step.classList.remove("active"));
      const targetStep = document.getElementById(`step-${stepNumber}`);
      if (targetStep) targetStep.classList.add("active");

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
        const fName = document.getElementById("f-name")
          ? document.getElementById("f-name").value
          : "Guest";
        const phone = document.getElementById("phone")
          ? document.getElementById("phone").value
          : "";
        const address = document.getElementById("address")
          ? document.getElementById("address").value
          : "";
        const city = document.getElementById("city")
          ? document.getElementById("city").value
          : "";

        const sumName = document.getElementById("sum-name-phone");
        const sumAddr = document.getElementById("sum-full-address");
        if (sumName)
          sumName.innerText = `${fName} ${phone ? "• " + phone : ""}`;
        if (sumAddr) sumAddr.innerText = `${address}${city ? ", " + city : ""}`;

        document
          .querySelectorAll(".sum-name-phone-small")
          .forEach((el) => (el.innerText = fName));
        document
          .querySelectorAll(".sum-city-small")
          .forEach((el) => (el.innerText = city));
      }
    };

    const btnNext1 = document.getElementById("btn-next-1");
    const btnNext2 = document.getElementById("btn-next-2");
    const btnNext3 = document.getElementById("btn-next-3");
    const btnBack1 = document.getElementById("btn-back-1");
    const btnBack2 = document.getElementById("btn-back-2");
    const verificationForm = document.getElementById("verification-form");

    if (btnNext1) btnNext1.addEventListener("click", () => goToStep(2));
    if (btnNext2) btnNext2.addEventListener("click", () => goToStep(3));
    if (btnBack1) btnBack1.addEventListener("click", () => goToStep(1));
    if (btnBack2) btnBack2.addEventListener("click", () => goToStep(2));

    if (btnNext3) {
      btnNext3.addEventListener("click", () => {
        goToStep(4);
        const pType = document.querySelector(
          'input[name="payment_type"]:checked',
        );
        const dArea = document.querySelector(
          'input[name="delivery_area"]:checked',
        );

        const paymentType = pType ? pType.value : "cod";
        const shippingCost = dArea ? parseInt(dArea.value) : 70;
        const targetAmount = document.getElementById("dynamic-payment-amount");

        if (targetAmount) {
          if (paymentType === "cod") {
            targetAmount.innerText = `৳${shippingCost} via bKash`;
          } else {
            targetAmount.innerText = `৳${baseSubtotal + shippingCost} via bKash`;
          }
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
        if (successMsg) {
          successMsg.style.display = "block";
          successMsg.style.animation = "fadeIn 0.5s ease";
          successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

          // সফল অর্ডারের পর কার্ট ক্লিয়ার করে দেওয়া
          localStorage.removeItem("boimoi_cart");
          cart = [];
          updateCartBadge();
        }
      });
    }
  }
});

// ==========================================
// 7. Dynamic Cart Page Logic
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.querySelector(".cart-items-container");

  // Ei page e cart container na thakle (orthat onno page e thakle) code ekhanei theme jabe
  if (!cartItemsContainer) return;

  const summarySubtotal = document.querySelectorAll(
    ".summary-row span:nth-child(2)",
  )[0];
  const summaryTotal = document.querySelector(".total-row .text-gold");
  const cartCountBadge = document.querySelector(".cart-count-badge");

  // LocalStorage theke data niye asha
  let cart = JSON.parse(localStorage.getItem("boimoi_cart")) || [];
  const shippingCost = 60;
  let discount = 0;

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

  // HTML e cart render korar function
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<div style="text-align:center; padding:60px 20px; background:#fff; border-radius:16px; border:1px solid #E5E7EB;"><h3>আপনার কার্ট সম্পূর্ণ ফাঁকা!</h3><br><a href="index.html" class="btn btn-primary">বই কেনা শুরু করুন</a></div>';
    } else {
      cart.forEach((item, index) => {
        const price = parsePrice(item.priceText);
        subtotal += price * item.quantity;
        totalItems += item.quantity;

        const html = `
                    <div class="cart-item" data-index="${index}">
                        <img src="${item.img}" alt="Book" class="cart-item-img">
                        
                        <div class="cart-item-details">
                            <div class="cart-item-category">বইমই প্রিমিয়াম</div>
                            <h3 class="cart-item-title"><a href="#">${item.title}</a></h3>
                        </div>

                        <div class="cart-item-actions">
                            <div class="quantity-selector cart-qty">
                                <button class="qty-btn minus-btn"><i class="fa-solid fa-minus"></i></button>
                                <input type="number" value="${item.quantity}" class="qty-input" readonly>
                                <button class="qty-btn plus-btn"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="cart-item-price">${item.priceText}</div>
                            <button class="remove-item-btn" title="Remove Item"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>`;
        cartItemsContainer.insertAdjacentHTML("beforeend", html);
      });
    }

    // Calculation update
    if (summarySubtotal) summarySubtotal.innerText = `৳${toBengali(subtotal)}`;
    let total = cart.length > 0 ? subtotal + shippingCost - discount : 0;
    if (summaryTotal) summaryTotal.innerText = `৳${toBengali(total)}`;
    if (cartCountBadge)
      cartCountBadge.innerText = `${toBengali(totalItems)} Items`;
  }

  renderCart();

  // Button Click Logic
  cartItemsContainer.addEventListener("click", function (e) {
    const itemEl = e.target.closest(".cart-item");
    if (!itemEl) return;
    const index = itemEl.getAttribute("data-index");

    if (e.target.closest(".plus-btn")) {
      cart[index].quantity += 1;
      localStorage.setItem("boimoi_cart", JSON.stringify(cart));
      renderCart();
    } else if (e.target.closest(".minus-btn")) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem("boimoi_cart", JSON.stringify(cart));
        renderCart();
      }
    } else if (e.target.closest(".remove-item-btn")) {
      itemEl.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      itemEl.style.opacity = "0";
      itemEl.style.transform = "translateX(-20px)";
      setTimeout(() => {
        cart.splice(index, 1);
        localStorage.setItem("boimoi_cart", JSON.stringify(cart));
        renderCart();
      }, 300);
    }
  });
});

// ==========================================
// 8. Wishlist / Favorite Logic (Final with Rendering)
// ==========================================

function updateWishlistBadge() {
  let currentWishlist =
    JSON.parse(localStorage.getItem("boimoi_wishlist")) || [];
  let total = currentWishlist.length;
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
  let benNum = total.toString().replace(/[0-9]/g, (m) => engToBen[m]);

  document.querySelectorAll(".wishlist-badge").forEach((badge) => {
    if (total > 0) {
      badge.style.display = "flex";
      badge.innerText = benNum;
      badge.style.transform = "scale(1.3)";
      setTimeout(() => (badge.style.transform = "scale(1)"), 200);
    } else {
      badge.style.display = "none"; // Faka thakle badge hide thakbe
    }
  });
}
updateWishlistBadge();

// Wishlist Page Render Korar Logic
const wishlistContainer = document.querySelector(".wishlist-items-container");

window.renderWishlist = function () {
  if (!wishlistContainer) return;
  wishlistContainer.innerHTML = "";
  let currentWishlist =
    JSON.parse(localStorage.getItem("boimoi_wishlist")) || [];

  if (currentWishlist.length === 0) {
    wishlistContainer.style.display = "block";
    wishlistContainer.innerHTML =
      '<div style="text-align:center; padding:60px 20px; background:#fff; border-radius:16px; border:1px solid #E5E7EB;"><h3>আপনার ফেভারিট লিস্ট সম্পূর্ণ ফাঁকা!</h3><br><a href="index.html" class="btn btn-primary">বই দেখা শুরু করুন</a></div>';
  } else {
    wishlistContainer.style.display = "grid";
    currentWishlist.forEach((item, index) => {
      const html = `
                <div class="book-card" style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; position: relative;">
                    
                    <button class="remove-wishlist-btn" data-index="${index}" title="Remove" style="position: absolute; top: -10px; right: -10px; background: #fff; color: var(--primary-red); border: 1px solid var(--border-color); width: 34px; height: 34px; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 10;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    
                    <img src="${item.img}" class="book-cover" alt="${item.title}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
                    
                    <h3 class="book-title" style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-dark);">${item.title}</h3>
                    <div class="current-price" style="font-weight: 700; color: var(--primary-red); font-size: 18px; margin-bottom: 16px;">${item.priceText}</div>
                    
                    <button class="btn btn-outline-primary add-to-cart-btn" style="width: 100%; justify-content: center; border-radius: 8px;">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>`;
      wishlistContainer.insertAdjacentHTML("beforeend", html);
    });
  }
};
renderWishlist();

// Wishlist theke boi Delete kora
if (wishlistContainer) {
  wishlistContainer.addEventListener("click", function (e) {
    const removeBtn = e.target.closest(".remove-wishlist-btn");
    if (removeBtn) {
      const index = removeBtn.getAttribute("data-index");
      let currentWishlist =
        JSON.parse(localStorage.getItem("boimoi_wishlist")) || [];
      currentWishlist.splice(index, 1);
      localStorage.setItem("boimoi_wishlist", JSON.stringify(currentWishlist));
      renderWishlist();
      updateWishlistBadge();
      showToast("বইটি ফেভারিট থেকে রিমুভ হয়েছে!");
    }
  });
}

// Home Page e Add to Wishlist Button Click Event
document.body.addEventListener("click", function (e) {
  const loveBtn =
    e.target.closest('.icon-btn[title="Add to Wishlist"]') ||
    e.target.closest(".wishlist-btn");

  if (loveBtn) {
    e.preventDefault();
    const card = loveBtn.closest(".book-card");
    if (!card) return;

    const titleEl = card.querySelector(".book-title");
    const title = titleEl ? titleEl.innerText.trim() : "Unknown Book";

    const priceEl = card.querySelector(".current-price");
    const priceText = priceEl ? priceEl.innerText.trim() : "0";

    const imgEl =
      card.querySelector(".book-cover") || card.querySelector("img");
    const img = imgEl ? imgEl.src : "https://via.placeholder.com/150";

    const id = title.replace(/\s+/g, "-").toLowerCase();
    const icon = loveBtn.querySelector("i");

    let currentWishlist =
      JSON.parse(localStorage.getItem("boimoi_wishlist")) || [];
    const existingIndex = currentWishlist.findIndex((item) => item.id === id);

    if (existingIndex > -1) {
      currentWishlist.splice(existingIndex, 1);
      if (icon) {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        icon.style.color = "";
      }
      showToast(`<b>${title}</b> ফেভারিট থেকে রিমুভ হয়েছে!`);
    } else {
      // Ebar title er sathe image abong price o save hocche
      currentWishlist.push({ id, title, priceText, img });
      if (icon) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        icon.style.color = "#8B1538";
      }
      showToast(
        `<b>${title}</b> ফেভারিটে যুক্ত হয়েছে! <i class="fa-solid fa-heart" style="color:#8B1538"></i>`,
      );
    }

    localStorage.setItem("boimoi_wishlist", JSON.stringify(currentWishlist));
    updateWishlistBadge();
  }
});
