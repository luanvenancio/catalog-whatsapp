import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getAdminCatalogWorkspace } from "#/features/catalog/queries/catalogServerQueries";
import { AdminShell } from "#/features/catalog/ui/AdminShell";

export const Route = createFileRoute("/admin")({
	loader: () => getAdminCatalogWorkspace(),
	component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
	const workspace = Route.useLoaderData();
	const catalog = workspace.status === "ready" ? workspace.catalog : undefined;

	return (
		<AdminShell
			businessName={catalog?.name}
		>
			<Outlet />
		</AdminShell>
	);
}
