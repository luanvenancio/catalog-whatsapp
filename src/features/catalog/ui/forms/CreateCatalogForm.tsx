import { useForm } from "@tanstack/react-form"
import { ArrowRight } from "lucide-react"
import { Button } from "#/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import {
  type CatalogIdentityFormValues,
  catalogIdentityFormSchema,
} from "#/features/catalog/ui/forms/CatalogIdentityFormSchema"

type CreateCatalogFormProps = {
  isSaving: boolean
  onSubmit: (values: CatalogIdentityFormValues) => Promise<void>
}

export function CreateCatalogForm({ isSaving, onSubmit }: CreateCatalogFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      whatsappNumber: "",
    },
    validators: { onSubmit: catalogIdentityFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field name="name" validators={{ onBlur: catalogIdentityFormSchema.shape.name }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nome do negocio</FieldLabel>
                <Input
                  aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                  aria-invalid={isInvalid}
                  id={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Bela Fatia"
                  value={field.state.value}
                />
                <FieldError errors={field.state.meta.errors} id={`${field.name}-error`} />
              </Field>
            )
          }}
        </form.Field>
        <form.Field
          name="whatsappNumber"
          validators={{ onBlur: catalogIdentityFormSchema.shape.whatsappNumber }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>WhatsApp</FieldLabel>
                <Input
                  aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                  aria-invalid={isInvalid}
                  id={field.name}
                  inputMode="tel"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="(11) 99999-9999"
                  value={field.state.value}
                />
                <FieldDescription>O botao da vitrine usa este numero.</FieldDescription>
                <FieldError errors={field.state.meta.errors} id={`${field.name}-error`} />
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="slug" validators={{ onBlur: catalogIdentityFormSchema.shape.slug }}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                  aria-invalid={isInvalid}
                  id={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="bela-fatia"
                  value={field.state.value}
                />
                <FieldDescription>
                  Seu link publico sera /catalogs/{field.state.value || "bela-fatia"}.
                </FieldDescription>
                <FieldError errors={field.state.meta.errors} id={`${field.name}-error`} />
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button disabled={!canSubmit || isSaving || isSubmitting} size="lg" type="submit">
            {isSaving || isSubmitting ? "Criando..." : "Criar vitrine"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
