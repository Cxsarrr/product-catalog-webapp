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

function renderProducts(products) {
  const container = document.querySelector("#products");

    if (products.length === 0) {
    container.innerHTML =
    '<p class="text-center text-white-500 text-xl py-10">No se encontraron productos</p>';
    return;
  }
  container.classList.add(
    "grid",
    "grid-cols-1",
    "md:grid-cols-2",
    "lg:grid-cols-3",
    "gap-6",
    "mt-8"
  );
  
  
  container.innerHTML = products.map(product => `
    <div class="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-white/10 shadow-2xl hover:translate-y-1 transition-transform duration-200">

      ${product.promo ? `
        <span class="absolute right-4 top-4 bg-red-500 text-white px-3 py-1 rounded text-sm z-10">
          ${product.promo} OFF
        </span>
      ` : ''}
      
      
      <img class="h-64 object-cover border-b border-white-200 w-full" src="${product.images?.[0]}" alt="${product.name}">
      <h3 class="text-xl font-bold text-white-800 px-4 py-2">${product.name ?? 'N/A'}</h3>
      
      
      <p class="text-white-500 px-4 py-2 gap-3">${product.sku}</p>
      
      <span class="block font-bold text-2xl px-4 text-red-500">
      $${product.price ?? 'N/A'}
      </span>
      
    <div class="text-sm py-2 px-4">
      <div class="flex items-center gap-3 py-2">
        <div class="${product.stock < 5 ? 'bg-red-600 animate-pulse' : product.stock < 15 ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'} w-5 h-5 rounded-full text-sm"></div>
        <p class="text-white-800">Solo queda(n) ${product.stock ?? '0'} en stock (hay más unidades en camino).</p>
      </div>
    </div>
    
    <div class="text-sm py-2 px-4">
    <span>${product.rating}/5</span>
    ${
        Array(5).fill(0).map((_, i) => {
          return i < (product.rating ?? 0) ? '⭐' : '';
        }).join('')
      }
    </div>

      <p class="text-1xl absolute right-4 mb-2 py-2 text-white-800">${product.category ?? 'N/A'}</p>
      
      <p class="py-2 px-4 text-1xl text-white-800">
        🏷️${product.tags?.map(tag => `<span>${tag}</span>`).join(' ') || '-'}
      </p>
      <p></p>
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