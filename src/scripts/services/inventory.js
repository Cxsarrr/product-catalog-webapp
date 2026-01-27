import { fetchText } from "./api.js";

export async function loadInventory() {
	try {
		const xmlText = await fetchText("../../data/inventory.xml");
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(xmlText, "text/xml");

		const productNodes = xmlDoc.querySelectorAll("product");
		const products = [];

		productNodes.forEach(node => {
			products.push({
				sku: node.getAttribute("sku"),
				name: node.querySelector("name")?.textContent ?? "",
				category: node.querySelector("category")?.textContent ?? "",
				stock: Number(node.querySelector("stock")?.textContent ?? 0),
				images: Array.from(node.querySelectorAll("img")).map(img => img.textContent ?? ""),
			});
		});

		return products;
	} catch (error) {
		console.error("Error loading inventory:", error);
		return [];
	}
}

