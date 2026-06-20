import type { CatalogId } from "#/features/catalog/schemas/catalogSchemas"
import type { Result } from "#/features/shared/result"

export type CategoryId = string & { readonly brand: "CategoryId" }

export type Category = {
  id: CategoryId
  catalogId: CatalogId
  name: string
}

export type CategoryInputError = {
  type: "invalid_category_name"
  message: string
}

export function parseCategoryName(name: string): Result<string, CategoryInputError> {
  const trimmedName = name.trim()

  if (trimmedName.length < 2) {
    return {
      ok: false,
      error: {
        type: "invalid_category_name",
        message: "O nome da categoria deve ter pelo menos 2 caracteres.",
      },
    }
  }

  return { ok: true, value: trimmedName }
}
