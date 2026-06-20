import { useRouter } from "@tanstack/react-router"
import { useState } from "react"
import {
  createFirstProductInDatabase,
  type MutationResult,
  updateProductPresentationInDatabase,
} from "#/features/catalog/commands/catalogServerCommands"
import type { AdminProductSummary } from "#/features/catalog/queries/catalogServerQueries"
import type { CatalogId } from "#/features/catalog/schemas/catalogSchemas"
import type { ProductFormValues } from "#/features/product/ui/forms/ProductFormSchema"
import type { ProductListSearch } from "#/features/product/ui/ProductDataGrid"
import { ProductDataGrid } from "#/features/product/ui/ProductDataGrid"
import { type ProductEditor, ProductEditorDrawer } from "#/features/product/ui/ProductEditorDrawer"

type FeedbackState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "error"; message: string }

export function ProductAdminWorkspace({
  catalogId,
  listSearch,
  products,
}: {
  catalogId: CatalogId
  listSearch: ProductListSearch
  products: AdminProductSummary[]
}) {
  const router = useRouter()
  const [editor, setEditor] = useState<ProductEditor>()
  const [isDirty, setIsDirty] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>({ status: "idle" })

  function closeEditor() {
    if (isDirty && !window.confirm("Descartar alterações não salvas?")) return
    setEditor(undefined)
    setIsDirty(false)
    setFeedback({ status: "idle" })
  }

  async function saveProduct(values: ProductFormValues) {
    if (!editor) return
    setFeedback({ status: "saving" })
    const result: MutationResult =
      editor.mode === "create"
        ? await createFirstProductInDatabase({ data: { catalogId, presentation: values } })
        : await updateProductPresentationInDatabase({
            data: { productId: editor.product.id, presentation: values },
          })
    if (!result.ok) {
      setFeedback({ status: "error", message: result.message })
      return
    }
    setIsDirty(false)
    setEditor(undefined)
    setFeedback({ status: "idle" })
    await router.invalidate()
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:py-6">
      <ProductDataGrid
        listSearch={listSearch}
        onCreate={() => setEditor({ mode: "create" })}
        onEdit={(product) => setEditor({ mode: "edit", product })}
        products={products}
      />
      {editor ? (
        <ProductEditorDrawer
          editor={editor}
          feedback={feedback.status === "error" ? feedback.message : undefined}
          isSaving={feedback.status === "saving"}
          onClose={closeEditor}
          onDirtyChange={setIsDirty}
          onSubmit={saveProduct}
        />
      ) : null}
    </section>
  )
}
