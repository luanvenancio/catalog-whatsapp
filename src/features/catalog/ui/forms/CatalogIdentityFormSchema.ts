import { z } from "zod"

export const catalogIdentityFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do negocio."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras minusculas, numeros e hifens."),
  whatsappNumber: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{10,15}$/, "Informe WhatsApp com DDD.")),
})

export type CatalogIdentityFormValues = z.input<typeof catalogIdentityFormSchema>
