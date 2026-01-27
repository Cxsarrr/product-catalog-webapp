import { loadPricing } from "./services/pricing.js";
import { loadInventory } from "./services/inventory.js";
import { mergeProducts } from "./services/merge.js";
import { renderProducts } from "./ui/renderProducts.js";
import { setupFilters, applyFilters, populateCategories } from "./services/filters.js";

console.log("Application initialized successfully");

let allProducts = [];
let favorites = [];

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

function handleFavoriteToggle(sku) {
  if (isFavorite(sku)) {
    favorites = favorites.filter(fav => fav !== sku);
  } else {
    favorites.push(sku);
  }
  saveFavorites();

  const filtered = applyFilters(allProducts);
  renderProducts(filtered, isFavorite, handleFavoriteToggle);
}

async function initApp() {
  loadFavorites();

  const pricing = await loadPricing();
  const inventory = await loadInventory();

  allProducts = mergeProducts(inventory, pricing);

  populateCategories(document.querySelector("#categoryFilter"), allProducts);

  renderProducts(allProducts, isFavorite, handleFavoriteToggle);

  setupFilters(() => allProducts, filtered => {
    renderProducts(filtered, isFavorite, handleFavoriteToggle);
  });
}

initApp();
