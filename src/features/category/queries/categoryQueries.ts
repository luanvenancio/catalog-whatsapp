import { demoCatalogId } from "#/features/catalog/queries/catalogQueries";
import type { CatalogId } from "#/features/catalog/schemas/catalogSchemas";
import type {
	Category,
	CategoryId,
} from "#/features/category/schemas/categorySchemas";

const categories: Category[] = [
	{
		id: "category-bolos" as CategoryId,
		catalogId: demoCatalogId,
		name: "Bolos",
	},
	{
		id: "category-docinhos" as CategoryId,
		catalogId: demoCatalogId,
		name: "Docinhos",
	},
];

export function listCategoriesByCatalog(catalogId: CatalogId): Category[] {
	return categories.filter((category) => category.catalogId === catalogId);
}

export function getCategoryById(categoryId: CategoryId): Category | undefined {
	return categories.find((category) => category.id === categoryId);
}
