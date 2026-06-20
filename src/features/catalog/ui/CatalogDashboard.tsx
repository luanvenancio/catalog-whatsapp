import { Link } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"
import { Badge } from "#/components/ui/badge"
import { ButtonLink } from "#/components/ui/button-link"
import { Card, CardContent } from "#/components/ui/card"
import type { AdminProductSummary } from "#/features/catalog/queries/catalogServerQueries"
import type { Catalog } from "#/features/catalog/schemas/catalogSchemas"
import { ProductStatusBadge } from "#/features/product/ui/ProductStatusBadge"
import { ProductUpdatedAt } from "#/features/product/ui/ProductUpdatedAt"

export function CatalogDashboard({
  catalog,
  products,
}: {
  catalog: Catalog
  products: AdminProductSummary[]
}) {
  const publishedCount = products.filter((product) => product.status === "published").length
  const draftCount = products.filter((product) => product.status === "draft").length
  const recentProducts = [...products]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 5)
  const publicPath = `/catalogs/${catalog.slug}`

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 sm:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold sm:text-3xl">Visão geral</h1>
            <Badge variant={catalog.status === "published" ? "default" : "secondary"}>
              {catalog.status === "published" ? "Publicado" : "Rascunho"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Acompanhe o estado da vitrine e o que precisa de atenção.
          </p>
        </div>
      </header>

      <section aria-label="Resumo dos produtos" className="grid gap-3 sm:grid-cols-3">
        <SummaryItem label="Produtos" value={products.length} />
        <SummaryItem label="Publicados" value={publishedCount} />
        <SummaryItem label="Rascunhos" value={draftCount} />
      </section>

      <section className="grid gap-3" aria-labelledby="attention-title">
        <div>
          <h2 className="text-base font-semibold" id="attention-title">
            Situação atual
          </h2>
          <p className="text-sm text-muted-foreground">
            {getCurrentSituation(products.length, draftCount)}
          </p>
        </div>
        {draftCount > 0 ? (
          <Link
            className="w-fit text-sm font-medium underline underline-offset-4"
            to="/admin/products"
          >
            Revisar produtos
          </Link>
        ) : null}
      </section>

      <section className="grid gap-3" aria-labelledby="recent-products-title">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold" id="recent-products-title">
              Produtos recentes
            </h2>
            <p className="text-sm text-muted-foreground">Últimos itens alterados na vitrine.</p>
          </div>
          <ButtonLink to="/admin/products" variant="link">
            Ver todos
          </ButtonLink>
        </div>
        <RecentProductsList products={recentProducts} />
      </section>

      <section className="grid gap-2 border-t pt-6" aria-labelledby="public-link-title">
        <h2 className="text-base font-semibold" id="public-link-title">
          Link público
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <code className="min-w-0 truncate text-sm text-muted-foreground">{publicPath}</code>

          <ButtonLink
            params={{ catalogSlug: catalog.slug }}
            to="/catalogs/$catalogSlug"
            target="_blank"
            variant="outline"
          >
            Abrir vitrine
            <ExternalLink className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </main>
  )
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}

function RecentProductsList({ products }: { products: AdminProductSummary[] }) {
  if (products.length === 0) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="p-5 text-sm text-muted-foreground">
          Nenhum produto adicionado ainda.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden py-0">
      <ul className="divide-y">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50 sm:p-4"
              to="/admin/products"
            >
              <img
                alt={`Imagem de ${product.name}`}
                className="size-11 shrink-0 rounded-md border bg-muted object-cover"
                loading="lazy"
                src={product.imageUrl}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Atualizado <ProductUpdatedAt value={product.updatedAt} />
                </p>
              </div>
              <ProductStatusBadge status={product.status} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function getCurrentSituation(total: number, drafts: number) {
  if (total === 0) return "Adicione o primeiro produto para começar sua vitrine."
  if (drafts === 1) return "Existe 1 produto em rascunho para revisar."
  if (drafts > 1) return `Existem ${drafts} produtos em rascunho para revisar.`
  return "Todos os produtos estão publicados."
}
