import type { Catalog } from "#/features/catalog/schemas/catalogSchemas"

export function CatalogAdminPanel({ catalog }: { catalog: Catalog }) {
  const statusLabel = catalog.status === "published" ? "Publicado" : "Rascunho"

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <header>
        <p className="text-sm font-medium text-emerald-700">{statusLabel}</p>
        <h1 className="text-3xl font-bold text-zinc-950">Identidade da vitrine</h1>
        <p className="mt-2 text-zinc-600">
          Configure o catálogo antes de organizar categorias e produtos.
        </p>
      </header>

      <dl className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div>
          <dt className="text-sm font-medium text-zinc-500">Nome</dt>
          <dd className="text-lg font-semibold text-zinc-950">{catalog.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">Identificador público</dt>
          <dd className="text-zinc-800">/{catalog.slug}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">WhatsApp</dt>
          <dd className="text-zinc-800">{catalog.whatsappNumber}</dd>
        </div>
      </dl>
    </section>
  )
}
