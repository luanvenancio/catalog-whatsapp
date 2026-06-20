import { getCatalogById } from "#/features/catalog/queries/catalogQueries"
import type { CatalogId } from "#/features/catalog/schemas/catalogSchemas"
import { getCategoryById } from "#/features/category/queries/categoryQueries"
import type { CategoryId } from "#/features/category/schemas/categorySchemas"
import {
  type Product,
  type ProductId,
  type ProductInputError,
  type ProductPresentationInput,
  parseProductDescription,
  parseProductImageUrl,
  parseProductName,
} from "#/features/product/schemas/productSchemas"
import type { Result } from "#/features/shared/result"

export type ProductCommandError =
  | ProductInputError
  | { type: "catalog_not_found"; message: string }
  | { type: "category_not_found"; message: string }
  | { type: "category_from_another_catalog"; message: string }

export function createProduct(input: {
  catalogId: CatalogId
  categoryId?: CategoryId
  presentation: ProductPresentationInput
}): Result<Product, ProductCommandError> {
  const catalog = getCatalogById(input.catalogId)
  if (!catalog) {
    return {
      ok: false,
      error: { type: "catalog_not_found", message: "Catálogo não encontrado." },
    }
  }

  const presentation = parseProductPresentation(input.presentation)
  if (!presentation.ok) return presentation

  if (input.categoryId) {
    const category = getCategoryById(input.categoryId)
    if (!category) {
      return {
        ok: false,
        error: {
          type: "category_not_found",
          message: "Categoria não encontrada.",
        },
      }
    }

    if (category.catalogId !== catalog.id) {
      return {
        ok: false,
        error: {
          type: "category_from_another_catalog",
          message: "A categoria deve pertencer ao mesmo catálogo do produto.",
        },
      }
    }
  }

  return {
    ok: true,
    value: {
      id: `product-${crypto.randomUUID()}` as ProductId,
      catalogId: catalog.id,
      categoryId: input.categoryId,
      ...presentation.value,
      status: "draft",
    },
  }
}

export function updateProductPresentation(
  product: Product,
  input: ProductPresentationInput,
): Result<Product, ProductCommandError> {
  const presentation = parseProductPresentation(input)
  if (!presentation.ok) return presentation

  return {
    ok: true,
    value: {
      ...product,
      ...presentation.value,
    },
  }
}

export function assignProductToCategory(
  product: Product,
  categoryId: CategoryId,
): Result<Product, ProductCommandError> {
  const category = getCategoryById(categoryId)

  if (!category) {
    return {
      ok: false,
      error: {
        type: "category_not_found",
        message: "Categoria não encontrada.",
      },
    }
  }

  if (category.catalogId !== product.catalogId) {
    return {
      ok: false,
      error: {
        type: "category_from_another_catalog",
        message: "A categoria deve pertencer ao mesmo catálogo do produto.",
      },
    }
  }

  return { ok: true, value: { ...product, categoryId } }
}

export function removeProductFromCategory(product: Product): Result<Product, never> {
  const { categoryId: _categoryId, ...productWithoutCategory } = product

  return { ok: true, value: productWithoutCategory }
}

function parseProductPresentation(
  input: ProductPresentationInput,
): Result<ProductPresentationInput, ProductInputError> {
  const name = parseProductName(input.name)
  if (!name.ok) return name

  const description = parseProductDescription(input.description)
  if (!description.ok) return description

  const imageUrl = parseProductImageUrl(input.imageUrl)
  if (!imageUrl.ok) return imageUrl

  return {
    ok: true,
    value: {
      name: name.value,
      description: description.value,
      imageUrl: imageUrl.value,
      priceLabel: input.priceLabel?.trim() || undefined,
    },
  }
}
