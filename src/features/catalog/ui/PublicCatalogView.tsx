import { SearchIcon, X } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "#/components/ui/button"
import { Field } from "#/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group"
import type { Catalog } from "#/features/catalog/schemas/catalogSchemas"
import { BusinessAvatar } from "#/features/catalog/ui/BusinessAvatar"
import { CatalogImage } from "#/features/catalog/ui/CatalogImage"
import { getCatalogWhatsappHref, getProductWhatsappHref } from "#/features/catalog/ui/whatsapp"
import type { Category } from "#/features/category/schemas/categorySchemas"
import type { Product } from "#/features/product/schemas/productSchemas"
import { cn } from "#/lib/utils"

export function PublicCatalogView({
  catalog,
  categories,
  products,
}: {
  catalog: Catalog
  categories: Category[]
  products: Product[]
}) {
  const [search, setSearch] = useState("")
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(() => new Set())
  const normalizedSearch = normalizeSearch(search)
  const hasFilters = normalizedSearch.length > 0 || selectedCategoryIds.size > 0
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          selectedCategoryIds.size === 0 ||
          (product.categoryId !== undefined &&
            product.categoryId !== null &&
            selectedCategoryIds.has(product.categoryId))
        const searchableText = normalizeSearch(`${product.name} ${product.description}`)

        return matchesCategory && searchableText.includes(normalizedSearch)
      }),
    [normalizedSearch, products, selectedCategoryIds],
  )

  function toggleCategory(categoryId: string) {
    setSelectedCategoryIds((current) => {
      const next = new Set(current)
      next.has(categoryId) ? next.delete(categoryId) : next.add(categoryId)
      return next
    })
  }

  function clearFilters() {
    setSearch("")
    setSelectedCategoryIds(new Set())
  }

  return (
    <main className="min-h-dvh bg-amber-50 text-zinc-950">
      <section className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-8 sm:pt-6">
        <header className="overflow-hidden bg-white shadow-sm sm:rounded-2xl sm:border">
          {catalog.coverImageUrl ? (
            <CatalogImage
              alt={`Capa de ${catalog.name}`}
              containerClassName="aspect-[3/1] min-h-36 max-h-80 w-full bg-amber-100"
              loading="eager"
              src={catalog.coverImageUrl}
            />
          ) : (
            <div
              className="h-36 bg-gradient-to-br from-amber-100 via-orange-100 to-emerald-100 sm:h-52"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col gap-4 px-4 pb-6 sm:items-start sm:px-6">
            <div className="-mt-8 sm:-mt-10">
              <BusinessAvatar name={catalog.name} />
            </div>
            <div className="min-w-0 flex-1 sm:py-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{catalog.name}</h1>
              <p className="mt-2 max-w-2xl text-base text-zinc-600 sm:text-lg">
                {catalog.description ||
                  "Escolha o que chamou sua atenção e inicie uma conversa com contexto."}
              </p>
              <a
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-emerald-700 px-5 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 sm:w-fit"
                href={getCatalogWhatsappHref(catalog)}
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-5">
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-zinc-600">
              Esta vitrine ainda não tem produtos visíveis.
            </div>
          ) : (
            <>
              <section aria-label="Filtros de produtos" className="grid gap-3">
                <Field>
                  <InputGroup className="bg-background">
                    <InputGroupAddon>
                      <SearchIcon className="size-4 text-zinc-500" />
                    </InputGroupAddon>

                    <InputGroupInput
                      type="search"
                      placeholder="Buscar produtos..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </InputGroup>
                </Field>
                <div className="flex justify-between w-full">
                  {categories.length > 0 ? (
                    <div
                      aria-label="Filtrar por categoria"
                      className="flex gap-2 overflow-x-auto pb-1"
                      role="group"
                    >
                      {categories.map((category) => {
                        const isSelected = selectedCategoryIds.has(category.id)
                        return (
                          <button
                            aria-pressed={isSelected}
                            className={cn(
                              "min-h-9 shrink-0 rounded-full border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2",
                              isSelected
                                ? "border-emerald-700 bg-emerald-700 text-white"
                                : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100",
                            )}
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            type="button"
                          >
                            {category.name}
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                  <div className="flex min-h-8 items-center justify-between gap-3">
                    <p aria-live="polite" className="text-sm text-zinc-600">
                      {resultCountLabel(filteredProducts.length, products.length, hasFilters)}
                    </p>
                    {hasFilters ? (
                      <Button className="shrink-0" onClick={clearFilters} size="sm" variant="ghost">
                        <X aria-hidden="true" /> Limpar filtros
                      </Button>
                    ) : null}
                  </div>
                </div>
              </section>

              {filteredProducts.length === 0 ? (
                <section className="grid justify-items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                  <h2 className="text-lg font-semibold">Nenhum produto encontrado.</h2>
                  <p className="text-sm text-zinc-600">
                    Tente buscar outro termo ou remover os filtros.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Limpar filtros
                  </Button>
                </section>
              ) : (
                <section aria-label="Produtos" className="grid gap-4 sm:grid-cols-2">
                  {filteredProducts.map((product) => (
                    <ProductCard catalog={catalog} key={product.id} product={product} />
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function ProductCard({ catalog, product }: { catalog: Catalog; product: Product }) {
  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <CatalogImage
        alt={`Imagem de ${product.name}`}
        containerClassName="aspect-[4/3] w-full"
        src={product.imageUrl}
      />
      <div className="grid gap-3 p-4">
        <div>
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
        </div>
        {product.priceLabel ? (
          <p className="font-semibold text-emerald-700">{product.priceLabel}</p>
        ) : null}
        <a
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-700 px-4 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          href={getProductWhatsappHref(catalog, product)}
        >
          Perguntar no WhatsApp
        </a>
      </div>
    </article>
  )
}

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function resultCountLabel(filtered: number, total: number, hasFilters: boolean) {
  const productLabel = total === 1 ? "produto" : "produtos"
  return hasFilters ? `${filtered} de ${total} ${productLabel}` : `${total} ${productLabel}`
}
