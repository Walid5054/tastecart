// Order Status Management JavaScript Functions

// Global variables to store CSRF token and URLs
let csrfToken = "";
let modifyOrderUrl = "";
let cancelOrderUrl = "";
let currentOrderId = null;
let currentQuantity = 0;
let itemPrice = 0;

// Initialize the status page
function initializeStatusPage(csrf_token, modify_url, cancel_url) {
  csrfToken = csrf_token;
  modifyOrderUrl = modify_url;
  cancelOrderUrl = cancel_url;

  // Auto-hide messages after 5 seconds
  setTimeout(() => {
    const messages = document.getElementById("messages");
    if (messages) {
      messages.style.display = "none";
    }
  }, 5000);
}

// Open modify order modal
function openModifyModal(orderId, currentQty, price) {
  currentOrderId = orderId;
  currentQuantity = currentQty;
  itemPrice = parseFloat(price);

  document.getElementById("currentQty").textContent = currentQty;
  document.getElementById("newQuantity").value = currentQty;

  calculateAdditionalCost();
  document.getElementById("modifyModal").classList.remove("hidden");
}

// Close modify order modal
function closeModifyModal() {
  document.getElementById("modifyModal").classList.add("hidden");
  currentOrderId = null;
  currentQuantity = 0;
  itemPrice = 0;
}

// Increase quantity
function increaseQuantity() {
  const input = document.getElementById("newQuantity");
  let value = parseInt(input.value) || 1;
  input.value = value + 1;
  calculateAdditionalCost();
}

// Decrease quantity
function decreaseQuantity() {
  const input = document.getElementById("newQuantity");
  let value = parseInt(input.value) || 1;
  if (value > 1) {
    input.value = value - 1;
    calculateAdditionalCost();
  }
}

// Calculate additional cost
function calculateAdditionalCost() {
  const newQuantity =
    parseInt(document.getElementById("newQuantity").value) || 1;
  const quantityDifference = newQuantity - currentQuantity;

  let additionalCost = 0;
  if (quantityDifference > 0) {
    // Additional item cost + processing fee
    additionalCost = quantityDifference * itemPrice + 5;
  } else if (quantityDifference < 0) {
    // Reduction in cost (no processing fee for reduction)
    additionalCost = quantityDifference * itemPrice;
  }

  document.getElementById("additionalCost").textContent =
    additionalCost.toFixed(2);
}

// Confirm modify order
function confirmModifyOrder() {
  const newQuantity =
    parseInt(document.getElementById("newQuantity").value) || 1;

  if (newQuantity === currentQuantity) {
    showMessage("No changes made to the order.", "warning");
    closeModifyModal();
    return;
  }

  if (newQuantity < 1) {
    showMessage("Quantity must be at least 1.", "error");
    return;
  }

  // Show loading state
  const confirmBtn = document.querySelector(
    '#modifyModal button[onclick="confirmModifyOrder()"]'
  );
  const originalText = confirmBtn.textContent;
  confirmBtn.textContent = "Processing...";
  confirmBtn.disabled = true;

  // Send AJAX request
  fetch(modifyOrderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      order_id: currentOrderId,
      new_quantity: newQuantity,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showMessage(data.message, "success");

        // Update the UI with new values
        document.getElementById(`quantity-${currentOrderId}`).textContent =
          newQuantity;
        document.getElementById(`total-${currentOrderId}`).textContent =
          data.new_total.toFixed(2);

        closeModifyModal();

        // Reload page after a short delay to show updated information
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        showMessage(data.message, "error");
      }
    })
    .catch((error) => {
      showMessage("An error occurred. Please try again.", "error");
      console.error("Error:", error);
    })
    .finally(() => {
      // Restore button state
      confirmBtn.textContent = originalText;
      confirmBtn.disabled = false;
    });
}

// Cancel order function
function cancelOrder(orderId) {
  if (
    !confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    )
  ) {
    return;
  }

  // Send AJAX request
  fetch(cancelOrderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      order_id: orderId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showMessage(data.message, "success");

        // Reload page after a short delay
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        showMessage(data.message, "error");
      }
    })
    .catch((error) => {
      showMessage("An error occurred. Please try again.", "error");
      console.error("Error:", error);
    });
}

// Open track order modal
function trackOrder(orderId) {
  document.getElementById("trackModal").classList.remove("hidden");

  // Simulate real-time tracking (in a real app, this would connect to a live tracking API)
  initializeMap();
  updateEstimatedTime();
}

// Close track order modal
function closeTrackModal() {
  document.getElementById("trackModal").classList.add("hidden");
}

// Initialize map (placeholder for Google Maps integration)
function initializeMap() {
  const mapContainer = document.getElementById("map");

  // For demo purposes, show a placeholder map
  mapContainer.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
            <div class="text-4xl mb-2">🗺️</div>
            <p class="text-gray-600 font-medium">Live Tracking Map</p>
            <p class="text-sm text-gray-500 mt-1">Your order is being prepared</p>
            <div class="mt-4 flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-gray-600">Restaurant Location</span>
            </div>
        </div>
    `;

  // In a real implementation, you would initialize Google Maps here:
  /*
    const map = new google.maps.Map(mapContainer, {
        center: { lat: 23.8103, lng: 90.4125 }, // Dhaka coordinates
        zoom: 13
    });
    
    // Add markers for restaurant and delivery location
    */
}

// Update estimated delivery time
function updateEstimatedTime() {
  // Simulate dynamic time updates
  const estimatedTimeElement = document.getElementById("estimatedTime");

  // Random time between 20-40 minutes for demo
  const minutes = Math.floor(Math.random() * 20) + 20;
  estimatedTimeElement.textContent = `${minutes}-${minutes + 10} minutes`;
}

// Show message function
function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.getElementById("messages");
  if (existingMessages) {
    existingMessages.remove();
  }

  // Create new message container
  const messagesContainer = createMessagesContainer();

  const alertClass = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  const messageElement = document.createElement("div");
  messageElement.className = `border px-4 py-3 rounded mb-4 ${
    alertClass[type] || alertClass["info"]
  }`;
  messageElement.innerHTML = `
        <div class="flex justify-between items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 font-bold">&times;</button>
        </div>
    `;

  messagesContainer.appendChild(messageElement);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.remove();
    }
  }, 5000);
}

// Create messages container if it doesn't exist
function createMessagesContainer() {
  let messagesContainer = document.getElementById("messages");

  if (!messagesContainer) {
    messagesContainer = document.createElement("div");
    messagesContainer.id = "messages";
    messagesContainer.className = "fixed top-4 right-4 z-50 max-w-md";
    document.body.appendChild(messagesContainer);
  }

  return messagesContainer;
}

// Handle quantity input changes
document.addEventListener("DOMContentLoaded", function () {
  const quantityInput = document.getElementById("newQuantity");
  if (quantityInput) {
    quantityInput.addEventListener("input", calculateAdditionalCost);
    quantityInput.addEventListener("change", calculateAdditionalCost);
  }
});

// Utility function to format currency
function formatCurrency(amount) {
  return parseFloat(amount).toFixed(2);
}

// Auto-refresh order status every 30 seconds (optional)
function startAutoRefresh() {
  setInterval(() => {
    // Only refresh if no modals are open
    const modifyModal = document.getElementById("modifyModal");
    const trackModal = document.getElementById("trackModal");

    if (
      modifyModal.classList.contains("hidden") &&
      trackModal.classList.contains("hidden")
    ) {
      // Check for updates without full page reload
      checkOrderUpdates();
    }
  }, 30000); // 30 seconds
}

// Check for order updates via AJAX (placeholder function)
function checkOrderUpdates() {
  // This would typically make an AJAX call to check for order status updates
  // and update the UI accordingly without a full page refresh
  console.log("Checking for order updates...");
}

// Initialize auto-refresh if needed
// startAutoRefresh();
