import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const catalogs = pgTable(
	"catalogs",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: varchar("name", { length: 120 }).notNull(),
		slug: varchar("slug", { length: 80 }).notNull(),
		whatsappNumber: varchar("whatsapp_number", { length: 15 }).notNull(),
		description: varchar("description", { length: 160 }),
		coverImageUrl: text("cover_image_url"),
		isPublished: boolean("is_published").default(false).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [uniqueIndex("catalogs_slug_unique").on(table.slug)],
);

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		catalogId: uuid("catalog_id")
			.notNull()
			.references(() => catalogs.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 80 }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("categories_catalog_id_idx").on(table.catalogId),
		uniqueIndex("categories_catalog_id_name_unique").on(
			table.catalogId,
			table.name,
		),
	],
);

export const products = pgTable(
	"products",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		catalogId: uuid("catalog_id")
			.notNull()
			.references(() => catalogs.id, { onDelete: "cascade" }),
		categoryId: uuid("category_id").references(() => categories.id, {
			onDelete: "set null",
		}),
		name: varchar("name", { length: 120 }).notNull(),
		description: text("description").notNull(),
		imageUrl: text("image_url").notNull(),
		priceLabel: varchar("price_label", { length: 80 }),
		isVisible: boolean("is_visible").default(true).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("products_catalog_id_idx").on(table.catalogId),
		index("products_category_id_idx").on(table.categoryId),
	],
);

export const catalogsRelations = relations(catalogs, ({ many }) => ({
	categories: many(categories),
	products: many(products),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	catalog: one(catalogs, {
		fields: [categories.catalogId],
		references: [catalogs.id],
	}),
	products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
	catalog: one(catalogs, {
		fields: [products.catalogId],
		references: [catalogs.id],
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
}));

export type CatalogRow = typeof catalogs.$inferSelect;
export type NewCatalogRow = typeof catalogs.$inferInsert;
export type CategoryRow = typeof categories.$inferSelect;
export type NewCategoryRow = typeof categories.$inferInsert;
export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
