import { createFileRoute } from "@tanstack/react-router"
import { getCurrentBusinessCatalog } from "#/features/catalog/queries/catalogQueries"
import { PublicCatalogView } from "#/features/catalog/ui/PublicCatalogView"
import { listCategoriesByCatalog } from "#/features/category/queries/categoryQueries"
import { listVisibleProductsByCatalog } from "#/features/product/queries/productQueries"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  const catalog = getCurrentBusinessCatalog()
  const categories = listCategoriesByCatalog(catalog.id)
  const products = listVisibleProductsByCatalog(catalog.id)

  if (catalog.status !== "published") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-950">Vitrine em rascunho</h1>
          <p className="mt-2 text-zinc-600">
            Este catálogo ainda não foi publicado pelo dono do negócio.
          </p>
        </div>
      </main>
    )
  }

  return <PublicCatalogView catalog={catalog} categories={categories} products={products} />
}
