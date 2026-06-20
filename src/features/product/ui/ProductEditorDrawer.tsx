import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet"
import type { AdminProductSummary } from "#/features/catalog/queries/catalogServerQueries"
import { CreateProductForm } from "#/features/product/ui/forms/CreateProductForm"
import type { ProductFormValues } from "#/features/product/ui/forms/ProductFormSchema"

export type ProductEditor = { mode: "create" } | { mode: "edit"; product: AdminProductSummary }

type ProductEditorDrawerProps = {
  editor: ProductEditor
  feedback?: string
  isSaving: boolean
  onClose: () => void
  onDirtyChange: (isDirty: boolean) => void
  onSubmit: (values: ProductFormValues) => Promise<void>
}

export function ProductEditorDrawer({
  editor,
  feedback,
  isSaving,
  onClose,
  onDirtyChange,
  onSubmit,
}: ProductEditorDrawerProps) {
  const initialValues =
    editor.mode === "edit"
      ? {
          name: editor.product.name,
          description: editor.product.description,
          imageUrl: editor.product.imageUrl,
          priceLabel: editor.product.priceLabel ?? "",
        }
      : undefined

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!(open || isSaving)) onClose()
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editor.mode === "create" ? "Novo produto" : "Editar produto"}</SheetTitle>
          <SheetDescription>
            Informações que ajudam o visitante a iniciar a conversa.
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="p-0">
          {feedback ? (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {feedback}
            </p>
          ) : null}
          <CreateProductForm
            defaultValues={initialValues}
            isSaving={isSaving}
            onCancel={onClose}
            onDirtyChange={onDirtyChange}
            onSubmit={onSubmit}
            submitLabel={editor.mode === "create" ? "Criar produto" : "Salvar alterações"}
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
