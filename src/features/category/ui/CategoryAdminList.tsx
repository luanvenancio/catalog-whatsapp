import type { Category } from "#/features/category/schemas/categorySchemas";

export function CategoryAdminList({ categories }: { categories: Category[] }) {
	return (
		<section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
			<header>
				<h1 className="text-3xl font-bold text-zinc-950">Categorias</h1>
				<p className="mt-2 text-zinc-600">
					Organize a navegação da vitrine sem criar regras de venda.
				</p>
			</header>

			{categories.length === 0 ? (
				<div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-zinc-600">
					Nenhuma categoria criada. Produtos ainda podem aparecer sem categoria.
				</div>
			) : (
				<ul className="grid gap-3">
					{categories.map((category) => (
						<li
							className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
							key={category.id}
						>
							<p className="font-semibold text-zinc-950">{category.name}</p>
							<p className="text-sm text-zinc-500">Agrupamento da vitrine</p>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
