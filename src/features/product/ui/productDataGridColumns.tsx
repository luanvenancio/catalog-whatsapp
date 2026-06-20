import type { ColumnDef } from "@tanstack/react-table"
import { DataGridColumnHeader } from "#/components/reui/data-grid/data-grid-column-header"
import type { AdminProductSummary } from "#/features/catalog/queries/catalogServerQueries"
import { ProductStatusBadge } from "#/features/product/ui/ProductStatusBadge"
import { ProductSummaryCell } from "#/features/product/ui/ProductSummaryCell"

export const productDataGridColumns: ColumnDef<AdminProductSummary>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataGridColumnHeader column={column} title="Produto" />,
    cell: ({ row }) => <ProductSummaryCell product={row.original} />,
    meta: { headerTitle: "Produto" },
    size: 600,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ProductStatusBadge status={row.original.status} />,
    filterFn: "equals",
    enableSorting: false,
    meta: {
      headerTitle: "Status",
      headerClassName: "hidden sm:table-cell",
      cellClassName: "hidden sm:table-cell",
    },
    size: 140,
  },
]
