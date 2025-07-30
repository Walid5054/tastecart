document.addEventListener("DOMContentLoaded", function () {
  // Get all filter elements
  const filterLocation = document.getElementById("filterLocation");
  const filterCuisine = document.getElementById("filterCuisine");
  const filterRating = document.getElementById("filterRating");
  const filterDelivery = document.getElementById("filterDelivery");
  const searchInput = document.getElementById("searchInput");
  const restaurantCards = document.querySelectorAll(".grid > div");

  // Store original restaurant data
  const restaurantData = Array.from(restaurantCards)
    .map((card) => {
      // Check if required elements exist
      const nameElement = card.querySelector("h3");
      const categoryLocationElement = card.querySelector(".text-gray-600");
      const ratingElement = card.querySelector(".text-yellow-500");
      const deliveryElements = card.querySelectorAll(".text-gray-600");

      // Skip if essential elements are missing
      if (!nameElement || !categoryLocationElement || !ratingElement) {
        return null;
      }

      const name = nameElement.textContent.toLowerCase();
      const categoryLocation =
        categoryLocationElement.textContent.toLowerCase();
      const [category, location] = categoryLocation
        .split(" | ")
        .map((item) => item.trim());

      const ratingText = ratingElement.textContent;
      const rating = parseFloat(ratingText.replace("⭐️", "").trim()) || 0;

      // Get delivery time from the last .text-gray-600 element
      const deliveryElement = deliveryElements[deliveryElements.length - 1];
      const deliveryText = deliveryElement ? deliveryElement.textContent : "";
      const deliveryTime =
        parseInt(deliveryText.replace("⏱️", "").replace("min", "").trim()) || 0;

      return {
        element: card,
        name,
        category: category || "",
        location: location || "",
        rating,
        deliveryTime,
      };
    })
    .filter(Boolean); // Remove null entries

  // Main filter function
  function filterRestaurants() {
    // Check if filter elements exist before accessing their values
    const locationFilter = filterLocation
      ? filterLocation.value.toLowerCase()
      : "";
    const cuisineFilter = filterCuisine
      ? filterCuisine.value.toLowerCase()
      : "";
    const ratingFilter =
      filterRating && filterRating.value
        ? parseFloat(filterRating.value)
        : null;
    const deliveryFilter =
      filterDelivery && filterDelivery.value
        ? parseInt(filterDelivery.value)
        : null;
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    let visibleCount = 0;

    restaurantData.forEach((restaurant) => {
      let shouldShow = true;

      // Location filter
      if (locationFilter && !restaurant.location.includes(locationFilter)) {
        shouldShow = false;
      }

      // Cuisine filter
      if (cuisineFilter && !restaurant.category.includes(cuisineFilter)) {
        shouldShow = false;
      }

      // Rating filter
      if (ratingFilter && restaurant.rating < ratingFilter) {
        shouldShow = false;
      }

      // Delivery time filter
      if (deliveryFilter && restaurant.deliveryTime > deliveryFilter) {
        shouldShow = false;
      }

      // Search filter
      if (
        searchTerm &&
        !restaurant.name.includes(searchTerm) &&
        !restaurant.category.includes(searchTerm) &&
        !restaurant.location.includes(searchTerm)
      ) {
        shouldShow = false;
      }

      // Show/hide restaurant with animation
      if (shouldShow) {
        restaurant.element.style.display = "flex";
        restaurant.element.style.opacity = "0";
        restaurant.element.style.transform = "translateY(20px)";

        setTimeout(() => {
          restaurant.element.style.transition = "all 0.3s ease";
          restaurant.element.style.opacity = "1";
          restaurant.element.style.transform = "translateY(0)";
        }, 50);

        visibleCount++;
      } else {
        restaurant.element.style.transition = "all 0.3s ease";
        restaurant.element.style.opacity = "0";
        restaurant.element.style.transform = "translateY(-20px)";

        setTimeout(() => {
          restaurant.element.style.display = "none";
        }, 300);
      }
    });

    // Show "No results found" message if no restaurants visible
    setTimeout(() => {
      showNoResultsMessage(visibleCount === 0);
    }, 350);
  }

  // Show/hide no results message
  function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById("noResultsMessage");
    const gridElement = document.querySelector(".grid");

    if (!gridElement) return; // Exit if grid doesn't exist

    if (show && !noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.id = "noResultsMessage";
      noResultsMsg.className = "col-span-full text-center py-16";
      noResultsMsg.innerHTML = `
        <div class="text-gray-500">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 class="text-xl font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p class="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      `;
      gridElement.appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

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

  // Event listeners with null checks
  if (filterLocation) {
    filterLocation.addEventListener("change", filterRestaurants);
  }

  if (filterCuisine) {
    filterCuisine.addEventListener("change", filterRestaurants);
  }

  if (filterRating) {
    filterRating.addEventListener("change", filterRestaurants);
  }

  if (filterDelivery) {
    filterDelivery.addEventListener("change", filterRestaurants);
  }

  if (searchInput) {
    searchInput.addEventListener("input", debounce(filterRestaurants, 300));
  }

});
