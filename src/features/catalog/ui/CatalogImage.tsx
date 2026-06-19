import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "#/lib/utils";

type CatalogImageProps = {
	alt: string;
	className?: string;
	containerClassName: string;
	loading?: "eager" | "lazy";
	src?: string;
};

export function CatalogImage({
	alt,
	className,
	containerClassName,
	loading = "lazy",
	src,
}: CatalogImageProps) {
	const [hasError, setHasError] = useState(false);
	const canDisplayImage = Boolean(src) && !hasError;

	return (
		<div className={cn("relative overflow-hidden bg-zinc-100", containerClassName)}>
			{canDisplayImage ? (
				<img
					alt={alt}
					className={cn("size-full object-cover", className)}
					decoding="async"
					loading={loading}
					onError={() => setHasError(true)}
					src={src}
				/>
			) : (
				<div className="grid size-full place-content-center gap-2 px-4 text-center text-zinc-500" role="img" aria-label={alt}>
					<ImageIcon aria-hidden="true" className="mx-auto size-7" />
					<span className="text-xs font-medium">Imagem indisponível</span>
				</div>
			)}
		</div>
	);
}
