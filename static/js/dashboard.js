document.addEventListener("DOMContentLoaded", function () {
  // Add Menu Modal
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const modal = document.getElementById("menuModal");

  if (openModal && closeModal && modal) {
    openModal.addEventListener("click", () => modal.classList.remove("hidden"));
    closeModal.addEventListener("click", () => modal.classList.add("hidden"));

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");

    if (e.target === editModal) closeEditModal();
    if (e.target === deleteModal) closeDeleteModal();
  });

  // Live Kitchen Toggle
  const liveKitchenToggle = document.getElementById("liveKitchenToggle");
  if (liveKitchenToggle) {
    liveKitchenToggle.addEventListener("change", function () {
      if (this.checked) {
        console.log("Live kitchen updates enabled");
      } else {
        console.log("Live kitchen updates disabled");
      }
    });
  }
});

// Edit Modal Functions
function openEditModal(id) {
  // Set the item ID and redirect to edit view
  window.location.href = `/owner-dashboard?edit=${id}`;
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

// Delete Modal Functions
function openDeleteModal(id, name) {
  document.getElementById("deleteItemId").value = id;
  document.getElementById("deleteItemName").textContent = name;
  document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
  document.getElementById("deleteModal").classList.add("hidden");
}

// Close edit modal when clicking cancel or outside
function closeEditModalAndRedirect() {
  window.location.href = "/owner-dashboard";
}
