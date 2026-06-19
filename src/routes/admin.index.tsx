import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { CatalogSetupWorkspace } from "#/features/catalog/ui/CatalogSetupWorkspace";

const adminRoute = getRouteApi("/admin");

export const Route = createFileRoute("/admin/")({
	component: AdminDashboardRoute,
});

function AdminDashboardRoute() {
	const workspace = adminRoute.useLoaderData();

	return <CatalogSetupWorkspace workspace={workspace} />;
}
