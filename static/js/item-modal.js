document.addEventListener("DOMContentLoaded", function () {
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
    modalRestaurant.textContent = `From: ${itemData.restaurant}`;
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
      const addToCartUrl = `${location.origin}/add-to-cart/${currentItem.id}/${quantity}/`;
      modalAddToCartBtn.href = addToCartUrl;
    }
  }

  // Event listeners for item cards
  itemCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't open modal if clicking on Add to Cart button
      if (e.target.classList.contains("add-to-cart-btn")) {
        return;
      }

      const itemData = {
        id: this.dataset.itemId,
        name: this.dataset.itemName,
        price: this.dataset.itemPrice,
        rating: this.dataset.itemRating,
        restaurant: this.dataset.itemRestaurant,
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
    if (!currentItem) {
      e.preventDefault();
      return;
    }

    // Don't prevent default - let the href handle the Django request
    // But still update localStorage for immediate feedback
    const basePrice = parseFloat(currentItem.price);
    const discount = currentItem.discount || 0;
    const discountedPrice = basePrice * (1 - discount / 100);

    const cartItem = {
      id: currentItem.id,
      name: currentItem.name,
      price: discountedPrice.toFixed(2),
      originalPrice: basePrice,
      discount: discount,
      image: currentItem.image,
      restaurant: currentItem.restaurant,
      quantity: quantity,
      timestamp: Date.now(),
    };

    // Add to cart in localStorage for immediate feedback
    let cart = JSON.parse(localStorage.getItem("tasteCartCart")) || [];

    // Check if item already exists
    const existingItemIndex = cart.findIndex((item) => item.id === cartItem.id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
      showToast(`Updated ${cartItem.name} quantity in cart!`, "success");
    } else {
      cart.push(cartItem);
      showToast(`${cartItem.name} added to cart!`, "success");
    }

    localStorage.setItem("tasteCartCart", JSON.stringify(cart));

    // Update cart count
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      cartCount.textContent = cart.length;
    }

    // The link will now navigate to the Django URL automatically
    // No need to prevent default or close modal manually
  });

  // Buy now functionality
  buyNowBtn.addEventListener("click", function () {
    if (!currentItem) return;

    // Navigate directly to add to cart URL which will add the item and redirect to cart
    const addToCartUrl = `/add-to-cart/${currentItem.id}/${quantity}/`;
    window.location.href = addToCartUrl;

    // Note: The Django view will redirect to cart page after adding the item
    // If you want to redirect to checkout instead, modify the Django view
    // or add checkout logic to the cart page
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
