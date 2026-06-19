import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { saveCatalogIdentityToDatabase } from "#/features/catalog/commands/catalogServerCommands";
import type { Catalog } from "#/features/catalog/schemas/catalogSchemas";
import { catalogSettingsFormSchema } from "#/features/catalog/ui/settings/CatalogSettingsFormSchema";
import { BusinessInformationCard, CatalogCoverCard, ContactInformationCard, PublicCatalogCard, SettingsHeader, SettingsMobileActions } from "#/features/catalog/ui/settings/SettingsSections";

type SaveState = { status: "idle" } | { status: "saving" } | { status: "success"; message: string } | { status: "error"; message: string };

export function CatalogSettingsPage({ catalog }: { catalog: Catalog }) {
	const router = useRouter();
	const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
	const form = useForm({
		defaultValues: {
			name: catalog.name,
			description: catalog.description ?? "",
			whatsappNumber: catalog.whatsappNumber,
			slug: catalog.slug as string,
			coverImageUrl: catalog.coverImageUrl ?? "",
		},
		validators: { onSubmit: catalogSettingsFormSchema },
		onSubmit: async ({ value }) => {
			setSaveState({ status: "saving" });
			const result = await saveCatalogIdentityToDatabase({ data: { catalogId: catalog.id, ...value } });
			if (!result.ok) { setSaveState({ status: "error", message: result.message }); return; }
			setSaveState({ status: "success", message: "Configurações salvas." });
			await router.invalidate();
			form.reset(value);
		},
	});

	return (
		<section className="mx-auto w-full max-w-4xl px-4 py-5 sm:py-7">
			<form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit(); }}>
				<form.Subscribe selector={(state) => ({ isDirty: state.isDirty, canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
					{(state) => <SettingsHeader actions={<SettingsActions {...state} isSaving={saveState.status === "saving"} onCancel={() => { form.reset(); setSaveState({ status: "idle" }); }} />} />}
				</form.Subscribe>
				<BusinessInformationCard>
						<FieldGroup>
							<form.Field name="name" validators={{ onBlur: catalogSettingsFormSchema.shape.name }}>{(field) => { const invalid = isFieldInvalid(field); return <SettingsField field={field} label="Nome"><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} maxLength={80} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} value={field.state.value} /><FieldDescription>Será exibido na sua vitrine pública.</FieldDescription></SettingsField>; }}</form.Field>
							<form.Field name="description" validators={{ onBlur: catalogSettingsFormSchema.shape.description }}>{(field) => { const invalid = isFieldInvalid(field); return <SettingsField field={field} label="Descrição"><Textarea aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} maxLength={160} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} placeholder="Conte em uma frase o que torna seu negócio especial." rows={4} value={field.state.value} /><div className="flex items-start justify-between gap-4"><FieldDescription>{field.state.value ? "Explique rapidamente o que seu negócio oferece." : "Adicione uma descrição para ajudar clientes a entender seu negócio."}</FieldDescription><span className="shrink-0 text-xs tabular-nums text-muted-foreground">{field.state.value.length} / 160</span></div></SettingsField>; }}</form.Field>
						</FieldGroup>
				</BusinessInformationCard>
				<ContactInformationCard>
					<FieldGroup>
						<form.Field name="whatsappNumber" validators={{ onBlur: catalogSettingsFormSchema.shape.whatsappNumber }}>{(field) => { const invalid = isFieldInvalid(field); return <SettingsField field={field} label="WhatsApp"><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} inputMode="tel" onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} placeholder="5511999999999" value={field.state.value} /><FieldDescription>Número utilizado para iniciar conversas. Prévia: {formatWhatsapp(field.state.value)}</FieldDescription></SettingsField>; }}</form.Field>
					</FieldGroup>
				</ContactInformationCard>
				<form.Field name="slug" validators={{ onBlur: catalogSettingsFormSchema.shape.slug }}>{(field) => { const invalid = isFieldInvalid(field); return <PublicCatalogCard slug={field.state.value}><SettingsField field={field} label="Slug"><div className="flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring"><span className="pl-3 text-sm text-muted-foreground">/catalogs/</span><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} className="border-0 pl-0 shadow-none focus-visible:ring-0" id={field.name} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value.toLowerCase())} value={field.state.value} /></div><FieldDescription>Alterar o endereço quebra links compartilhados anteriormente.</FieldDescription></SettingsField></PublicCatalogCard>; }}</form.Field>
				<form.Field name="coverImageUrl" validators={{ onBlur: catalogSettingsFormSchema.shape.coverImageUrl }}>{(field) => { const invalid = isFieldInvalid(field); return <CatalogCoverCard coverUrl={field.state.value}><FieldGroup><SettingsField field={field} label="URL da capa"><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} placeholder="https://..." type="url" value={field.state.value} /><FieldDescription>Use uma URL pública de imagem. Upload será adicionado em outra fase.</FieldDescription></SettingsField>{field.state.value ? <Button className="w-fit" onClick={() => field.handleChange("")} type="button" variant="ghost"><X />Remover capa</Button> : null}</FieldGroup></CatalogCoverCard>; }}</form.Field>
				{saveState.status === "error" ? <Alert variant="destructive"><AlertDescription>{saveState.message}</AlertDescription></Alert> : null}
				{saveState.status === "success" ? <Alert><AlertDescription>{saveState.message}</AlertDescription></Alert> : null}
				<form.Subscribe selector={(state) => ({ isDirty: state.isDirty, canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
					{(state) => <SettingsMobileActions><SettingsActions {...state} isSaving={saveState.status === "saving"} onCancel={() => { form.reset(); setSaveState({ status: "idle" }); }} /></SettingsMobileActions>}
				</form.Subscribe>
			</form>
		</section>
	);
}

type SettingsFieldApi = { name: string; state: { value: string; meta: { isTouched: boolean; isValid: boolean; errors: Array<{ message?: string } | undefined> } } };

function SettingsField({ children, field, label }: { children: React.ReactNode; field: SettingsFieldApi; label: string }) {
	const isInvalid = isFieldInvalid(field);
	return <Field data-invalid={isInvalid}><FieldLabel htmlFor={field.name}>{label}</FieldLabel>{children}<FieldError errors={field.state.meta.errors} id={`${field.name}-error`} /></Field>;
}

function isFieldInvalid(field: SettingsFieldApi) {
	return field.state.meta.isTouched && !field.state.meta.isValid;
}

function SettingsActions({ canSubmit, isDirty, isSaving, isSubmitting, onCancel }: { canSubmit: boolean; isDirty: boolean; isSaving: boolean; isSubmitting: boolean; onCancel: () => void }) {
	return <><Button disabled={!isDirty || isSaving || isSubmitting} onClick={onCancel} type="button" variant="outline">Cancelar</Button><Button disabled={!(isDirty && canSubmit) || isSaving || isSubmitting} type="submit"><Save />{isSaving || isSubmitting ? "Salvando..." : "Salvar alterações"}</Button></>;
}

function formatWhatsapp(value: string) {
	const digits = value.replace(/\D/g, "");
	if (digits.length < 12) return value || "—";
	return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
}
