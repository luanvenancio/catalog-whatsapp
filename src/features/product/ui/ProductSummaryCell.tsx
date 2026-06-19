import type { AdminProductSummary } from "#/features/catalog/queries/catalogServerQueries";
import { ProductStatusBadge } from "#/features/product/ui/ProductStatusBadge";
import { ProductUpdatedAt } from "#/features/product/ui/ProductUpdatedAt";

export function ProductSummaryCell({ product }: { product: AdminProductSummary }) {
	return (
		<div className="flex min-w-0 items-center gap-3 py-1">
			<img alt="" className="size-12 shrink-0 rounded-md border bg-muted object-cover" loading="lazy" src={product.imageUrl} />
			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<p className="truncate font-medium text-foreground">{product.name}</p>
					<span className="sm:hidden"><ProductStatusBadge status={product.status} /></span>
				</div>
				<p className="hidden truncate text-xs text-muted-foreground min-[380px]:block">{product.description}</p>
				<p className="mt-1 truncate text-xs text-muted-foreground">
					{product.priceLabel || "Sem preço informado"}
					<span aria-hidden="true"> · </span>
					Atualizado <ProductUpdatedAt value={product.updatedAt} />
				</p>
			</div>
		</div>
	);
}
