import type { CatalogId } from "#/features/catalog/schemas/catalogSchemas"
import type { CategoryId } from "#/features/category/schemas/categorySchemas"
import type { Result } from "#/features/shared/result"

export type ProductId = string & { readonly brand: "ProductId" }
export type ProductStatus = "draft" | "published" | "archived"

export type Product = {
  id: ProductId
  catalogId: CatalogId
  categoryId?: CategoryId
  name: string
  description: string
  imageUrl: string
  priceLabel?: string
  status: ProductStatus
}

export type ProductInputError =
  | { type: "invalid_product_name"; message: string }
  | { type: "invalid_product_description"; message: string }
  | { type: "invalid_product_image"; message: string }

export type ProductPresentationInput = {
  name: string
  description: string
  imageUrl: string
  priceLabel?: string
}

export function parseProductName(name: string): Result<string, ProductInputError> {
  const trimmedName = name.trim()

  if (trimmedName.length < 2) {
    return {
      ok: false,
      error: {
        type: "invalid_product_name",
        message: "O nome do produto deve ter pelo menos 2 caracteres.",
      },
    }
  }

  return { ok: true, value: trimmedName }
}

export function parseProductDescription(description: string): Result<string, ProductInputError> {
  const trimmedDescription = description.trim()

  if (trimmedDescription.length < 8) {
    return {
      ok: false,
      error: {
        type: "invalid_product_description",
        message: "A descrição deve ajudar o visitante a entender o item.",
      },
    }
  }

  return { ok: true, value: trimmedDescription }
}

export function parseProductImageUrl(imageUrl: string): Result<string, ProductInputError> {
  const trimmedImageUrl = imageUrl.trim()

  if (!trimmedImageUrl.startsWith("/")) {
    return {
      ok: false,
      error: {
        type: "invalid_product_image",
        message: "A imagem deve apontar para um caminho público da vitrine.",
      },
    }
  }

  return { ok: true, value: trimmedImageUrl }
}
