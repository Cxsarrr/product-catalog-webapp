// Centralized API utilities

export async function fetchJson(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Error loading JSON from ${url}: ${response.status}`);
	}
	return response.json();
}

export async function fetchText(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Error loading text from ${url}: ${response.status}`);
	}
	return response.text();
}

