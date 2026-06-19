import type { Catalog } from "#/features/catalog/schemas/catalogSchemas";
import type { Product } from "#/features/product/schemas/productSchemas";

export function getCatalogWhatsappHref(catalog: Catalog): string {
	return buildWhatsappHref(
		catalog.whatsappNumber,
		`Olá! Vi a vitrine da ${catalog.name} e gostaria de saber mais.`,
	);
}

export function getProductWhatsappHref(
	catalog: Catalog,
	product: Product,
): string {
	return buildWhatsappHref(
		catalog.whatsappNumber,
		`Olá! Vi ${product.name} na vitrine da ${catalog.name} e gostaria de saber mais.`,
	);
}

function buildWhatsappHref(whatsappNumber: string, message: string): string {
	return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
