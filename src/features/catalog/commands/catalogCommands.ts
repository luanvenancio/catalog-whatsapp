import {
  type Catalog,
  type CatalogId,
  type CatalogInputError,
  type CreateCatalogInput,
  parseCatalogName,
  parseCatalogSlug,
  parseWhatsappNumber,
  type UpdateCatalogIdentityInput,
} from "#/features/catalog/schemas/catalogSchemas"
import type { Result } from "#/features/shared/result"

export type CatalogCommandError =
  | CatalogInputError
  | { type: "catalog_not_found"; message: string }
  | { type: "catalog_already_exists"; message: string }

export function createCatalog(input: CreateCatalogInput): Result<Catalog, CatalogCommandError> {
  const name = parseCatalogName(input.name)
  if (!name.ok) return name

  const slug = parseCatalogSlug(input.slug)
  if (!slug.ok) return slug

  const whatsappNumber = parseWhatsappNumber(input.whatsappNumber)
  if (!whatsappNumber.ok) return whatsappNumber

  return {
    ok: true,
    value: {
      id: `catalog-${slug.value}` as CatalogId,
      name: name.value,
      slug: slug.value,
      whatsappNumber: whatsappNumber.value,
      status: "draft",
    },
  }
}

export function updateCatalogIdentity(
  input: UpdateCatalogIdentityInput,
): Result<Catalog, CatalogCommandError> {
  const createdCatalog = createCatalog(input)
  if (!createdCatalog.ok) return createdCatalog

  return {
    ok: true,
    value: {
      ...createdCatalog.value,
      id: input.id,
    },
  }
}

export function publishCatalog(catalog: Catalog): Result<Catalog, CatalogCommandError> {
  return {
    ok: true,
    value: {
      ...catalog,
      status: "published",
    },
  }
}
