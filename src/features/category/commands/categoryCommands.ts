import { getCatalogById } from "#/features/catalog/queries/catalogQueries";
import type { CatalogId } from "#/features/catalog/schemas/catalogSchemas";
import {
	type Category,
	type CategoryId,
	type CategoryInputError,
	parseCategoryName,
} from "#/features/category/schemas/categorySchemas";
import type { Result } from "#/features/shared/result";

export type CategoryCommandError =
	| CategoryInputError
	| { type: "catalog_not_found"; message: string }
	| { type: "category_not_found"; message: string };

export function createCategory(input: {
	catalogId: CatalogId;
	name: string;
}): Result<Category, CategoryCommandError> {
	const catalog = getCatalogById(input.catalogId);
	if (!catalog) {
		return {
			ok: false,
			error: { type: "catalog_not_found", message: "Catálogo não encontrado." },
		};
	}

	const name = parseCategoryName(input.name);
	if (!name.ok) return name;

	return {
		ok: true,
		value: {
			id: `category-${crypto.randomUUID()}` as CategoryId,
			catalogId: catalog.id,
			name: name.value,
		},
	};
}

export function renameCategory(
	category: Category,
	nameInput: string,
): Result<Category, CategoryCommandError> {
	const name = parseCategoryName(nameInput);
	if (!name.ok) return name;

	return {
		ok: true,
		value: {
			...category,
			name: name.value,
		},
	};
}
