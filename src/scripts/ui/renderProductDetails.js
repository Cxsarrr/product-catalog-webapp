export function renderProductDetails(product) {
  const { Swiper, Navigation, Pagination } = window.swiperBundle;
  Swiper.use([Navigation, Pagination]);
  
  const container = document.querySelector("#productInfo");
  if (!container) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

      <div class="flex justify-center">
        <div class="swiper w-full max-w-[600px]">
          <div class="swiper-wrapper">
            ${
              (product.images || []).map(img => `
                <div class="swiper-slide flex justify-center">
                  <img 
                    src="${img}" 
                    alt="${product.name}"
                    class="w-full max-w-[600px] rounded-xl object-cover"
                  />
                </div>
              `).join('')
            }
          </div>

          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </div>

      <div class="text-white space-y-3">
        <h1 class="text-3xl font-bold">${product.name}</h1>
        <p class="text-gray-400">SKU: ${product.sku}</p>
        <p class="text-2xl font-semibold text-red-500">
          $${product.price ?? 'N/A'} ${product.currency ?? ''}
        </p>
        <p>Stock: ${product.stock ?? 0}</p>
        <p class="text-gray-300">Categoría: ${product.category ?? 'N/A'}</p>
        ${product.rating ? `
          <div class="text-sm">
            <span>${product.rating}/5</span>
            ${Array(5).fill(0).map((_, i) => i < product.rating ? '⭐' : '☆').join('')}
          </div>
        ` : ''}
      </div>

    </div>
  `;

  new Swiper('.swiper', {
    loop: (product.images || []).length > 2,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
