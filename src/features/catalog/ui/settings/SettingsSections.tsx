import { Check, Copy, ImageIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"

type SectionProps = { children: React.ReactNode }

export function BusinessInformationCard({ children }: SectionProps) {
  return (
    <SettingsCard
      title="Informações do negócio"
      description="Dados usados para apresentar sua empresa na vitrine."
    >
      {children}
    </SettingsCard>
  )
}

export function ContactInformationCard({ children }: SectionProps) {
  return (
    <SettingsCard
      title="Contato"
      description="Canal utilizado pelos clientes para iniciar conversas."
    >
      {children}
    </SettingsCard>
  )
}

export function PublicCatalogCard({ children, slug }: SectionProps & { slug: string }) {
  const path = `/catalogs/${slug}`
  return (
    <SettingsCard
      title="Vitrine pública"
      description="Endereço usado para compartilhar seu catálogo."
    >
      <div className="grid gap-4">
        {children}
        <div className="grid gap-2">
          <p className="text-sm font-medium">Prévia da URL</p>
          <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/40 p-2.5">
            <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground sm:text-sm">
              {path}
            </code>
            <CopyPathButton path={path} />
          </div>
          {slug ? null : (
            <p className="text-sm text-muted-foreground">
              Defina um endereço para compartilhar sua vitrine.
            </p>
          )}
        </div>
      </div>
    </SettingsCard>
  )
}

export function CatalogCoverCard({ children, coverUrl }: SectionProps & { coverUrl: string }) {
  return (
    <SettingsCard
      title="Identidade visual"
      description="Uma capa horizontal ajuda clientes a reconhecer seu negócio."
    >
      <div className="grid gap-4">
        {children}
        <div className="aspect-[16/7] overflow-hidden rounded-xl border bg-muted">
          {coverUrl ? (
            <img alt="Prévia da imagem de capa" className="size-full object-cover" src={coverUrl} />
          ) : (
            <div className="grid size-full place-content-center gap-2 px-4 text-center text-muted-foreground">
              <ImageIcon className="mx-auto size-8" />
              <p className="text-sm font-medium">Nenhuma imagem de capa configurada.</p>
            </div>
          )}
        </div>
      </div>
    </SettingsCard>
  )
}

export function SettingsHeader({ actions }: { actions: React.ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-4 border-b pb-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure como sua vitrine aparece para os clientes.
        </p>
      </div>
      <div className="hidden items-center gap-2 sm:flex">{actions}</div>
    </header>
  )
}

export function SettingsMobileActions({ children }: SectionProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 flex flex-col-reverse gap-2 border-t bg-background/95 px-4 py-3 backdrop-blur sm:hidden">
      {children}
    </div>
  )
}

function SettingsCard({
  children,
  description,
  title,
}: SectionProps & { description: string; title: string }) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function CopyPathButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false)
  async function copyPath() {
    const url = new URL(path, window.location.origin).toString()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Button
      aria-label={copied ? "URL copiada" : "Copiar URL pública"}
      onClick={() => void copyPath()}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}
