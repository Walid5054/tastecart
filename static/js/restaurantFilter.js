document.addEventListener("DOMContentLoaded", function () {
  // Get all menu items and tabs
  const menuItems = document.querySelectorAll(".item-card");
  const menuTabs = document.querySelectorAll(".menu-tab");

  // Function to show menu items by category
  function showMenu(category) {
    // Update active tab styling
    menuTabs.forEach((tab) => {
      tab.classList.remove("bg-red-500", "text-white");
      tab.classList.add("bg-gray-100", "text-gray-700");
    });

    // Find and activate the clicked tab
    const activeTab = document.querySelector(
      `button[onclick="showMenu('${category}')"]`
    );
    if (activeTab) {
      activeTab.classList.remove("bg-gray-100", "text-gray-700");
      activeTab.classList.add("bg-red-500", "text-white");
    }

    let visibleCount = 0;

    // Filter menu items based on the category displayed in the card
    menuItems.forEach((item, index) => {
      const categoryElement = item.querySelector(".font-medium");
      const itemCategory = categoryElement
        ? categoryElement.textContent.toLowerCase().trim()
        : "";

      if (category === "all" || itemCategory === category.replace("_", " ")) {
        // Show item with staggered animation
        item.style.display = "flex";
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";

        setTimeout(() => {
          item.style.transition = "all 0.3s ease";
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, index * 50); // Stagger animations

        visibleCount++;
      } else {
        // Hide item
        item.style.transition = "all 0.3s ease";
        item.style.opacity = "0";
        item.style.transform = "translateY(-20px)";

        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });

    // Show message if no items found
    setTimeout(() => {
      showCategoryMessage(visibleCount === 0, category);
    }, 400);
  }

  // Show category message when no items found
  function showCategoryMessage(show, category) {
    let message = document.getElementById("categoryMessage");
    const tabsContainer = document.querySelector(".flex.space-x-4.mb-6");

    // Always remove existing message first
    if (message) {
      message.remove();
      message = null;
    }

    if (show) {
      const categoryName =
        category === "all"
          ? "items"
          : category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

      message = document.createElement("div");
      message.id = "categoryMessage";
      message.className = "mt-4 p-4 bg-gray-50 rounded-lg text-center";
      message.innerHTML = `
        <div class="text-gray-500">
          <h3 class="text-lg font-medium mb-2">No ${categoryName} available</h3>
          <p class="text-sm">Try selecting a different category</p>
        </div>
      `;

      // Insert after the tabs container
      if (tabsContainer) {
        tabsContainer.insertAdjacentElement("afterend", message);
      }
    }
  }

  // Make showMenu function globally available
  window.showMenu = showMenu;

  // Initialize - show all items by default
  showMenu("all");
});
