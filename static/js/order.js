// Order Management JavaScript Functions

// Global variables to store CSRF token and URLs
let csrfToken = "";
let updateOrderStatusUrl = "";

// Initialize the order management system
function initializeOrderManagement(csrf_token, update_url) {
  csrfToken = csrf_token;
  updateOrderStatusUrl = update_url;

  // Add event listeners to filters
  document
    .getElementById("statusFilter")
    .addEventListener("change", filterOrders);
  document
    .getElementById("acceptedFilter")
    .addEventListener("change", filterOrders);
  document
    .getElementById("deliveredFilter")
    .addEventListener("change", filterOrders);

  // Auto-hide messages after 5 seconds
  setTimeout(() => {
    const messages = document.getElementById("messages");
    if (messages) {
      messages.style.display = "none";
    }
  }, 5000);
}

// Filter functionality
function filterOrders() {
  const statusFilter = document.getElementById("statusFilter").value;
  const acceptedFilter = document.getElementById("acceptedFilter").value;
  const deliveredFilter = document.getElementById("deliveredFilter").value;

  const orders = document.querySelectorAll(".order-item");

  orders.forEach((order) => {
    let show = true;

    if (statusFilter && order.dataset.status !== statusFilter) {
      show = false;
    }

    if (acceptedFilter && order.dataset.accepted !== acceptedFilter) {
      show = false;
    }

    if (deliveredFilter && order.dataset.delivered !== deliveredFilter) {
      show = false;
    }

    order.style.display = show ? "block" : "none";
  });
}

// Update order status function
function updateOrderStatus(orderId, action) {
  $.ajax({
    url: updateOrderStatusUrl,
    method: "POST",
    data: {
      order_id: orderId,
      action: action,
      csrfmiddlewaretoken: csrfToken,
    },
    success: function (response) {
      if (response.success) {
        // Show success message
        showMessage(response.message, "success");
        // Reload page to update the UI
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        showMessage(response.message, "error");
      }
    },
    error: function () {
      showMessage("An error occurred. Please try again.", "error");
    },
  });
}

// Show message function
function showMessage(message, type) {
  const messagesContainer =
    document.getElementById("messages") || createMessagesContainer();

  const messageDiv = document.createElement("div");
  messageDiv.className = `bg-${
    type === "success" ? "green" : "red"
  }-100 border border-${type === "success" ? "green" : "red"}-400 text-${
    type === "success" ? "green" : "red"
  }-700 px-4 py-3 rounded-lg shadow-lg max-w-sm`;
  messageDiv.textContent = message;

  messagesContainer.appendChild(messageDiv);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Create messages container if it doesn't exist
function createMessagesContainer() {
  const container = document.createElement("div");
  container.id = "messages";
  container.className = "fixed top-4 right-4 z-50 space-y-2";
  document.body.appendChild(container);
  return container;
}
