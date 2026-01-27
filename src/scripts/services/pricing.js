import { fetchJson } from "./api.js";

export async function loadPricing() {
	try {
		return await fetchJson("../../data/pricing.json");
	} catch (error) {
		console.error("Error loading pricing:", error);
		return [];
	}
}

