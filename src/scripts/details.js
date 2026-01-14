function getSkuFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");

    if(!sku){
        console.error("SKU no encontrado en la URL");
        return null;
    }
        console.log("SKU Recibido:", sku)
        return sku;
}

async function loadPricing(){
    try{
    const response = await fetch("data/pricing.json")
        if(!response.ok){
            throw new Error(`Error loading data: ${response.status}`);
        }
        return await response.json(); 
    }
    catch(error){
        console.error(error)
        return null;
    }
}



async function loadInventory(){
    try{
        const response = await fetch("data/inventory.xml")
        if(!response.ok){
            throw new Error(`Error loading data: ${response.status}`);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml")

        const productNodes = xmlDoc.querySelectorAll("product")
        const products = []

        productNodes.forEach(node => {
            products.push({
                sku: node.getAttribute("sku"),
                name: node.querySelector("name")?.textContent,
                category:node.querySelector("category")?.textContent,
                stock:Number(node.querySelector("stock")?.textContent ?? 0),
                images:Array.from(node.querySelectorAll("img")).map(img=> img.textContent ),
            });
        });
        return products;
    }catch(error){
        console.error("Error loading data:", error)
        return null;
    }
}



function mergeProducts(sku, inventory, pricing) {
  const invProduct = inventory.find(p => p.sku === sku);
  const priceProduct = pricing.find(p => p.sku === sku);

  if (!invProduct) return null;

  return {
    ...invProduct,
    ...priceProduct
  };
}

function findProducts(){

}

function renderProduct(product) {
  const container = document.querySelector("#productInfo");

  container.innerHTML = `

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      ${
        product.images.map(img => `
          <img 
            src="${img}" 
            alt="${product.name}"
            style="width:100%; max-width:600px; margin-bottom:10px;"
          />
        `).join('')
      }
    </div>

    <h1>${product.name}</h1>
    <p>SKU: ${product.sku}</p>
    <p>Precio: $${product.price ?? 'N/A'}</p>
    <p>Stock: ${product.stock}</p>
  `;
}


async function initDetailsPage() {
  const sku = getSkuFromUrl();
  if (!sku) return;

  const pricing = await loadPricing();
  const inventory = await loadInventory();

  const product = mergeProducts(sku, inventory, pricing);
  if (!product) {
    console.error("Producto no encontrado");
    return;
  }

  renderProduct(product);
}


initDetailsPage();