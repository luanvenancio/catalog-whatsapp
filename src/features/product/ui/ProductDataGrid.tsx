import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  DataGrid,
  DataGridContainer,
} from "#/components/reui/data-grid/data-grid";
import { DataGridPagination } from "#/components/reui/data-grid/data-grid-pagination";
import { DataGridTable } from "#/components/reui/data-grid/data-grid-table";
import type { AdminProductSummary } from "#/features/catalog/queries/catalogServerQueries";
import { productDataGridColumns } from "#/features/product/ui/productDataGridColumns";
import {
  ProductToolbar,
  type ProductStatusFilter,
} from "#/features/product/ui/ProductToolbar";

export type ProductListSearch = {
  search?: string;
  status?: Exclude<ProductStatusFilter, "all">;
  page?: number;
  pageSize?: 10 | 25 | 50;
};
type ProductDataGridProps = {
  products: AdminProductSummary[];
  listSearch: ProductListSearch;
  onCreate: () => void;
  onEdit: (product: AdminProductSummary) => void;
};
const PAGE_SIZE = 10;

export function ProductDataGrid({
  products,
  listSearch,
  onCreate,
  onEdit,
}: ProductDataGridProps) {
  const navigate = useNavigate({ from: "/admin/products" });
  const [search, setSearch] = useState(listSearch.search ?? "");
  const status: ProductStatusFilter = listSearch.status ?? "all";
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    listSearch.status ? [{ id: "status", value: listSearch.status }] : [],
  );
  const pagination: PaginationState = {
    pageIndex: (listSearch.page ?? 1) - 1,
    pageSize: listSearch.pageSize ?? PAGE_SIZE,
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const value = search.trim() || undefined;
      if (value === listSearch.search) return;
      void navigate({
        search: (previous) => ({ ...previous, search: value, page: 1 }),
        replace: true,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [listSearch.search, navigate, search]);

  useEffect(() => {
    setColumnFilters(
      listSearch.status ? [{ id: "status", value: listSearch.status }] : [],
    );
  }, [listSearch.status]);
  const table = useReactTable({
    columns: productDataGridColumns,
    data: products,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, value: string) =>
      [row.original.name, row.original.description]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(value.trim().toLocaleLowerCase("pt-BR")),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearch,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      void navigate({
        search: (previous) => ({ ...previous, page: next.pageIndex + 1, pageSize: next.pageSize === PAGE_SIZE ? undefined : next.pageSize as 25 | 50 }),
      });
    },
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters, globalFilter: search, pagination, sorting },
  });
  const hasActiveFilters = search.trim().length > 0 || status !== "all";
  const statusCounts = products.reduce(
    (counts, product) => ({ ...counts, [product.status]: counts[product.status] + 1 }),
    { draft: 0, published: 0, archived: 0 },
  );

  function changeStatus(nextStatus: ProductStatusFilter | null) {
    const value = nextStatus ?? "all";
    table
      .getColumn("status")
      ?.setFilterValue(value === "all" ? undefined : value);
    void navigate({
      search: (previous) => ({
        ...previous,
        status: value === "all" ? undefined : value,
        page: 1,
      }),
    });
  }

  function clearFilters() {
    setSearch("");
    table.resetColumnFilters();
    void navigate({ search: () => ({ page: 1 }) });
  }

  return (
    <div className="grid gap-3">
      <ProductToolbar
        filteredCount={table.getFilteredRowModel().rows.length}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
        onCreate={onCreate}
        onSearchChange={setSearch}
        onStatusChange={changeStatus}
        search={search}
        status={status}
        statusCounts={statusCounts}
        totalCount={products.length}
      />
      <DataGrid
        emptyMessage={
          hasActiveFilters
            ? "Nenhum produto corresponde aos filtros."
            : "Nenhum produto criado."
        }
        onRowClick={onEdit}
        recordCount={table.getFilteredRowModel().rows.length}
        table={table}
        tableLayout={{
          headerBackground: true,
          rowBorder: true,
          width: "fixed",
        }}
      >
        <DataGridContainer className="overflow-hidden rounded-lg">
          <DataGridTable />
          <div className="border-t px-3 py-2 bg-background">
            <DataGridPagination
              info="{from}–{to} de {count}"
              rowsPerPageLabel="Linhas por página"
			  showPageSize={products.length > PAGE_SIZE}
			  sizes={[10, 25, 50]}
            />
          </div>
        </DataGridContainer>
      </DataGrid>
    </div>
  );
}
