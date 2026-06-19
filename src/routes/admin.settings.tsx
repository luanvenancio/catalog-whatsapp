import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { CatalogSettingsPage } from "#/features/catalog/ui/settings/CatalogSettingsPage";

const adminRoute = getRouteApi("/admin");

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdminRoute });

function SettingsAdminRoute() {
	const workspace = adminRoute.useLoaderData();
	if (workspace.status === "error") return <main className="mx-auto max-w-3xl px-4 py-6"><Alert variant="destructive"><AlertTitle>Configurações indisponíveis</AlertTitle><AlertDescription>{workspace.message}</AlertDescription></Alert></main>;
	if (workspace.status === "empty") return <main className="mx-auto max-w-3xl px-4 py-6"><Alert><AlertTitle>Crie sua vitrine primeiro</AlertTitle><AlertDescription>A identidade poderá ser configurada depois que a vitrine for criada.</AlertDescription></Alert></main>;
	return <main><CatalogSettingsPage catalog={workspace.catalog} /></main>;
}
