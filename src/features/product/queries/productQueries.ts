import { demoCatalogId } from "#/features/catalog/queries/catalogQueries";
import type {
	Catalog,
	CatalogId,
} from "#/features/catalog/schemas/catalogSchemas";
import type { CategoryId } from "#/features/category/schemas/categorySchemas";
import type {
	Product,
	ProductId,
} from "#/features/product/schemas/productSchemas";

const products: Product[] = [
	{
		id: "product-bolo-cenoura" as ProductId,
		catalogId: demoCatalogId,
		categoryId: "category-bolos" as CategoryId,
		name: "Bolo de cenoura",
		description: "Massa fofinha com cobertura cremosa de chocolate.",
		imageUrl: "/logo512.png",
		priceLabel: "A partir de R$ 42",
		status: "published",
	},
	{
		id: "product-brigadeiros" as ProductId,
		catalogId: demoCatalogId,
		categoryId: "category-docinhos" as CategoryId,
		name: "Brigadeiros sortidos",
		description: "Caixa com sabores clássicos para festas e presentes.",
		imageUrl: "/logo512.png",
		priceLabel: "Sob consulta",
		status: "published",
	},
	{
		id: "product-torta-limao" as ProductId,
		catalogId: demoCatalogId,
		categoryId: "category-bolos" as CategoryId,
		name: "Torta de limão",
		description: "Base crocante, creme cítrico e merengue tostado.",
		imageUrl: "/logo512.png",
		status: "published",
	},
];

type ProductConversationContext = {
	productName: string;
	catalogName: string;
	whatsappHref: string;
};

function getProductById(productId: ProductId): Product | undefined {
	return products.find((product) => product.id === productId);
}

export function listVisibleProductsByCatalog(catalogId: CatalogId): Product[] {
	return products.filter(
		(product) => product.catalogId === catalogId && product.status === "published",
	);
}

export function listProductsForCatalogAdmin(catalogId: CatalogId): Product[] {
	return products.filter((product) => product.catalogId === catalogId);
}

export function getProductConversationContext(
	catalog: Catalog,
	productId: ProductId,
): ProductConversationContext | undefined {
	const product = getProductById(productId);

	if (!product || product.catalogId !== catalog.id) {
		return undefined;
	}

	const message = encodeURIComponent(
		`Olá! Quero saber mais sobre ${product.name} da vitrine ${catalog.name}.`,
	);

	return {
		productName: product.name,
		catalogName: catalog.name,
		whatsappHref: `https://wa.me/${catalog.whatsappNumber}?text=${message}`,
	};
}
