import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { PackagePlus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { SheetFooter } from "#/components/ui/sheet";
import { productFormSchema, type ProductFormValues } from "#/features/product/ui/forms/ProductFormSchema";

type CreateProductFormProps = {
	defaultValues?: ProductFormValues;
	isDisabled?: boolean;
	isSaving: boolean;
	onCancel?: () => void;
	onDirtyChange?: (isDirty: boolean) => void;
	onSubmit: (values: ProductFormValues) => Promise<void>;
	submitLabel?: string;
};

export function CreateProductForm({
	defaultValues = {
		name: "",
		description: "",
		imageUrl: "/logo512.png",
		priceLabel: "",
	},
	isDisabled = false,
	isSaving,
	onCancel,
	onDirtyChange,
	onSubmit,
	submitLabel = "Adicionar produto",
}: CreateProductFormProps) {
	const form = useForm({
		defaultValues,
		validators: { onSubmit: productFormSchema },
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});

	return (
		<form
			className="flex min-h-full flex-col"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				void form.handleSubmit();
			}}
		>
			<FieldGroup className="p-5">
			<form.Subscribe selector={(state) => state.isDirty}>
				{(isDirty) => <DirtyObserver isDirty={isDirty} onChange={onDirtyChange} />}
			</form.Subscribe>
			<form.Field name="name" validators={{ onBlur: productFormSchema.shape.name }}>
				{(field) => {
					const hasError = field.state.meta.isTouched && !field.state.meta.isValid;
					return <Field data-invalid={hasError}>
						<FieldLabel htmlFor={field.name}>Nome do produto</FieldLabel>
						<Input
							aria-describedby={hasError ? `${field.name}-error` : undefined}
							aria-invalid={hasError}
							disabled={isDisabled}
							id={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="Bolo de cenoura"
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} id={`${field.name}-error`} />
					</Field>
				}}
			</form.Field>
			<form.Field name="description" validators={{ onBlur: productFormSchema.shape.description }}>
				{(field) => {
					const hasError = field.state.meta.isTouched && !field.state.meta.isValid;
					return <Field data-invalid={hasError}>
						<FieldLabel htmlFor={field.name}>Descrição curta</FieldLabel>
						<Textarea
							aria-describedby={hasError ? `${field.name}-error` : undefined}
							aria-invalid={hasError}
							disabled={isDisabled}
							id={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="Massa fofinha com cobertura cremosa de chocolate."
							value={field.state.value}
						/>
						<FieldError errors={field.state.meta.errors} id={`${field.name}-error`} />
					</Field>
				}}
			</form.Field>
			<div className="grid gap-4 sm:grid-cols-2">
				<form.Field name="priceLabel" validators={{ onBlur: productFormSchema.shape.priceLabel }}>
					{(field) => {
						const hasError = field.state.meta.isTouched && !field.state.meta.isValid;
						return <Field data-invalid={hasError}>
							<FieldLabel htmlFor={field.name}>Preço informativo</FieldLabel>
							<Input
								aria-invalid={hasError}
								disabled={isDisabled}
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								placeholder="A partir de R$ 42"
								value={field.state.value}
							/>
							<FieldDescription>Sem carrinho ou checkout, apenas contexto.</FieldDescription>
						</Field>
					}}
				</form.Field>
				<form.Field name="imageUrl" validators={{ onBlur: productFormSchema.shape.imageUrl }}>
					{(field) => {
						const hasError = field.state.meta.isTouched && !field.state.meta.isValid;
						return <Field data-invalid={hasError}>
							<FieldLabel htmlFor={field.name}>Imagem pública</FieldLabel>
							<Input
								aria-describedby={hasError ? `${field.name}-error` : undefined}
								aria-invalid={hasError}
								disabled={isDisabled}
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								placeholder="/logo512.png"
								value={field.state.value}
							/>
							<FieldError errors={field.state.meta.errors} id={`${field.name}-error`} />
						</Field>
					}}
				</form.Field>
			</div>
			</FieldGroup>
			<SheetFooter>
				<Button disabled={isSaving} onClick={onCancel} type="button" variant="outline">Cancelar</Button>
			<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
				{([canSubmit, isSubmitting]) => (
					<Button disabled={!canSubmit || isDisabled || isSaving || isSubmitting} type="submit">
						<PackagePlus data-icon="inline-start" />
						{isSaving || isSubmitting ? "Salvando..." : submitLabel}
					</Button>
				)}
			</form.Subscribe>
			</SheetFooter>
		</form>
	);
}

function DirtyObserver({ isDirty, onChange }: { isDirty: boolean; onChange?: (isDirty: boolean) => void }) {
	useEffect(() => onChange?.(isDirty), [isDirty, onChange]);
	return null;
}
