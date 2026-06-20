import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Eye, EyeOff, ImageIcon } from "lucide-react"
import { useState } from "react"

import { DataGrid, DataGridContainer } from "#/components/reui/data-grid/data-grid"
import { DataGridColumnHeader } from "#/components/reui/data-grid/data-grid-column-header"
import { DataGridPagination } from "#/components/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "#/components/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "#/components/reui/data-grid/data-grid-table"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import type { Product, ProductStatus } from "#/features/product/schemas/productSchemas"

type ProductAdminTableProps = {
  products: Product[]
  isSaving: boolean
  onChangeStatus: (product: Product, status: ProductStatus) => Promise<void>
}

const columnHelper = createColumnHelper<Product>()

const statusLabel: Record<ProductStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
}

export function ProductAdminTable({ products, isSaving, onChangeStatus }: ProductAdminTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = [
    columnHelper.accessor("name", {
      header: ({ column }) => <DataGridColumnHeader title="Product" column={column} />,
      enableSorting: true,
      size: 320,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-3">
          <img
            alt=""
            src={row.original.imageUrl}
            className="size-11 rounded-md border bg-muted object-cover"
          />

          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.name}</p>

            <p className="line-clamp-1 text-sm text-muted-foreground">{row.original.description}</p>
          </div>
        </div>
      ),
    }),

    columnHelper.accessor("status", {
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      enableSorting: true,
      size: 140,
      cell: ({ getValue }) => (
        <Badge variant={getValue() === "published" ? "default" : "secondary"}>
          {statusLabel[getValue()]}
        </Badge>
      ),
    }),

    columnHelper.accessor("priceLabel", {
      header: ({ column }) => <DataGridColumnHeader title="Preço" column={column} />,
      enableSorting: true,
      size: 160,
      cell: ({ getValue }) => getValue() ?? "Não informado",
    }),

    columnHelper.accessor("imageUrl", {
      header: "Imagem",
      enableSorting: false,
      size: 140,
      cell: ({ getValue }) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <ImageIcon className="size-4 text-muted-foreground" />
          {getValue() ? "Com imagem" : "Sem imagem"}
        </span>
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Ações",
      enableSorting: false,
      size: 220,
      cell: ({ row }) => {
        const product = row.original

        const nextStatus = product.status === "published" ? "draft" : "published"

        return (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isSaving}
            onClick={() => void onChangeStatus(product, nextStatus)}
          >
            {product.status === "published" ? (
              <EyeOff data-icon="inline-start" />
            ) : (
              <Eye data-icon="inline-start" />
            )}

            {product.status === "published" ? "Tornar rascunho" : "Publicar"}
          </Button>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: products,
    columns,

    state: {
      sorting,
      pagination,
    },

    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    pageCount: Math.ceil(products.length / pagination.pageSize),
  })

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
        Nenhum produto criado. Adicione o primeiro item para transformar a vitrine em algo
        conversável.
      </div>
    )
  }

  return (
    <DataGrid table={table} recordCount={products.length} tableLayout={{ dense: true }}>
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>

        <DataGridPagination />
      </div>
    </DataGrid>
  )
}
