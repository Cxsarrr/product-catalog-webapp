export function applyFilters(allProducts) {
	const searchTerm = (document.querySelector("#searchInput")?.value || "").toLowerCase();
	const category = document.querySelector("#categoryFilter")?.value || "";
	const minPrice = parseFloat(document.querySelector("#minPrice")?.value) || 0;
	const maxPrice = parseFloat(document.querySelector("#maxPrice")?.value) || Infinity;

	return allProducts.filter(p => {
		const name = (p.name || "").toLowerCase();
		const sku = (p.sku || "").toLowerCase();
		const tags = (p.tags || []).map(t => (t || "").toLowerCase());

		const matchesSearch = !searchTerm ||
			name.includes(searchTerm) ||
			sku.includes(searchTerm) ||
			tags.some(t => t.includes(searchTerm));

		const matchesCategory = !category || p.category === category;

		const price = Number(p.price ?? 0);
		const matchesPrice = price >= minPrice && price <= maxPrice;

		return matchesSearch && matchesCategory && matchesPrice;
	});
}

export function setupFilters(getAllProducts, onFiltered) {
	const reapply = () => {
		const filtered = applyFilters(getAllProducts());
		onFiltered(filtered);
	};

	document.querySelector("#searchInput")?.addEventListener("input", reapply);
	document.querySelector("#categoryFilter")?.addEventListener("change", reapply);
	document.querySelector("#minPrice")?.addEventListener("input", reapply);
	document.querySelector("#maxPrice")?.addEventListener("input", reapply);
	document.querySelector("#resetFilters")?.addEventListener("click", () => {
		const search = document.querySelector("#searchInput");
		const category = document.querySelector("#categoryFilter");
		const min = document.querySelector("#minPrice");
		const max = document.querySelector("#maxPrice");
		if (search) search.value = "";
		if (category) category.value = "";
		if (min) min.value = "";
		if (max) max.value = "";
		reapply();
	});
}

export function populateCategories(selectEl, products) {
	if (!selectEl) return;
	const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
	selectEl.innerHTML = '<option value="">Todas las categorías</option>' +
		categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
}

