import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { ImageIcon, Save, X } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { saveCatalogIdentityToDatabase } from "#/features/catalog/commands/catalogServerCommands";
import type { Catalog } from "#/features/catalog/schemas/catalogSchemas";
import { catalogSettingsFormSchema } from "#/features/catalog/ui/settings/CatalogSettingsFormSchema";

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
		<section className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-5 sm:py-6">
			<header><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Configurações</h1><p className="mt-1 text-sm text-muted-foreground">Personalize a identidade exibida aos visitantes.</p></header>
			<form className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]" onSubmit={(event) => { event.preventDefault(); event.stopPropagation(); void form.handleSubmit(); }}>
				<div className="grid gap-5">
					<Card><CardHeader><CardTitle>Identidade da vitrine</CardTitle><CardDescription>As informações principais que apresentam seu negócio.</CardDescription></CardHeader><CardContent>
						<FieldGroup>
							<form.Field name="name" validators={{ onBlur: catalogSettingsFormSchema.shape.name }}>{(field) => { const invalid = isFieldInvalid(field); return <SettingsField field={field} label="Nome do negócio"><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} maxLength={80} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} value={field.state.value} /></SettingsField>; }}</form.Field>
							<form.Field name="description" validators={{ onBlur: catalogSettingsFormSchema.shape.description }}>{(field) => { const invalid = isFieldInvalid(field); return <SettingsField field={field} label="Descrição curta"><Textarea aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} maxLength={160} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} placeholder="Conte em uma frase o que torna seu negócio especial." rows={3} value={field.state.value} /><FieldDescription className="text-right">{field.state.value.length}/160</FieldDescription></SettingsField>; }}</form.Field>
							<form.Field name="whatsappNumber" validators={{ onBlur: catalogSettingsFormSchema.shape.whatsappNumber }}>{(field) => { const invalid = isFieldInvalid(field); return <SettingsField field={field} label="WhatsApp"><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} inputMode="tel" onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} placeholder="5511999999999" value={field.state.value} /><FieldDescription>Inclua código do país e DDD.</FieldDescription></SettingsField>; }}</form.Field>
							<form.Field name="slug" validators={{ onBlur: catalogSettingsFormSchema.shape.slug }}>{(field) => { const invalid = isFieldInvalid(field); return <SettingsField field={field} label="Endereço público"><div className="flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring"><span className="pl-3 text-sm text-muted-foreground">/catalogs/</span><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} className="border-0 pl-0 shadow-none focus-visible:ring-0" id={field.name} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value.toLowerCase())} value={field.state.value} /></div><FieldDescription>Alterar o endereço quebra links compartilhados anteriormente.</FieldDescription></SettingsField>; }}</form.Field>
						</FieldGroup>
					</CardContent></Card>
					<Card><CardHeader><CardTitle>Imagem de capa</CardTitle><CardDescription>Use uma única imagem horizontal que represente seu negócio.</CardDescription></CardHeader><CardContent>
						<form.Field name="coverImageUrl" validators={{ onBlur: catalogSettingsFormSchema.shape.coverImageUrl }}>{(field) => { const invalid = isFieldInvalid(field); return <FieldGroup><CoverPreview url={field.state.value} /><SettingsField field={field} label="URL pública da imagem"><Input aria-describedby={invalid ? `${field.name}-error` : undefined} aria-invalid={invalid} id={field.name} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} placeholder="https://..." type="url" value={field.state.value} /></SettingsField>{field.state.value ? <Button className="w-fit" onClick={() => field.handleChange("")} type="button" variant="ghost"><X />Remover capa</Button> : null}</FieldGroup>; }}</form.Field>
					</CardContent></Card>
				</div>
				<form.Subscribe selector={(state) => ({ values: state.values, isDirty: state.isDirty, canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
					{({ values, isDirty, canSubmit, isSubmitting }) => <aside className="grid content-start gap-4 lg:sticky lg:top-5"><Card><CardHeader><CardTitle>Prévia</CardTitle><CardDescription>Uma aproximação do cabeçalho público.</CardDescription></CardHeader><CardContent><IdentityPreview values={values} /></CardContent></Card>{saveState.status === "error" ? <Alert variant="destructive"><AlertDescription>{saveState.message}</AlertDescription></Alert> : null}{saveState.status === "success" ? <Alert><AlertDescription>{saveState.message}</AlertDescription></Alert> : null}<div className="flex flex-col gap-2"><Button disabled={!isDirty || !canSubmit || isSubmitting || saveState.status === "saving"} type="submit"><Save />{isSubmitting || saveState.status === "saving" ? "Salvando..." : "Salvar alterações"}</Button>{isDirty ? <p className="text-center text-xs text-muted-foreground">Você tem alterações não salvas.</p> : null}</div></aside>}
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

function CoverPreview({ url }: { url: string }) {
	return <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">{url ? <img alt="Prévia da capa" className="size-full object-cover" src={url} /> : <div className="grid size-full place-content-center gap-2 text-center text-muted-foreground"><ImageIcon className="mx-auto size-8" /><span className="text-sm">Nenhuma capa adicionada</span></div>}</div>;
}

function IdentityPreview({ values }: { values: { name: string; description: string; coverImageUrl: string } }) {
	return <div className="overflow-hidden rounded-xl border bg-amber-50 text-zinc-950">{values.coverImageUrl ? <img alt="" className="aspect-video w-full object-cover" src={values.coverImageUrl} /> : <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100" />}<div className="grid gap-2 p-4"><h2 className="text-xl font-bold">{values.name || "Nome do negócio"}</h2><p className="text-sm text-zinc-600">{values.description || "Sua descrição aparecerá aqui."}</p><div className="mt-2 rounded-md bg-emerald-700 px-3 py-2 text-center text-sm font-semibold text-white">Conversar no WhatsApp</div></div></div>;
}
