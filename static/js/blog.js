const blogData = {
  "Latest Articles": [
    {
      title: "Top 10 Bangladeshi Dishes You Must Try",
      category: "News",
      author: "Admin",
      snippet:
        "Explore the rich culinary tradition of Bangladesh with these must-try dishes.",
      image: "https://via.placeholder.com/300x200?text=Bangladeshi+Dishes",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
      title: "Dhaka's Best Street Food Spots",
      category: "News",
      author: "Shahid",
      snippet: "Discover the tastiest eats on Dhaka's bustling streets.",
      image: "https://via.placeholder.com/300x200?text=Street+Food",
      avatar: "https://i.pravatar.cc/40?img=6",
    },
    {
      title: "How TasteCart Became #1",
      category: "News",
      author: "Admin",
      snippet:
        "Our journey from a small idea to Bangladesh's top delivery service.",
      image: "https://via.placeholder.com/300x200?text=TasteCart+Story",
      avatar: "https://i.pravatar.cc/40?img=7",
    },
  ],
  "Food Tips & Tricks": [
    {
      title: "5 Easy Ways to Improve Your Cooking",
      category: "Tips",
      author: "Chef Nabila",
      snippet: "Simple hacks to make your meals restaurant-quality.",
      image: "https://via.placeholder.com/300x200?text=Cooking+Tips",
      avatar: "https://i.pravatar.cc/40?img=8",
    },
    {
      title: "How to Store Spices Properly",
      category: "Tips",
      author: "Rashed",
      snippet: "Extend the life of your spices with these storage secrets.",
      image: "https://via.placeholder.com/300x200?text=Spice+Storage",
      avatar: "https://i.pravatar.cc/40?img=9",
    },
    {
      title: "Budget-Friendly Meal Planning",
      category: "Tips",
      author: "Admin",
      snippet: "Save money without sacrificing taste with these strategies.",
      image: "https://via.placeholder.com/300x200?text=Meal+Planning",
      avatar: "https://i.pravatar.cc/40?img=10",
    },
  ],
  "Recipes & How-to": [
    {
      title: "Classic Chicken Biryani Recipe",
      category: "Recipes",
      author: "Chef Farzana",
      snippet: "Step-by-step guide to the perfect Bangladeshi biryani.",
      image: "https://via.placeholder.com/300x200?text=Chicken+Biryani",
      avatar: "https://i.pravatar.cc/40?img=11",
    },
    {
      title: "Quick 30-Minute Curry",
      category: "Recipes",
      author: "Admin",
      snippet: "Delicious curry in half an hour for busy weeknights.",
      image: "https://via.placeholder.com/300x200?text=Quick+Curry",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      title: "Best Homemade Paratha",
      category: "Recipes",
      author: "Chef Rafi",
      snippet: "Flaky, soft, and perfect with any curry.",
      image: "https://via.placeholder.com/300x200?text=Homemade+Paratha",
      avatar: "https://i.pravatar.cc/40?img=13",
    },
  ],
};

const blogSections = document.getElementById("blogSections");
const categoryButtons = document.querySelectorAll(".category-btn");

function createBlogSection(title, posts) {
  let sectionHTML = `
    <div class="px-4">
      <h2 class="text-2xl font-bold mb-4">${title}</h2>
      <div class="relative">
        <div class="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scroll-smooth">
  `;
  posts.forEach((post) => {
    sectionHTML += `
      <div class="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 min-w-[300px] max-w-[300px] snap-start flex-shrink-0 flex flex-col">
        <div class="relative">
          <img src="${post.image}" alt="${post.title}" class="rounded-t w-full h-56 object-cover">
          <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">${post.category}</span>
        </div>
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="font-bold text-lg mb-2">${post.title}</h3>
          <p class="text-gray-600 mb-4 text-sm flex-grow">${post.snippet}</p>
          <div class="flex items-center mt-auto justify-between">
            <div class="flex items-center space-x-2">
              <img src="${post.avatar}" alt="${post.author}" class="w-8 h-8 rounded-full">
              <span class="text-gray-700 text-sm">${post.author}</span>
            </div>
            <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm">Read More</button>
          </div>
        </div>
      </div>
    `;
  });
  sectionHTML += `</div></div></div>`;
  return sectionHTML;
}

function renderBlogSections(selectedCategory = "") {
  blogSections.innerHTML = "";
  Object.entries(blogData).forEach(([sectionTitle, posts]) => {
    const filteredPosts = selectedCategory
      ? posts.filter((post) => post.category === selectedCategory)
      : posts;
    if (filteredPosts.length) {
      blogSections.innerHTML += createBlogSection(sectionTitle, filteredPosts);
    }
  });
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) =>
        b.classList.remove("bg-red-500", "text-white")
      );
      btn.classList.add("bg-red-500", "text-white");
      renderBlogSections(btn.getAttribute("data-category"));
    });
  });

  renderBlogSections();
});
