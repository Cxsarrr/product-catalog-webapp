export function renderProducts(products, isFavorite, onToggleFavorite) {
	const container = document.querySelector("#products");
	if (!container) return;

	if (!products || products.length === 0) {
		container.innerHTML =
			'<p class="text-center text-white/80 text-xl py-10">No se encontraron productos</p>';
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
							(product.stock ?? 0) < 5
								? 'bg-red-600 animate-pulse'
								: (product.stock ?? 0) < 15
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
					class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-semibold transition text-center block mb-2">
					View Details
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
		btn.addEventListener("click", e => {
			e.stopPropagation();
			const sku = e.currentTarget.dataset.sku;
			onToggleFavorite(sku);
		});
	});
}

