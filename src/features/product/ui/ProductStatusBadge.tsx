import { Badge } from "#/components/ui/badge";
import type { ProductStatus } from "#/features/product/schemas/productSchemas";
import { cn } from "#/lib/utils";

const statusLabel: Record<ProductStatus, string> = {
	draft: "Rascunho",
	published: "Publicado",
	archived: "Arquivado",
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
	return (
		<Badge
			className={cn(
				"h-5 min-w-5 gap-1 rounded-sm border-border bg-background px-1.5 py-0.5 text-xs font-medium shadow-none dark:bg-input/30",
				status === "published" && "text-emerald-700 dark:text-emerald-400",
				status === "draft" && "text-amber-700 dark:text-amber-400",
				status === "archived" && "text-muted-foreground",
			)}
			variant="outline"
		>
			{statusLabel[status]}
		</Badge>
	);
}
