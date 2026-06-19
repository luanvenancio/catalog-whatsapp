import { createFileRoute } from "@tanstack/react-router";
import { getCurrentBusinessCatalog } from "#/features/catalog/queries/catalogQueries";
import { CatalogAdminPanel } from "#/features/catalog/ui/CatalogAdminPanel";

export const Route = createFileRoute("/admin/catalog")({
	component: CatalogAdminRoute,
});

function CatalogAdminRoute() {
	const catalog = getCurrentBusinessCatalog();

	return (
		<main className="min-h-dvh bg-zinc-50">
			<CatalogAdminPanel catalog={catalog} />
		</main>
	);
}
