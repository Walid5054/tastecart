document.addEventListener("DOMContentLoaded", function () {
  // Get all filter elements
  const filterCategory = document.getElementById("filterCategory");
  const filterPrice = document.getElementById("filterPrice");
  const filterRating = document.getElementById("filterRating");
  const searchInput = document.getElementById("searchInput");
  const menuItems = document.querySelectorAll(".item-card");
  const cartCount = document.getElementById("cartCount");

  // Store original menu items data
  const menuData = Array.from(menuItems)
    .map((item) => {
      const nameElement = item.querySelector("h3");
      const restaurantElement = item.querySelector(".font-medium");
      const priceElement = item.querySelector("p:nth-of-type(2)");
      const ratingElement = item.querySelector(".text-yellow-500");

      // Skip if essential elements are missing
      if (
        !nameElement ||
        !restaurantElement ||
        !priceElement ||
        !ratingElement
      ) {
        return null;
      }

      const name = nameElement.textContent.toLowerCase();
      const restaurant = restaurantElement.textContent.toLowerCase();
      const priceText = priceElement.textContent;
      const price = parseFloat(priceText.replace("৳", "").trim());
      const ratingText = ratingElement.textContent;
      const rating = parseFloat(ratingText.replace("⭐️", "").trim());

      // Get category from data attribute or text content
      const category =
        item.dataset.itemCategory ||
        item.querySelector("[data-category]")?.dataset.category ||
        getActualCategory(item);

      return {
        element: item,
        name,
        restaurant,
        price,
        rating,
        category: category.toLowerCase(),
      };
    })
    .filter(Boolean); // Remove null entries

  // Function to get the actual category from the menu item
  function getActualCategory(itemElement) {
    // Try to find category in various possible locations
    const categorySelectors = [
      ".category-text",
      ".item-category",
      "[data-category]",
      '.text-gray-500:contains("Category")',
    ];

    for (const selector of categorySelectors) {
      const categoryElement = itemElement.querySelector(selector);
      if (categoryElement) {
        return categoryElement.textContent.trim();
      }
    }

    // If no category element found, check if it's in the item structure
    // Look for text that might indicate category
    const allTextElements = itemElement.querySelectorAll("p, span");
    for (const element of allTextElements) {
      const text = element.textContent.toLowerCase();
      if (text.includes("category:") || text.includes("type:")) {
        return element.textContent.split(":")[1]?.trim() || "main course";
      }
    }

    return "main course"; // default fallback
  }

  // Main filter function
  function filterMenuItems() {
    const categoryFilter = filterCategory
      ? filterCategory.value.toLowerCase()
      : "";
    const priceFilter =
      filterPrice && filterPrice.value ? parseFloat(filterPrice.value) : null;
    const ratingFilter =
      filterRating && filterRating.value
        ? parseFloat(filterRating.value)
        : null;
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    let visibleCount = 0;

    menuData.forEach((item) => {
      let shouldShow = true;

      // Category filter
      if (categoryFilter && item.category !== categoryFilter) {
        shouldShow = false;
      }

      // Price filter
      if (priceFilter && item.price > priceFilter) {
        shouldShow = false;
      }

      // Rating filter
      if (ratingFilter && item.rating < ratingFilter) {
        shouldShow = false;
      }

      // Search filter
      if (
        searchTerm &&
        !item.name.includes(searchTerm) &&
        !item.restaurant.includes(searchTerm)
      ) {
        shouldShow = false;
      }

      // Show/hide item with animation
      if (shouldShow) {
        item.element.style.display = "flex";
        item.element.style.opacity = "0";
        item.element.style.transform = "translateY(20px)";

        setTimeout(() => {
          item.element.style.transition = "all 0.3s ease";
          item.element.style.opacity = "1";
          item.element.style.transform = "translateY(0)";
        }, 50);

        visibleCount++;
      } else {
        item.element.style.transition = "all 0.3s ease";
        item.element.style.opacity = "0";
        item.element.style.transform = "translateY(-20px)";

        setTimeout(() => {
          item.element.style.display = "none";
        }, 300);
      }
    });

    // Show "No results found" message if no items visible
    setTimeout(() => {
      showNoResultsMessage(visibleCount === 0);
    }, 350);
  }

  // Show/hide no results message
  function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById("noResultsMessage");

    if (show && !noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.id = "noResultsMessage";
      noResultsMsg.className = "col-span-full text-center py-12";
      noResultsMsg.innerHTML = `
        <div class="text-gray-500">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-medium text-gray-900 mb-2">No dishes found</h3>
          <p class="text-gray-500">Try adjusting your filters or search terms</p>
          <button onclick="clearAllFilters()" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Clear All Filters
          </button>
        </div>
      `;
      document.querySelector(".grid").appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // Clear all filters function
  window.clearAllFilters = function () {
    if (filterCategory) filterCategory.value = "";
    if (filterPrice) filterPrice.value = "";
    if (filterRating) filterRating.value = "";
    if (searchInput) searchInput.value = "";
    filterMenuItems();
    showToast("All filters cleared!", "success");
  };

  // Debounce function for search input
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
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

    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
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

  // Event listeners with null checks
  if (filterCategory) {
    filterCategory.addEventListener("change", filterMenuItems);
  }

  if (filterPrice) {
    filterPrice.addEventListener("change", filterMenuItems);
  }

  if (filterRating) {
    filterRating.addEventListener("change", filterMenuItems);
  }

  if (searchInput) {
    searchInput.addEventListener("input", debounce(filterMenuItems, 300));
  }

  // Initialize
  filterMenuItems();


});
