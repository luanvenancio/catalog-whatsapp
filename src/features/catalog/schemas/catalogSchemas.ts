import type { Result } from "#/features/shared/result";

export type CatalogId = string & { readonly brand: "CatalogId" };
export type CatalogSlug = string & { readonly brand: "CatalogSlug" };

export type CatalogStatus = "draft" | "published" | "archived";

export type Catalog = {
	id: CatalogId;
	name: string;
	slug: CatalogSlug;
	whatsappNumber: string;
	description?: string;
	coverImageUrl?: string;
	status: CatalogStatus;
};

export type CatalogInputError =
	| { type: "invalid_catalog_name"; message: string }
	| { type: "invalid_catalog_slug"; message: string }
	| { type: "invalid_whatsapp_number"; message: string };

export type CreateCatalogInput = {
	name: string;
	slug: string;
	whatsappNumber: string;
};

export type UpdateCatalogIdentityInput = CreateCatalogInput & {
	id: CatalogId;
	description?: string;
	coverImageUrl?: string;
};

const publicSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const whatsappPattern = /^\d{10,15}$/;

export function parseCatalogName(
	name: string,
): Result<string, CatalogInputError> {
	const trimmedName = name.trim();

	if (trimmedName.length < 2) {
		return {
			ok: false,
			error: {
				type: "invalid_catalog_name",
				message: "O nome da vitrine deve ter pelo menos 2 caracteres.",
			},
		};
	}

	return { ok: true, value: trimmedName };
}

export function parseCatalogSlug(
	slug: string,
): Result<CatalogSlug, CatalogInputError> {
	const normalizedSlug = slug.trim().toLowerCase();

	if (!publicSlugPattern.test(normalizedSlug)) {
		return {
			ok: false,
			error: {
				type: "invalid_catalog_slug",
				message:
					"O identificador público deve usar letras minúsculas, números e hífens.",
			},
		};
	}

	return { ok: true, value: normalizedSlug as CatalogSlug };
}

export function parseWhatsappNumber(
	whatsappNumber: string,
): Result<string, CatalogInputError> {
	const digits = whatsappNumber.replace(/\D/g, "");

	if (!whatsappPattern.test(digits)) {
		return {
			ok: false,
			error: {
				type: "invalid_whatsapp_number",
				message: "Informe um WhatsApp com DDD e apenas números válidos.",
			},
		};
	}

	return { ok: true, value: digits };
}
