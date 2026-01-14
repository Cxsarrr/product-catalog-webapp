console.log("Application initialized successfull");

let allProducts = [];
let favorites = [];


async function loadPricing() {
  try {
    const response = await fetch("data/pricing.json");
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
}

function loadFavorites() {
  const stored = localStorage.getItem("favorites");
  favorites = stored ? JSON.parse(stored) : [];
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function isFavorite(sku) {
  return favorites.includes(sku);
}

function toggleFavorite(e) {
  e.stopPropagation();

  const sku = e.currentTarget.dataset.sku;

  if (isFavorite(sku)) {
    favorites = favorites.filter(fav => fav !== sku);
  } else {
    favorites.push(sku);
  }

  saveFavorites();

  applyFilters();
}


function renderProducts(products) {
  const container = document.querySelector("#products");

  if (products.length === 0) {
    container.innerHTML =
      '<p class="text-center text-white-500 text-xl py-10">No se encontraron productos</p>';
    return;
  }

  container.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8";

  container.innerHTML = products
    .map(product => `
      <div class="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-white/10 shadow-2xl hover:translate-y-1 transition-transform duration-200">

        ${product.promo ? `
          <span class="absolute right-4 top-4 bg-red-500 text-white px-3 py-1 rounded text-sm z-10">
            ${product.promo} OFF
          </span>
        ` : ''}

        <img class="h-64 object-cover border-b border-white/20 w-full"
             src="${product.images?.[0] ?? ''}"
             alt="${product.name ?? ''}">

        
        <button
          class="favoriteBtn absolute right-4 top-22 text-3xl cursor-pointer"
          data-sku="${product.sku}">
          ${isFavorite(product.sku) ? '❤️' : '🤍'}
        </button>

        <h3 class="text-xl font-bold px-4 py-2">${product.name ?? 'N/A'}</h3>

        <p class="text-gray-400 px-4">${product.sku}</p>

        <span class="block font-bold text-2xl px-4 text-red-500">
          $${product.price ?? 'N/A'} ${product.currency ?? ''}
        </span>

       
        <div class="text-sm py-2 px-4">
          <div class="flex items-center gap-3">
            <div class="${
              product.stock < 5
                ? 'bg-red-600 animate-pulse'
                : product.stock < 15
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-green-500 animate-pulse'
            } w-4 h-4 rounded-full"></div>

            <p>
              Solo queda(n) ${product.stock ?? '0'} en stock
              (hay más unidades en camino).
            </p>
          </div>
        </div>

        
        <div class="px-4 py-2 text-sm">
          <span>${product.rating ?? 0}/5</span>
          ${
            Array(5).fill(0).map((_, i) =>
              i < (product.rating ?? 0) ? '⭐' : '☆'
            ).join('')
          }
        </div>

        <a href="details.html?sku=${product.sku}"
          class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-semibold transition text-center block">
          Ver detalles
        </a>

        

        <p class="absolute bottom-4 right-4 text-sm text-gray-400">
          ${product.category ?? 'N/A'}
        </p>

        
        <p class="px-4 py-3 text-sm">
          🏷️ ${
            product.tags?.map(tag =>
              `<span class="bg-slate-800 rounded py-1 px-4 text-sm mr-1">${tag}</span>`
            ).join(' ') || '-'
          }
        </p>
      </div>
    `)
    .join("");

  
  document.querySelectorAll(".favoriteBtn").forEach(btn => {
    btn.addEventListener("click", toggleFavorite);
  });
}

async function loadInventory() {
  try {
    const response = await fetch("data/inventory.xml");
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const productNodes = xmlDoc.querySelectorAll("product");
    const products = [];

    productNodes.forEach(node => {
      products.push({
        sku: node.getAttribute("sku"),
        name: node.querySelector("name")?.textContent,
        category: node.querySelector("category")?.textContent,
        stock: Number(node.querySelector("stock")?.textContent ?? 0),
        images: Array.from(node.querySelectorAll("img")).map(img => img.textContent),
      });
    });

    return products;
  } catch (error) {
    console.error(error);
  }
}


function mergeProducts(inventory, pricing) {
  return inventory.map(inv => ({
    ...inv,
    ...pricing.find(p => p.sku === inv.sku),
  }));
}


function setupFilters() {
  document.querySelector("#searchInput").addEventListener("input", applyFilters);
  document.querySelector("#categoryFilter").addEventListener("change", applyFilters);
  document.querySelector("#minPrice").addEventListener("input", applyFilters);
  document.querySelector("#maxPrice").addEventListener("input", applyFilters);
  document.querySelector("#resetFilters").addEventListener("click", resetFilters);

  populateCategories(document.querySelector("#categoryFilter"));
}

function populateCategories(selectEl) {
  const categories = [...new Set(allProducts.map(p => p.category))].sort();
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    selectEl.appendChild(opt);
  });
}

function applyFilters() {
  const searchTerm = document.querySelector("#searchInput").value.toLowerCase();
  const category = document.querySelector("#categoryFilter").value;
  const minPrice = parseFloat(document.querySelector("#minPrice").value) || 0;
  const maxPrice = parseFloat(document.querySelector("#maxPrice").value) || Infinity;

  const filtered = allProducts.filter(p => {
    const textMatch =
      (p.name ?? "").toLowerCase().includes(searchTerm) ||
      (p.sku ?? "").toLowerCase().includes(searchTerm);

    const categoryMatch = !category || p.category === category;
    const price = Number(p.price) || 0;
    const priceMatch = price >= minPrice && price <= maxPrice;

    return textMatch && categoryMatch && priceMatch;
  });

  renderProducts(filtered);
}

function resetFilters() {
  document.querySelector("#searchInput").value = "";
  document.querySelector("#categoryFilter").value = "";
  document.querySelector("#minPrice").value = "";
  document.querySelector("#maxPrice").value = "";
  applyFilters();
}


async function initApp() {
  loadFavorites();

  const pricing = await loadPricing();
  const inventory = await loadInventory();

  allProducts = mergeProducts(inventory, pricing);
  renderProducts(allProducts);
  setupFilters();
}

initApp();
