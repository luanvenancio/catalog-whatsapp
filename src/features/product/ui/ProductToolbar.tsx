import { Funnel, Plus, Search, X } from "lucide-react"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Checkbox } from "#/components/ui/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "#/components/ui/input-group"
import { Label } from "#/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover"

export type ProductStatusFilter = "all" | "draft" | "published" | "archived"
type FilterableStatus = Exclude<ProductStatusFilter, "all">

type ProductToolbarProps = {
  filteredCount: number
  hasActiveFilters: boolean
  onClear: () => void
  onCreate: () => void
  onSearchChange: (value: string) => void
  onStatusChange: (value: ProductStatusFilter | null) => void
  search: string
  status: ProductStatusFilter
  statusCounts: Record<FilterableStatus, number>
  totalCount: number
}

const statusOptions: ReadonlyArray<{ value: FilterableStatus; label: string }> = [
  { value: "published", label: "Publicados" },
  { value: "draft", label: "Rascunhos" },
  { value: "archived", label: "Arquivados" },
]

export function ProductToolbar(props: ProductToolbarProps) {
  const countLabel = props.hasActiveFilters
    ? `${props.filteredCount} de ${props.totalCount}`
    : `${props.totalCount} produtos`
  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mantenha sua vitrine clara e pronta para gerar conversas.
          </p>
        </div>
        <Button className="shrink-0" onClick={props.onCreate}>
          <Plus data-icon="inline-start" />
          <span className="hidden sm:inline">Novo produto</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <InputGroup className="min-w-52 flex-1 sm:w-64 sm:flex-none">
          <InputGroupAddon align="inline-start">
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Buscar produtos"
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder="Buscar produtos..."
            value={props.search}
          />
          {props.search ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Limpar busca"
                onClick={() => props.onSearchChange("")}
                size="icon-xs"
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
        <Popover>
          <PopoverTrigger
            render={
              <Button aria-label="Filtrar por status" variant="outline">
                <Funnel />
                Status
                {props.status !== "all" ? (
                  <Badge className="size-5 justify-center rounded-full p-0" variant="secondary">
                    1
                  </Badge>
                ) : null}
              </Button>
            }
          />
          <PopoverContent align="start" className="w-52">
            <p className="text-xs font-medium text-muted-foreground">Filtrar por status</p>
            <div className="grid gap-1">
              {statusOptions.map((option) => {
                const checked = props.status === option.value
                return (
                  <div
                    className="flex items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-muted/60"
                    key={option.value}
                  >
                    <Checkbox
                      checked={checked}
                      id={`status-${option.value}`}
                      onCheckedChange={() => props.onStatusChange(checked ? "all" : option.value)}
                    />
                    <Label
                      className="flex grow cursor-pointer items-center justify-between font-normal"
                      htmlFor={`status-${option.value}`}
                    >
                      <span>{option.label}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {props.statusCounts[option.value]}
                      </span>
                    </Label>
                  </div>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
        <span
          aria-live="polite"
          className="ml-auto whitespace-nowrap text-sm text-muted-foreground"
        >
          {countLabel}
        </span>
        {props.hasActiveFilters ? (
          <Button className="px-2" onClick={props.onClear} size="sm" variant="ghost">
            Limpar
          </Button>
        ) : null}
      </div>
    </div>
  )
}
