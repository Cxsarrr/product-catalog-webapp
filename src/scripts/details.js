import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { loadPricing } from "./services/pricing.js";
import { loadInventory } from "./services/inventory.js";
import { mergeProducts } from "./services/merge.js";
import { getSkuFromUrl, findProductBySku } from "./services/utils.js";
import { renderProductDetails } from "./ui/renderProductDetails.js";

// Hacer Swiper disponible globalmente
window.swiperBundle = { Swiper, Navigation, Pagination };

async function initDetailsPage() {
  const sku = getSkuFromUrl();
  if (!sku) return;

  try {
    const pricing = await loadPricing();
    const inventory = await loadInventory();
    const allProducts = mergeProducts(inventory, pricing);

    const product = findProductBySku(sku, allProducts);
    if (!product) {
      console.error("Producto no encontrado");
      return;
    }

    renderProductDetails(product);
  } catch (error) {
    console.error("Error initializing details page:", error);
  }
}

initDetailsPage();