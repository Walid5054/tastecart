document.addEventListener("DOMContentLoaded", function () {
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
  const restaurantClosedMessage = document.getElementById(
    "restaurantClosedMessage"
  );
  const actionButtons = document.getElementById("actionButtons");

  let currentItem = null;
  let quantity = 1;

  function openModal(itemData) {
    currentItem = itemData;
    quantity = 1;

    const trimmedIsOpen = itemData.isOpen?.toString().trim().toLowerCase();
    const isRestaurantOpen =
      trimmedIsOpen === "true" || itemData.isOpen === true;
    console.log("isRestaurantOpen:", isRestaurantOpen);
    if (!isRestaurantOpen) {
      if (restaurantClosedMessage) {
        restaurantClosedMessage.classList.remove("hidden");
      }
      if (actionButtons) {
        actionButtons.classList.add("hidden");
      }

      if (decreaseQtyBtn) {
        decreaseQtyBtn.disabled = true;
        decreaseQtyBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
      if (increaseQtyBtn) {
        increaseQtyBtn.disabled = true;
        increaseQtyBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
    } else {
      console.log("Restaurant is OPEN - entering open logic");
      if (restaurantClosedMessage) {
        restaurantClosedMessage.classList.add("hidden");
      }
      if (actionButtons) {
        actionButtons.classList.remove("hidden");
      }

      if (decreaseQtyBtn) {
        decreaseQtyBtn.disabled = false;
        decreaseQtyBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
      if (increaseQtyBtn) {
        increaseQtyBtn.disabled = false;
        increaseQtyBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
    }
    if (modalImage) {
      modalImage.src = itemData.image;
      modalImage.alt = itemData.name;
    }
    if (modalTitle) {
      modalTitle.textContent = itemData.name;
    }
    if (modalRestaurant) {
      modalRestaurant.innerHTML = `From: <a href="${location.origin}/restaurant/${itemData.restaurantSlug}" class="font-medium text-red-500 hover:underline">${itemData.restaurant}</a>`;
    }
    if (modalPrice) {
      modalPrice.textContent = `৳${itemData.price}`;
    }
    if (modalRating) {
      const ratingSpan = modalRating.querySelector("span:last-child");
      if (ratingSpan) {
        ratingSpan.textContent = itemData.rating;
      }
    }
    if (modalDescription) {
      modalDescription.textContent = itemData.description;
    }

    // Handle discount
    if (modalDiscount) {
      if (itemData.discount && itemData.discount > 0) {
        modalDiscount.textContent = `${itemData.discount}% OFF`;
        modalDiscount.classList.remove("hidden");
      } else {
        modalDiscount.classList.add("hidden");
      }
    }

    updateQuantityAndTotal();

    updateModalAddToCartHref();

    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      setTimeout(() => {
        if (modalContent) {
          modalContent.classList.remove("scale-95", "opacity-0");
          modalContent.classList.add("scale-100", "opacity-100");
        }
      }, 10);


      document.body.style.overflow = "hidden";
    }
  }

  function closeModalFunc() {
    if (modalContent) {
      modalContent.classList.remove("scale-100", "opacity-100");
      modalContent.classList.add("scale-95", "opacity-0");
    }

    setTimeout(() => {
      if (modal) {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
      }
      document.body.style.overflow = "auto";
    }, 300);
  }

  // Update quantity and total price
  function updateQuantityAndTotal() {
    if (quantityEl) {
      quantityEl.textContent = quantity;
    }
    if (currentItem && totalPriceEl) {
      const basePrice = parseFloat(currentItem.price);
      const discount = currentItem.discount || 0;
      const discountedPrice = basePrice * (1 - discount / 100);
      const total = discountedPrice * quantity;
      totalPriceEl.textContent = `৳${total.toFixed(2)}`;
    }

    
    updateModalAddToCartHref();
  }

  // Update modal Add to Cart button href with current item ID and quantity
  function updateModalAddToCartHref() {
    if (currentItem && modalAddToCartBtn) {
   
      const addToCartUrl = `${location.origin}/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
      modalAddToCartBtn.href = addToCartUrl;
    }
  }

 
  itemCards.forEach((card) => {
    card.addEventListener("click", function (e) {
    
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
        isOpen: this.dataset.itemIsOpen,
      };

      openModal(itemData);
    });
  });

  
  if (closeModal) {
    closeModal.addEventListener("click", closeModalFunc);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModalFunc();
      }
    });
  }

 
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeModalFunc();
    }
  });

  
  if (decreaseQtyBtn) {
    decreaseQtyBtn.addEventListener("click", function () {
      // Check if button is disabled (restaurant closed)
      if (this.disabled) return;

      if (quantity > 1) {
        quantity--;
        updateQuantityAndTotal();
      }
    });
  }

  if (increaseQtyBtn) {
    increaseQtyBtn.addEventListener("click", function () {
      // Check if button is disabled (restaurant closed)
      if (this.disabled) return;

      if (quantity < 99) {
        // Max quantity limit
        quantity++;
        updateQuantityAndTotal();
      }
    });
  }

  // Add to cart from modal
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default link behavior

      if (!currentItem) {
        return;
      }

      
      const trimmedIsOpen = currentItem.isOpen?.toString().trim().toLowerCase();
      const isRestaurantOpen =
        trimmedIsOpen === "true" || currentItem.isOpen === true;
      if (!isRestaurantOpen) {
        showToast("Restaurant is currently closed", "error");
        return;
      }

 
      if (typeof addToCartAjax === "function") {
        addToCartAjax(currentItem.restaurantSlug, currentItem.id, quantity);

        // Close modal after adding to cart
        setTimeout(() => {
          closeModalFunc();
        }, 1000);
      } else {

        const addToCartUrl = `${location.origin}/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
        window.location.href = addToCartUrl;
      }
    });
  }


  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", function () {
      if (!currentItem) return;


      const trimmedIsOpen = currentItem.isOpen?.toString().trim().toLowerCase();
      const isRestaurantOpen =
        trimmedIsOpen === "true" || currentItem.isOpen === true;
      if (!isRestaurantOpen) {
        showToast("Restaurant is currently closed", "error");
        return;
      }


      if (typeof addToCartAjax === "function") {

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
              window.location.href = "/cart";
            }
          })
          .catch(() => {
            window.location.href = `/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
          });
      } else {
        window.location.href = `/add-to-cart/${currentItem.restaurantSlug}/${currentItem.id}/${quantity}/`;
      }
    });
  }

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

    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

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
