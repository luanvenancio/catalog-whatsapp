import { createFileRoute } from "@tanstack/react-router";
import { getCurrentBusinessCatalog } from "#/features/catalog/queries/catalogQueries";
import { listCategoriesByCatalog } from "#/features/category/queries/categoryQueries";
import { CategoryAdminList } from "#/features/category/ui/CategoryAdminList";

export const Route = createFileRoute("/admin/categories")({
	component: CategoriesAdminRoute,
});

function CategoriesAdminRoute() {
	const catalog = getCurrentBusinessCatalog();
	const categories = listCategoriesByCatalog(catalog.id);

	return (
		<main className="min-h-dvh bg-zinc-50">
			<CategoryAdminList categories={categories} />
		</main>
	);
}
