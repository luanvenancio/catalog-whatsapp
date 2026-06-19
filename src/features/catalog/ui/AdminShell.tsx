import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, Settings } from "lucide-react";
import type { ReactNode } from "react";

type AdminShellProps = {
	businessName?: string;
	children: ReactNode;
};

const navigation = [
	{ label: "Visão geral", to: "/admin", icon: LayoutDashboard },
	{ label: "Produtos", to: "/admin/products", icon: Package },
	{ label: "Configuracoes", to: "/admin/settings", icon: Settings },
] as const;

export function AdminShell({
	businessName = "Minha vitrine",
	children,
}: AdminShellProps) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	return (
		<div className="min-h-dvh bg-muted/30 text-foreground">
			<header className="border-b bg-background">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
					<Link activeOptions={{ exact: true }} className="min-w-0" to="/admin">
						<span className="block truncate text-lg font-semibold">
							{businessName}
						</span>
						<span className="block text-xs text-muted-foreground">
							Administracao
						</span>
					</Link>
				</div>
				<nav aria-label="Navegacao administrativa" className="mx-auto w-full max-w-6xl overflow-x-auto px-4">
					<div className="flex min-w-max gap-1">
						{navigation.map((item) => {
							const isActive =
								item.to === "/admin"
									? pathname === item.to
									: pathname.startsWith(item.to);
							const Icon = item.icon;

							return (
								<Link
									aria-current={isActive ? "page" : undefined}
									activeOptions={{ exact: true }}
									className={
										isActive
											? "inline-flex h-10 items-center gap-2 border-b-2 border-foreground px-3 text-sm font-medium"
											: "inline-flex h-10 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
									}
									key={item.to}
									to={item.to}
									viewTransition
								>
									<Icon className="size-4" />
									{item.label}
								</Link>
							);
						})}
					</div>
				</nav>
			</header>
			{children}
		</div>
	);
}
