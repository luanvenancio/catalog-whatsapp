import { z } from "zod"

export const catalogSettingsFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome do negócio.")
    .max(80, "Use no máximo 80 caracteres."),
  description: z.string().trim().max(160, "Use no máximo 160 caracteres."),
  whatsappNumber: z
    .string()
    .refine(
      (value) => /^\d{10,15}$/.test(value.replace(/\D/g, "")),
      "Informe um WhatsApp com código do país e DDD.",
    ),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras minúsculas, números e hífens."),
  coverImageUrl: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^https?:\/\//.test(value),
      "Informe uma URL pública válida.",
    ),
})

export type CatalogSettingsFormValues = z.input<typeof catalogSettingsFormSchema>
