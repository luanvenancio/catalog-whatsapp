import type {
	Catalog,
	CatalogId,
	CatalogSlug,
} from "#/features/catalog/schemas/catalogSchemas";

export const demoCatalogId = "catalog-bela-fatia" as CatalogId;

const catalogs: Catalog[] = [
	{
		id: demoCatalogId,
		name: "Bela Fatia",
		slug: "bela-fatia" as CatalogSlug,
		whatsappNumber: "5511999999999",
		status: "published",
	},
];

export function getCatalogById(catalogId: CatalogId): Catalog | undefined {
	return catalogs.find((catalog) => catalog.id === catalogId);
}

export function getPublicCatalog(catalogSlug: string): Catalog | undefined {
	return catalogs.find(
		(catalog) => catalog.slug === catalogSlug && catalog.status === "published",
	);
}

export function getCurrentBusinessCatalog(): Catalog {
	return catalogs[0];
}
