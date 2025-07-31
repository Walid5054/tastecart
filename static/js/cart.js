/**
 * AJAX Cart Operations
 * Handles add to cart, update quantity, and remove from cart without page reload
 */

document.addEventListener("DOMContentLoaded", function () {
  // CSRF Token for Django
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

  const csrftoken = getCookie("csrftoken");

  // Add to cart function
  window.addToCartAjax = function (restaurantSlug, itemId, quantity = 1) {
    const url = `/add-to-cart/${restaurantSlug}/${itemId}/${quantity}/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        ajax: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update cart count in header
          updateCartCount(data.cart_count);

          // Show success message
          showToast(data.message, "success");

          // Update any cart displays on current page
          if (typeof updateCartDisplay === "function") {
            updateCartDisplay();
          }
        } else {
          showToast(data.message || "Error adding item to cart", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("Failed to add item to cart", "error");
      });
  };

  // Update cart quantity function
  window.updateCartQuantityAjax = function (cartItemId, change) {
    fetch("/cart/update/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        item_id: cartItemId,
        change: change,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update the specific cart item
          const cartItem = document.querySelector(
            `[data-cart-item-id="${cartItemId}"]`
          );
          if (cartItem) {
            if (data.new_quantity === 0) {
              // Remove the item from display
              cartItem.remove();
              showToast("Item removed from cart", "info");
            } else {
              // Update quantity and prices
              const quantityEl = cartItem.querySelector(".quantity");
              const quantityDisplayEl = cartItem.querySelector(
                `#quantity-${cartItemId}`
              );
              const itemTotalEl = cartItem.querySelector(".item-total");

              if (quantityEl) quantityEl.textContent = data.new_quantity;
              if (quantityDisplayEl)
                quantityDisplayEl.textContent = data.new_quantity;
              if (itemTotalEl) itemTotalEl.textContent = `৳${data.item_total}`;
            }
          }

          // Update cart total
          const cartTotalEl = document.querySelector(".cart-total");
          if (cartTotalEl) {
            cartTotalEl.textContent = `৳${data.cart_total}`;
          }

          // Update cart item count display
          if (data.cart_items !== undefined) {
            const cartItemCountEl = document.querySelector("#cartItemCount");
            if (cartItemCountEl) {
              const itemText = data.cart_items === 1 ? "item" : "items";
              cartItemCountEl.textContent = `${data.cart_items} ${itemText} in your cart`;
            }
          }

          updateCartCount();

          showToast("Cart updated successfully", "success");
        } else {
          showToast(data.message || "Error updating cart", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("Failed to update cart", "error");
      });
  };

  // Remove from cart function
  window.removeFromCartAjax = function (cartItemId) {
    fetch("/cart/remove/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        item_id: cartItemId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Remove the item from display
          const cartItem = document.querySelector(
            `[data-cart-item-id="${cartItemId}"]`
          );
          if (cartItem) {
            cartItem.remove();
          }

          // Update cart total
          const cartTotalEl = document.querySelector(".cart-total");
          if (cartTotalEl) {
            cartTotalEl.textContent = `৳${data.cart_total}`;
          }

          // Update cart count
          updateCartCount();

          showToast("Item removed from cart", "info");
          var cartItemCountEl = document.querySelector("#cartItemCount");
          cartItemCountEl.textContent = `${data.cart_items} item${data.cart_items !== 1 ? "s" : ""} in your cart`;
          // Check if cart is empty
          if (data.cart_items === 0) {
            const cartContainer = document.querySelector(".cart-container");
            if (cartContainer) {
              cartContainer.innerHTML = `
                            <div class="text-center py-8">
                                <i class="fas fa-shopping-cart text-gray-300 text-6xl mb-4"></i>
                                <h3 class="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                                <p class="text-gray-500 mb-4">Add some delicious items to get started!</p>
                                <a href="/menu" class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                                    Browse Menu
                                </a>
                            </div>
                        `;
            }
          }
        } else {
          showToast(data.message || "Error removing item from cart", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("Failed to remove item from cart", "error");
      });
  };

  // Update cart count in header
  function updateCartCount(count = null) {
    if (count === null) {
      // Fetch current cart count
      fetch("/cart/count/", {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const cartCountEls = document.querySelectorAll(
              "#cartCount, #cartCountMobile"
            );
            cartCountEls.forEach((el) => {
              if (el) el.textContent = data.cart_count;
            });
          }
        })
        .catch((error) => console.error("Error fetching cart count:", error));
    } else {
      // Use provided count
      const cartCountEls = document.querySelectorAll(
        "#cartCount, #cartCountMobile"
      );
      cartCountEls.forEach((el) => {
        if (el) el.textContent = count;
      });
    }
  }

  // Toast notification function
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
    }, 1000);
  }

  // Initialize cart count on page load
  updateCartCount();
});
