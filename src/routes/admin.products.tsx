import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { ButtonLink } from "#/components/ui/button-link";
import { Card, CardContent } from "#/components/ui/card";
import { ProductAdminWorkspace } from "#/features/product/ui/ProductAdminList";

const adminRoute = getRouteApi("/admin");

export const Route = createFileRoute("/admin/products")({
	validateSearch: z.object({
		search: z.string().trim().optional().catch(undefined),
		status: z.enum(["draft", "published", "archived"]).optional().catch(undefined),
		page: z.coerce.number().int().positive().optional().catch(1),
		pageSize: z.coerce.number().pipe(z.union([z.literal(10), z.literal(25), z.literal(50)])).optional().catch(10),
	}),
	component: ProductsAdminRoute,
});

function ProductsAdminRoute() {
	const workspace = adminRoute.useLoaderData();
	const listSearch = Route.useSearch();

	if (workspace.status === "error") {
		return (
			<main className="mx-auto w-full max-w-3xl px-4 py-6">
				<Alert variant="destructive">
					<AlertTitle>Produtos indisponiveis</AlertTitle>
					<AlertDescription>{workspace.message}</AlertDescription>
				</Alert>
			</main>
		);
	}

	if (workspace.status === "empty") {
		return (
			<main className="mx-auto w-full max-w-3xl px-4 py-6">
				<Card className="border-dashed shadow-none">
					<CardContent className="grid gap-4 p-6">
						<p className="text-sm text-muted-foreground">
							Crie sua vitrine antes de adicionar produtos.
						</p>
						<ButtonLink className="w-fit" to="/admin">
							Criar vitrine
						</ButtonLink>
					</CardContent>
				</Card>
			</main>
		);
	}

	return (
		<main>
			<ProductAdminWorkspace catalogId={workspace.catalog.id} listSearch={listSearch} products={workspace.products} />
		</main>
	);
}
