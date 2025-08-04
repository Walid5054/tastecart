let csrfToken = "";
let modifyOrderUrl = "";
let cancelOrderUrl = "";
let currentOrderId = null;
let currentQuantity = 0;
let itemPrice = 0;

function initializeStatusPage(csrf_token, modify_url, cancel_url) {
  csrfToken = csrf_token;
  modifyOrderUrl = modify_url;
  cancelOrderUrl = cancel_url;
  setTimeout(() => {
    const messages = document.getElementById("messages");
    if (messages) messages.style.display = "none";
  }, 5000);
}

function openModifyModal(orderId, currentQty, price) {
  currentOrderId = orderId;
  currentQuantity = currentQty;
  itemPrice = parseFloat(price);

  document.getElementById("currentQty").textContent = currentQty;
  document.getElementById("newQuantity").value = currentQty;
  calculateAdditionalCost();
  document.getElementById("modifyModal").classList.remove("hidden");
}

function closeModifyModal() {
  document.getElementById("modifyModal").classList.add("hidden");
  currentOrderId = null;
  currentQuantity = 0;
  itemPrice = 0;
}

function adjustQuantity(delta) {
  const input = document.getElementById("newQuantity");
  let value = parseInt(input.value) || 1;
  value += delta;
  if (value < 1) value = 1;
  input.value = value;
  calculateAdditionalCost();
}

function increaseQuantity() {
  adjustQuantity(1);
}

function decreaseQuantity() {
  adjustQuantity(-1);
}

function calculateAdditionalCost() {
  const newQuantity =
    parseInt(document.getElementById("newQuantity").value) || 1;
  const diff = newQuantity - currentQuantity;
  let additionalCost = diff > 0 ? diff * itemPrice + 5 : diff * itemPrice;
  document.getElementById("additionalCost").textContent =
    additionalCost.toFixed(2);
}

function confirmModifyOrder() {
  const newQuantity =
    parseInt(document.getElementById("newQuantity").value) || 1;
  if (newQuantity === currentQuantity)
    return (
      showMessage("No changes made to the order.", "warning"),
      closeModifyModal()
    );
  if (newQuantity < 1)
    return showMessage("Quantity must be at least 1.", "error");

  const confirmBtn = document.querySelector(
    '#modifyModal button[onclick="confirmModifyOrder()"]'
  );
  const originalText = confirmBtn.textContent;
  confirmBtn.textContent = "Processing...";
  confirmBtn.disabled = true;

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
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showMessage(data.message, "success");
        document.getElementById(`quantity-${currentOrderId}`).textContent =
          newQuantity;
        document.getElementById(`total-${currentOrderId}`).textContent =
          data.new_total.toFixed(2);
        closeModifyModal();
        setTimeout(() => location.reload(), 1500);
      } else {
        showMessage(data.message, "error");
      }
    })
    .catch(() => showMessage("An error occurred. Please try again.", "error"))
    .finally(() => {
      confirmBtn.textContent = originalText;
      confirmBtn.disabled = false;
    });
}

function cancelOrder(orderId) {
  fetch(cancelOrderUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ order_id: orderId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showMessage(data.message, "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        showMessage(data.message, "error");
      }
    })
    .catch(() => showMessage("An error occurred. Please try again.", "error"));
}

function trackOrder() {
  document.getElementById("trackModal").classList.remove("hidden");
  initializeMap();
  updateEstimatedTime();
}

function closeTrackModal() {
  document.getElementById("trackModal").classList.add("hidden");
}

function initializeMap() {
  const mapContainer = document.getElementById("map");
  mapContainer.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
      <div class="text-4xl mb-2">🗺️</div>
      <p class="text-gray-600 font-medium">Live Tracking Map</p>
      <p class="text-sm text-gray-500 mt-1">Your order is being prepared</p>
      <div class="mt-4 flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-600">Restaurant Location</span>
      </div>
    </div>`;
}

function updateEstimatedTime() {
  const el = document.getElementById("estimatedTime");
  const min = Math.floor(Math.random() * 20) + 20;
  el.textContent = `${min}-${min + 10} minutes`;
}

function showMessage(message, type) {
  const existing = document.getElementById("messages");
  if (existing) existing.remove();

  const container = createMessagesContainer();
  const alertClass = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  const msg = document.createElement("div");
  msg.className = `border px-4 py-3 rounded mb-4 ${
    alertClass[type] || alertClass["info"]
  }`;
  msg.innerHTML = `<div class="flex justify-between items-center">
                     <span>${message}</span>
                     <button onclick="this.parentElement.parentElement.remove()" class="ml-4 font-bold">&times;</button>
                   </div>`;
  container.appendChild(msg);

  setTimeout(() => msg.remove(), 5000);
}

function createMessagesContainer() {
  let container = document.getElementById("messages");
  if (!container) {
    container = document.createElement("div");
    container.id = "messages";
    container.className = "fixed top-4 right-4 z-50 max-w-md";
    document.body.appendChild(container);
  }
  return container;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("newQuantity");
  if (input) {
    input.addEventListener("input", calculateAdditionalCost);
    input.addEventListener("change", calculateAdditionalCost);
  }
});

function formatCurrency(amount) {
  return parseFloat(amount).toFixed(2);
}

function startAutoRefresh() {
  setInterval(() => {
    const modifyModal = document.getElementById("modifyModal");
    const trackModal = document.getElementById("trackModal");
    if (
      modifyModal.classList.contains("hidden") &&
      trackModal.classList.contains("hidden")
    ) {
      checkOrderUpdates();
    }
  }, 2000);
}

function checkOrderUpdates() {
  console.log("Checking for order updates...");
}
