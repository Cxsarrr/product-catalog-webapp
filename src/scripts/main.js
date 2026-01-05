console.log("Application initialized successfull")

let allProducts = [];

async function loadPricing(){
  try{
      const response = await fetch("data/pricing.json");
      if(!response.ok){
        throw new Error(`Error status: ${response.status}`);
      }
      return await response.json();

     }catch (error){
        console.error("Error loading data: ", error)
  }
}

function renderProducts(products){
    const container = document.querySelector("#products");
    container.innerHTML = products.map(product => `
      <div>
        <h3>${product.name ?? 'N/A'}</h3>
        <p>SKU: ${product.sku}</p>
        <p>Categoría: ${product.category ?? 'N/A'}</p>
        <p>Stock: ${product.stock ?? '0'}</p>
        <p>Precio: $${product.price ?? 'N/A'} ${product.currency ?? ''}</p>
        <p>Promo: ${product.promo ?? '-'}</p>
        <p>Rating: ${product.rating ?? '-'}</p>
        <p>Tags: ${product.tags?.map(tag => `<span>${tag}</span>`).join(' ') || '-'}</p>
        <img src="${product.images?.[0]}" alt="${product.name}">
      </div>
    `).join('');
}

async function loadInventory(){
  try{
    const response = await fetch("data/inventory.xml");

    if(!response.ok){
      throw new Error(`Error status: ${response.status}`);
    }
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText,'text/xml')

    const productNodes = xmlDoc.querySelectorAll('product');
    const products = [];
  
    productNodes.forEach(node => {
      const product = {
        sku: node.getAttribute('sku'),
        name: node.querySelector('name')?.textContent,
        category: node.querySelector('category')?.textContent,
        stock: node.querySelector('stock')?.textContent,
        images: Array.from(node.querySelectorAll('img')).map(img => img.textContent),
      }
      products.push(product);
    });
    return products;
  }
  catch (error){
    console.error(error)
  }
}

function mergeProducts(inventory, pricing){
    return inventory.map(invProduct =>{
      const priceData = pricing.find(p => p.sku === invProduct.sku);
      return {
    ...invProduct,
    ...priceData
    };
   });
}

function setupFilters(){
  const searchInput = document.querySelector('#searchInput'); 
  const categorySelect = document.querySelector('#categoryFilter');
  const minPrice = document.querySelector('#minPrice');
  const maxPrice = document.querySelector('#maxPrice');
  const resetBtn = document.querySelector('#resetFilters');

  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);
  minPrice.addEventListener('input', applyFilters);
  maxPrice.addEventListener('input', applyFilters);
  resetBtn.addEventListener('click', resetFilters);
  
  populateCategories(categorySelect);
}


function populateCategories(selectEl){
  const categories = [...new Set(allProducts.map(p => p.category ))].sort();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    selectEl.appendChild(opt);
  });
}

function applyFilters(){
  const searchTerm = document.querySelector('#searchInput').value.toLowerCase();
  const category = document.querySelector('#categoryFilter').value;
  const minPrice = parseFloat(document.querySelector('#minPrice')?.value) || 0;
  const maxPrice = parseFloat(document.querySelector('#maxPrice')?.value) || Infinity;

  const filtered = allProducts.filter(p => {
    const matchesText = (p.name || '').toLowerCase().includes(searchTerm) ||
                        (p.sku || '').toLowerCase().includes(searchTerm);
    const matchesCategory = !category || p.category === category;
    const price = Number(p.price) || 0;
    const matchesPrice = price >= minPrice && price <= maxPrice;
    return matchesText && matchesCategory && matchesPrice;
  });

  renderProducts(filtered);
}

function resetFilters(){
  document.querySelector('#searchInput').value = '';
  document.querySelector('#categoryFilter').value = '';
  document.querySelector('#minPrice').value = '';
  document.querySelector('#maxPrice').value = '';
  
  applyFilters();
}

async function initApp(){
    const pricing = await loadPricing();
    const inventory = await loadInventory();
    
    allProducts = mergeProducts(inventory, pricing);
    renderProducts(allProducts);
    setupFilters();
}

initApp();