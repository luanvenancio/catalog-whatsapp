import { createServerFn } from "@tanstack/react-start"
import { and, eq } from "drizzle-orm"
import { db } from "#/db/client"
import { catalogs, products } from "#/db/schema"
import { createCatalog } from "#/features/catalog/commands/catalogCommands"
import {
  type ProductPresentationInput,
  parseProductDescription,
  parseProductImageUrl,
  parseProductName,
} from "#/features/product/schemas/productSchemas"
import type { Result } from "#/features/shared/result"

export type SaveCatalogIdentityData = {
  catalogId?: string
  name: string
  slug: string
  whatsappNumber: string
  description?: string
  coverImageUrl?: string
}

export type CreateFirstProductData = {
  catalogId: string
  presentation: ProductPresentationInput
}

export type UpdateProductPresentationData = {
  productId: string
  presentation: ProductPresentationInput
}

export type ToggleProductVisibilityData = {
  productId: string
  status: "draft" | "published" | "archived"
}

export type MutationResult = { ok: true; message: string } | { ok: false; message: string }

export const saveCatalogIdentityToDatabase = createServerFn({ method: "POST" })
  .validator((input: SaveCatalogIdentityData) => input)
  .handler(async ({ data }): Promise<MutationResult> => {
    const catalog = createCatalog(data)
    if (!catalog.ok) {
      return { ok: false, message: catalog.error.message }
    }

    try {
      const description = data.description?.trim() || undefined
      if (description && description.length > 160)
        return { ok: false, message: "A descrição deve ter no máximo 160 caracteres." }
      const coverImageUrl = data.coverImageUrl?.trim() || undefined
      if (coverImageUrl && !/^https?:\/\//.test(coverImageUrl))
        return { ok: false, message: "Informe uma URL pública válida para a imagem de capa." }
      if (data.catalogId) {
        await db
          .update(catalogs)
          .set({
            name: catalog.value.name,
            slug: catalog.value.slug,
            whatsappNumber: catalog.value.whatsappNumber,
            description,
            coverImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(catalogs.id, data.catalogId))

        return { ok: true, message: "Vitrine salva como rascunho." }
      }

      await db.insert(catalogs).values({
        name: catalog.value.name,
        slug: catalog.value.slug,
        whatsappNumber: catalog.value.whatsappNumber,
        description,
        coverImageUrl,
        isPublished: false,
      })

      return { ok: true, message: "Vitrine criada como rascunho." }
    } catch {
      return {
        ok: false,
        message: "Nao foi possivel salvar. Verifique o PostgreSQL e se o slug ja esta em uso.",
      }
    }
  })

export const createFirstProductInDatabase = createServerFn({ method: "POST" })
  .validator((input: CreateFirstProductData) => input)
  .handler(async ({ data }): Promise<MutationResult> => {
    const product = await buildProductForDatabase(data)
    if (!product.ok) {
      return { ok: false, message: product.error }
    }

    try {
      await db.insert(products).values({
        catalogId: product.value.catalogId,
        name: product.value.name,
        description: product.value.description,
        imageUrl: product.value.imageUrl,
        priceLabel: product.value.priceLabel,
        isVisible: product.value.status === "published",
      })

      return { ok: true, message: "Produto adicionado a vitrine." }
    } catch {
      return {
        ok: false,
        message: "Nao foi possivel salvar o produto agora.",
      }
    }
  })

export const publishCatalogInDatabase = createServerFn({ method: "POST" })
  .validator((input: { catalogId: string }) => input)
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      const catalogProducts = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.catalogId, data.catalogId))
        .limit(1)

      const visibleProducts = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.catalogId, data.catalogId), eq(products.isVisible, true)))
        .limit(1)

      if (catalogProducts.length === 0 || visibleProducts.length === 0) {
        return {
          ok: false,
          message: "Mantenha pelo menos um produto visivel antes de publicar.",
        }
      }

      await db
        .update(catalogs)
        .set({ isPublished: true, updatedAt: new Date() })
        .where(eq(catalogs.id, data.catalogId))

      return { ok: true, message: "Vitrine publicada." }
    } catch {
      return {
        ok: false,
        message: "Nao foi possivel publicar a vitrine agora.",
      }
    }
  })

export const updateProductPresentationInDatabase = createServerFn({
  method: "POST",
})
  .validator((input: UpdateProductPresentationData) => input)
  .handler(async ({ data }): Promise<MutationResult> => {
    const presentation = parseProductPresentation(data.presentation)
    if (!presentation.ok) {
      return { ok: false, message: presentation.error }
    }

    try {
      await db
        .update(products)
        .set({
          ...presentation.value,
          updatedAt: new Date(),
        })
        .where(eq(products.id, data.productId))

      return { ok: true, message: "Produto atualizado." }
    } catch {
      return { ok: false, message: "Nao foi possivel atualizar o produto." }
    }
  })

export const toggleProductVisibilityInDatabase = createServerFn({
  method: "POST",
})
  .validator((input: ToggleProductVisibilityData) => input)
  .handler(async ({ data }): Promise<MutationResult> => {
    try {
      await db
        .update(products)
        .set({
          isVisible: data.status === "published",
          updatedAt: new Date(),
        })
        .where(eq(products.id, data.productId))

      return {
        ok: true,
        message:
          data.status === "published"
            ? "Produto publicado na vitrine."
            : "Produto salvo como rascunho.",
      }
    } catch {
      return {
        ok: false,
        message: "Nao foi possivel alterar a visibilidade do produto.",
      }
    }
  })

async function buildProductForDatabase(data: CreateFirstProductData): Promise<
  Result<
    {
      catalogId: string
      name: string
      description: string
      imageUrl: string
      priceLabel?: string
      status: "published"
    },
    string
  >
> {
  const [catalog] = await db
    .select({ id: catalogs.id })
    .from(catalogs)
    .where(eq(catalogs.id, data.catalogId))
    .limit(1)

  if (!catalog) {
    return { ok: false, error: "Vitrine nao encontrada." }
  }

  const presentation = parseProductPresentation(data.presentation)
  if (!presentation.ok) {
    return { ok: false, error: presentation.error }
  }

  return {
    ok: true,
    value: {
      catalogId: catalog.id,
      ...presentation.value,
      status: "published",
    },
  }
}

function parseProductPresentation(input: ProductPresentationInput): Result<
  {
    name: string
    description: string
    imageUrl: string
    priceLabel?: string
  },
  string
> {
  const name = parseProductName(input.name)
  if (!name.ok) return { ok: false, error: name.error.message }

  const description = parseProductDescription(input.description)
  if (!description.ok) return { ok: false, error: description.error.message }

  const imageUrl = parseProductImageUrl(input.imageUrl)
  if (!imageUrl.ok) return { ok: false, error: imageUrl.error.message }

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
