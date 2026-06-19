import { createFileRoute } from "@tanstack/react-router";
import { getPublicCatalogWorkspace } from "#/features/catalog/queries/catalogServerQueries";
import { CatalogDraftFallback } from "#/features/catalog/ui/CatalogDraftFallback";
import { PublicCatalogView } from "#/features/catalog/ui/PublicCatalogView";

export const Route = createFileRoute("/catalogs/$catalogSlug")({
	loader: ({ params }) =>
		getPublicCatalogWorkspace({ data: { catalogSlug: params.catalogSlug } }),
	component: PublicCatalogRoute,
});

function PublicCatalogRoute() {
	const { catalogSlug } = Route.useParams();
	const workspace = Route.useLoaderData();

	if (workspace.status === "not_found") {
		return <CatalogDraftFallback catalogSlug={catalogSlug} />;
	}

	if (workspace.status === "error") {
		return (
			<main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4">
				<section className="max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
					<p className="text-sm font-semibold text-red-700">Erro</p>
					<h1 className="mt-2 text-2xl font-bold text-zinc-950">
						Vitrine indisponível
					</h1>
					<p className="mt-2 text-zinc-600">{workspace.message}</p>
				</section>
			</main>
		);
	}

	return (
		<PublicCatalogView
			catalog={workspace.catalog}
			categories={workspace.categories}
			products={workspace.products}
		/>
	);
}
