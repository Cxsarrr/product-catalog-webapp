export function mergeProducts(inventory, pricing) {
	const pricingBySku = new Map(pricing.map(p => [p.sku, p]));
	return inventory.map(inv => ({
		...inv,
		...(pricingBySku.get(inv.sku) || {}),
	}));
}

