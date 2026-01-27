export function getSkuFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const sku = params.get("sku");

  if (!sku) {
    console.error("SKU no encontrado en la URL");
    return null;
  }
  console.log("SKU Recibido:", sku);
  return sku;
}

export function findProductBySku(sku, products) {
  return products.find(p => p.sku === sku) || null;
}
