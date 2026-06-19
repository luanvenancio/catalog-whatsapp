import type { Catalog } from "#/features/catalog/schemas/catalogSchemas";

const catalogDraftStorageKey = "catalog.currentDraft";

export type StoredCatalogDraftState =
	| { status: "empty" }
	| { status: "ready"; catalog: Catalog };

export function readCatalogDraft(): StoredCatalogDraftState {
	if (typeof window === "undefined") {
		return { status: "empty" };
	}

	const storedDraft = window.localStorage.getItem(catalogDraftStorageKey);
	if (!storedDraft) {
		return { status: "empty" };
	}

	try {
		return { status: "ready", catalog: JSON.parse(storedDraft) as Catalog };
	} catch {
		window.localStorage.removeItem(catalogDraftStorageKey);
		return { status: "empty" };
	}
}

export function saveCatalogDraft(catalog: Catalog): StoredCatalogDraftState {
	if (typeof window !== "undefined") {
		window.localStorage.setItem(
			catalogDraftStorageKey,
			JSON.stringify(catalog),
		);
	}

	return { status: "ready", catalog };
}
