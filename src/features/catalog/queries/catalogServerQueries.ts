import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";
import { db } from "#/db/client";
import { catalogs, categories, products } from "#/db/schema";
import type {
	Catalog,
	CatalogId,
	CatalogSlug,
} from "#/features/catalog/schemas/catalogSchemas";
import type { Category, CategoryId } from "#/features/category/schemas/categorySchemas";
import type {
	Product,
	ProductId,
} from "#/features/product/schemas/productSchemas";

export type AdminCatalogWorkspace =
	| { status: "ready"; catalog: Catalog; products: AdminProductSummary[] }
	| { status: "empty" }
	| { status: "error"; message: string };

export type AdminProductSummary = Product & {
	updatedAt: string;
};

export type PublicCatalogWorkspace =
	| { status: "ready"; catalog: Catalog; categories: Category[]; products: Product[] }
	| { status: "not_found" }
	| { status: "error"; message: string };

export const getAdminCatalogWorkspace = createServerFn({
	method: "GET",
}).handler(async (): Promise<AdminCatalogWorkspace> => {
	try {
		const [catalogRow] = await db.select().from(catalogs).limit(1);

		if (!catalogRow) {
			return { status: "empty" };
		}

		const productRows = await db
			.select()
			.from(products)
			.where(eq(products.catalogId, catalogRow.id));

		return {
			status: "ready",
			catalog: mapCatalogRow(catalogRow),
			products: productRows.map(mapAdminProductRow),
		};
	} catch {
		return {
			status: "error",
			message:
				"Nao foi possivel carregar a vitrine. Confira se o PostgreSQL esta rodando e migrado.",
		};
	}
});

export const getPublicCatalogWorkspace = createServerFn({ method: "GET" })
	.validator((input: { catalogSlug: string }) => input)
	.handler(async ({ data }): Promise<PublicCatalogWorkspace> => {
		try {
			const [catalogRow] = await db
				.select()
				.from(catalogs)
				.where(eq(catalogs.slug, data.catalogSlug))
				.limit(1);

			if (!catalogRow || !catalogRow.isPublished) {
				return { status: "not_found" };
			}

			const categoryRows = await db
				.select()
				.from(categories)
				.where(eq(categories.catalogId, catalogRow.id))
				.orderBy(asc(categories.name));

			const productRows = await db
				.select()
				.from(products)
				.where(and(eq(products.catalogId, catalogRow.id), eq(products.isVisible, true)))
				.orderBy(asc(products.name));

			return {
				status: "ready",
				catalog: mapCatalogRow(catalogRow),
				categories: categoryRows.map(mapCategoryRow),
				products: productRows.map(mapProductRow),
			};
		} catch {
			return {
				status: "error",
				message: "Não foi possível carregar esta vitrine agora.",
			};
		}
	});

function mapCatalogRow(row: typeof catalogs.$inferSelect): Catalog {
	return {
		id: row.id as CatalogId,
		name: row.name,
		slug: row.slug as CatalogSlug,
		whatsappNumber: row.whatsappNumber,
		description: row.description ?? undefined,
		coverImageUrl: row.coverImageUrl ?? undefined,
		status: row.isPublished ? "published" : "draft",
	};
}

function mapCategoryRow(row: typeof categories.$inferSelect): Category {
	return {
		id: row.id as CategoryId,
		catalogId: row.catalogId as CatalogId,
		name: row.name,
	};
}

function mapProductRow(row: typeof products.$inferSelect): Product {
	return {
		id: row.id as ProductId,
		catalogId: row.catalogId as CatalogId,
		categoryId: row.categoryId ? (row.categoryId as CategoryId) : undefined,
		name: row.name,
		description: row.description,
		imageUrl: row.imageUrl,
		priceLabel: row.priceLabel ?? undefined,
		status: row.isVisible ? "published" : "draft",
	};
}

function mapAdminProductRow(
	row: typeof products.$inferSelect,
): AdminProductSummary {
	return {
		...mapProductRow(row),
		updatedAt: row.updatedAt.toISOString(),
	};
}
