document.addEventListener("DOMContentLoaded", function () {
  // CSRF Token helper function
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const modal = document.getElementById("itemModal");
  const modalContent = document.getElementById("modalContent");
  const closeModal = document.getElementById("closeModal");
  const itemCards = document.querySelectorAll(".item-card");

  // Modal elements
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalRestaurant = document.getElementById("modalRestaurant");
  const modalPrice = document.getElementById("modalPrice");
  const modalRating = document.getElementById("modalRating");
  const modalDescription = document.getElementById("modalDescription");
  const modalDiscount = document.getElementById("modalDiscount");
  const quantityEl = document.getElementById("quantity");
  const totalPriceEl = document.getElementById("totalPrice");
  const decreaseQtyBtn = document.getElementById("decreaseQty");
  const increaseQtyBtn = document.getElementById("increaseQty");
  const modalAddToCartBtn = document.getElementById("modalAddToCart");
  const buyNowBtn = document.getElementById("buyNow");

  let currentItem = null;
  let quantity = 1;

  // Open modal function
  function openModal(itemData) {
    currentItem = itemData;
    quantity = 1;

    // Populate modal with item data
    modalImage.src = itemData.image;
    modalImage.alt = itemData.name;
    modalTitle.textContent = itemData.name;
    modalRestaurant.innerHTML = `From: <a href="${location.origin}/restaurant/${itemData.restaurantSlug}" class="font-medium text-red-500 hover:underline">${itemData.restaurant}</a>`;
    modalPrice.textContent = `৳${itemData.price}`;
    modalRating.querySelector("span:last-child").textContent = itemData.rating;
    modalDescription.textContent = itemData.description;

    // Handle discount
    if (itemData.discount && itemData.discount > 0) {
      modalDiscount.textContent = `${itemData.discount}% OFF`;
      modalDiscount.classList.remove("hidden");
    } else {
      modalDiscount.classList.add("hidden");
    }

    // Update quantity and total
    updateQuantityAndTotal();

    // Update the modal Add to Cart button href
    updateModalAddToCartHref();

    // Show modal with animation
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    setTimeout(() => {
      modalContent.classList.remove("scale-95", "opacity-0");
      modalContent.classList.add("scale-100", "opacity-100");
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  // Close modal function
  function closeModalFunc() {
    modalContent.classList.remove("scale-100", "opacity-100");
    modalContent.classList.add("scale-95", "opacity-0");

    setTimeout(() => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 300);
  }

  // Update quantity and total price
  function updateQuantityAndTotal() {
    quantityEl.textContent = quantity;
    const basePrice = parseFloat(currentItem.price);
    const discount = currentItem.discount || 0;
    const discountedPrice = basePrice * (1 - discount / 100);
    const total = discountedPrice * quantity;
    totalPriceEl.textContent = `৳${total.toFixed(2)}`;

    // Update the modal Add to Cart button href when quantity changes
    updateModalAddToCartHref();
  }

  // Update modal Add to Cart button href with current item ID and quantity
  function updateModalAddToCartHref() {
    if (currentItem && modalAddToCartBtn) {
      // Construct the URL with item ID and quantity using the correct URL pattern
      const addToCartUrl = `${location.origin}/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
      modalAddToCartBtn.href = addToCartUrl;
    }
  }

  // Event listeners for item cards
  itemCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't open modal if clicking on Add to Cart button
      if (
        e.target.classList.contains("add-to-cart-btn") ||
        e.target.closest(".add-to-cart-btn")
      ) {
        return;
      }

      const itemData = {
        id: this.dataset.itemId,
        name: this.dataset.itemName,
        price: this.dataset.itemPrice,
        rating: this.dataset.itemRating,
        restaurant: this.dataset.itemRestaurant,
        restaurantSlug: this.dataset.itemRestaurantSlug,
        image: this.dataset.itemImage,
        description: this.dataset.itemDescription,
        discount: parseFloat(this.dataset.itemDiscount) || 0,
      };

      openModal(itemData);
    });
  });

  // Close modal event listeners
  closeModal.addEventListener("click", closeModalFunc);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModalFunc();
    }
  });

  // Keyboard event for ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModalFunc();
    }
  });

  // Quantity controls
  decreaseQtyBtn.addEventListener("click", function () {
    if (quantity > 1) {
      quantity--;
      updateQuantityAndTotal();
    }
  });

  increaseQtyBtn.addEventListener("click", function () {
    if (quantity < 99) {
      // Max quantity limit
      quantity++;
      updateQuantityAndTotal();
    }
  });

  // Add to cart from modal
  modalAddToCartBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior

    if (!currentItem) {
      return;
    }

    // Use AJAX function from cart-ajax.js
    if (typeof addToCartAjax === "function") {
      addToCartAjax(currentItem.restaurantSlug, currentItem.id, quantity);

      // Close modal after adding to cart
      setTimeout(() => {
        closeModalFunc();
      }, 1000);
    } else {
      // Fallback to regular form submission
      const addToCartUrl = `${location.origin}/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
      window.location.href = addToCartUrl;
    }
  });

  // Buy now functionality
  buyNowBtn.addEventListener("click", function () {
    if (!currentItem) return;

    // Use AJAX to add to cart then redirect
    if (typeof addToCartAjax === "function") {
      // First add to cart via AJAX
      fetch(
        `/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken":
              document.querySelector("[name=csrfmiddlewaretoken]")?.value ||
              getCookie("csrftoken"),
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ ajax: true }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Redirect to cart after successful addition
            window.location.href = "/cart";
          }
        })
        .catch(() => {
          // Fallback to regular URL navigation
          window.location.href = `/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
        });
    } else {
      // Fallback to regular navigation
      window.location.href = `/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
    }
  });

  // Toast notification function (reuse from menu-filter.js or define here)
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    const bgColor =
      type === "success"
        ? "bg-green-500"
        : type === "info"
        ? "bg-blue-500"
        : "bg-red-500";

    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-[60] transition-all duration-300 transform translate-x-full`;
    toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      toast.style.opacity = "0";
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 3000);
  }
});
