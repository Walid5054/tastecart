// Cart functionality for TasteCart
// Handles quantity updates, item removal, and cart interactions

// Function to update item quantity
async function updateQuantity(itemId, change) {
  try {
    const response = await fetch("/cart/update/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        item_id: itemId,
        change: change,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Update quantity display
        document.getElementById(`quantity-${itemId}`).textContent =
          data.new_quantity;

        // Update total price for this item (find the price element in the redesigned layout)
        const itemElement = document
          .querySelector(`[data-item-id="${itemId}"]`)
          .closest(".p-6");
        const priceElements = itemElement.querySelectorAll(".text-green-600");
        if (priceElements.length > 0) {
          priceElements[
            priceElements.length - 1
          ].textContent = `৳${data.item_total}`;
        }

        // Update cart total
        const totalElement = document.getElementById("total");
        if (totalElement) {
          totalElement.textContent = `৳${data.cart_total}`;
        }

        // If quantity is 0, remove the item from display
        if (data.new_quantity === 0) {
          itemElement.remove();
          checkEmptyCart();
        }
      } else {
        alert(data.message || "Failed to update quantity");
      }
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Failed to update quantity. Please try again.");
  }
}

// Function to remove item from cart
async function removeItem(itemId) {


  try {
    const response = await fetch("/cart/remove/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        item_id: itemId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Remove item from display (updated for new layout)
        const itemElement = document
          .querySelector(`[data-item-id="${itemId}"]`)
          .closest(".p-6");
        itemElement.remove();

        // Update cart total
        const totalElement = document.getElementById("total");
        if (totalElement) {
          totalElement.textContent = `৳${data.cart_total}`;
        }

        // Check if cart is empty
        checkEmptyCart();
      } else {
        alert(data.message || "Failed to remove item");
      }
    } else {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Failed to remove item. Please try again.");
  }
}

// Function to check if cart is empty and show appropriate message
function checkEmptyCart() {
  const cartContainer = document.getElementById("cartContainer");
  const cartItems = cartContainer.querySelectorAll(".p-6");

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="bg-white rounded-lg shadow-sm border text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="text-gray-400 mb-6">
            <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 11-4 0m12 0a2 2 0 11-4 0"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p class="text-gray-600 mb-8">Looks like you haven't added any delicious items to your cart yet. Start exploring our restaurants!</p>
          <a href="/" class="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Start Browsing Food
          </a>
        </div>
      </div>
    `;

    // Hide payment section if cart is empty
    const paymentSection = document.getElementById("paymentSection");
    if (paymentSection) {
      paymentSection.style.display = "none";
    }
  }
}

// Function to get CSRF token
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

// Function to add loading states to buttons
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
  } else {
    button.disabled = false;
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  }
}

// Function to handle checkout
function handleCheckout() {
  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked'
  );

  if (!selectedPayment) {
    alert("Please select a payment method");
    return;
  }

  const paymentMethod = selectedPayment.value;

  // Add loading state to checkout button
  const checkoutBtn = document.getElementById("checkoutBtn");
  const originalText = checkoutBtn.textContent;
  checkoutBtn.textContent = "Processing...";
  setButtonLoading(checkoutBtn, true);

  // Simulate checkout process (replace with actual implementation)
  setTimeout(() => {
    alert(`Order placed successfully with ${paymentMethod} payment method!`);
    checkoutBtn.textContent = originalText;
    setButtonLoading(checkoutBtn, false);
  }, 2000);
}

// Add event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add checkout button event listener
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
  }

  // Add hover effects to quantity buttons
  const quantityButtons = document.querySelectorAll(
    ".increase-btn, .decrease-btn"
  );
  quantityButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
});
