import { Link, type LinkComponentProps } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

type ButtonLinkProps = LinkComponentProps &
	VariantProps<typeof buttonVariants>;

export function ButtonLink({
	className,
	size = "default",
	variant = "default",
	...props
}: ButtonLinkProps) {
	return (
		<Link
			className={cn(buttonVariants({ className, size, variant }))}
			{...props}
		/>
	);
}
