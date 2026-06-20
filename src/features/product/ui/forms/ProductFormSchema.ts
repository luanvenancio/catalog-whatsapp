import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do produto."),
  description: z.string().trim().min(8, "Descreva o item com um pouco mais de contexto."),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Informe uma imagem publica.")
    .refine((value) => value.startsWith("/"), "Use um caminho público."),
  priceLabel: z.string().trim(),
})

export type ProductFormValues = z.input<typeof productFormSchema>
