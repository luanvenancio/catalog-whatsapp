import { useEffect, useState } from "react";
import {
	readCatalogDraft,
	type StoredCatalogDraftState,
} from "#/features/catalog/queries/catalogDraftStorage";

type DraftPreviewState =
	| { status: "empty" }
	| { status: "ready"; catalogName: string };

export function CatalogDraftFallback({ catalogSlug }: { catalogSlug: string }) {
	const [draftPreviewState, setDraftPreviewState] = useState<DraftPreviewState>(
		{
			status: "empty",
		},
	);

	useEffect(() => {
		setDraftPreviewState(readDraftPreview(catalogSlug));
	}, [catalogSlug]);

	if (draftPreviewState.status === "ready") {
		return (
			<main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4">
				<section className="max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
					<p className="text-sm font-semibold text-emerald-700">
						Rascunho encontrado
					</p>
					<h1 className="mt-2 text-2xl font-bold text-zinc-950">
						{draftPreviewState.catalogName}
					</h1>
					<p className="mt-2 text-zinc-600">
						Esta vitrine já tem um link reservado, mas ainda não foi publicada.
					</p>
				</section>
			</main>
		);
	}

	return (
		<main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4">
			<section className="max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
				<p className="text-sm font-semibold text-red-700">Erro</p>
				<h1 className="mt-2 text-2xl font-bold text-zinc-950">
					Vitrine não encontrada
				</h1>
				<p className="mt-2 text-zinc-600">
					Confira o link recebido ou peca um novo endereco ao negocio.
				</p>
			</section>
		</main>
	);
}

function readDraftPreview(catalogSlug: string): DraftPreviewState {
	const urlDraft = readUrlDraftPreview();
	if (urlDraft.status === "ready") {
		return urlDraft;
	}

	const storedDraft = readCatalogDraft();
	return readStoredDraftPreview(catalogSlug, storedDraft);
}

function readUrlDraftPreview(): DraftPreviewState {
	if (typeof window === "undefined") {
		return { status: "empty" };
	}

	const draftName = new URLSearchParams(window.location.search).get(
		"draftName",
	);
	if (!draftName) {
		return { status: "empty" };
	}

	return {
		status: "ready",
		catalogName: draftName,
	};
}

function readStoredDraftPreview(
	catalogSlug: string,
	storedDraft: StoredCatalogDraftState,
): DraftPreviewState {
	if (
		storedDraft.status === "ready" &&
		storedDraft.catalog.slug === catalogSlug &&
		storedDraft.catalog.status !== "published"
	) {
		return { status: "ready", catalogName: storedDraft.catalog.name };
	}

	return { status: "empty" };
}
