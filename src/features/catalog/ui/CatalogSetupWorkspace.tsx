import { useRouter } from "@tanstack/react-router"
import { type ReactNode, useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert"
import { Badge } from "#/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import {
  type MutationResult,
  saveCatalogIdentityToDatabase,
} from "#/features/catalog/commands/catalogServerCommands"
import type { AdminCatalogWorkspace } from "#/features/catalog/queries/catalogServerQueries"
import { CatalogDashboard } from "#/features/catalog/ui/CatalogDashboard"
import type { CatalogIdentityFormValues } from "#/features/catalog/ui/forms/CatalogIdentityFormSchema"
import { CreateCatalogForm } from "#/features/catalog/ui/forms/CreateCatalogForm"

type FeedbackState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "success"; message: string }
  | { status: "error"; message: string }

export function CatalogSetupWorkspace({ workspace }: { workspace: AdminCatalogWorkspace }) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<FeedbackState>({ status: "idle" })

  async function runMutation(mutation: () => Promise<MutationResult>) {
    setFeedback({ status: "saving" })
    const result = await mutation()

    if (!result.ok) {
      setFeedback({ status: "error", message: result.message })
      return
    }

    setFeedback({ status: "success", message: result.message })
    await router.invalidate()
  }

  if (workspace.status === "error") {
    return <WorkspaceError message={workspace.message} />
  }

  if (workspace.status === "empty") {
    return (
      <CreateCatalogWorkspace
        feedback={feedback}
        onCreate={(input) =>
          runMutation(() =>
            saveCatalogIdentityToDatabase({
              data: input,
            }),
          )
        }
      />
    )
  }

  return <CatalogDashboard catalog={workspace.catalog} products={workspace.products} />
}

function CreateCatalogWorkspace({
  feedback,
  onCreate,
}: {
  feedback: FeedbackState
  onCreate: (values: CatalogIdentityFormValues) => Promise<void>
}) {
  return (
    <main className="min-h-[calc(100dvh-7rem)] bg-background text-foreground">
      <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <header className="grid min-w-0 content-start gap-4">
          <Badge className="w-fit" variant="secondary">
            Comece em 1 minuto
          </Badge>
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Crie uma vitrine pronta para conversa
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Reserve o link publico e conecte o WhatsApp do negocio.
            </p>
          </div>
          <FormFeedback feedback={feedback} />
        </header>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Dados essenciais</CardTitle>
            <CardDescription>Informe o negocio, WhatsApp e slug publico.</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnly fallback={<FormSkeleton />}>
              <CreateCatalogForm isSaving={feedback.status === "saving"} onSubmit={onCreate} />
            </ClientOnly>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function ClientOnly({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? children : fallback
}

function FormSkeleton() {
  return (
    <div className="grid gap-4" aria-hidden="true">
      <div className="h-16 rounded-lg bg-muted" />
      <div className="h-16 rounded-lg bg-muted" />
      <div className="h-16 rounded-lg bg-muted" />
      <div className="h-9 rounded-lg bg-muted" />
    </div>
  )
}

function WorkspaceError({ message }: { message: string }) {
  return (
    <main className="min-h-[calc(100dvh-7rem)] bg-background px-4 py-6 text-foreground">
      <div className="mx-auto max-w-3xl">
        <Alert variant="destructive">
          <AlertTitle>Banco indisponivel</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </div>
    </main>
  )
}

function FormFeedback({ feedback }: { feedback: FeedbackState }) {
  if (feedback.status === "idle") return null

  if (feedback.status === "saving") {
    return (
      <p aria-live="polite" className="text-sm font-medium text-muted-foreground">
        Salvando alteracoes...
      </p>
    )
  }

  return (
    <p
      aria-live="polite"
      className={
        feedback.status === "error"
          ? "text-sm font-medium text-destructive"
          : "text-sm font-medium text-emerald-700"
      }
    >
      {feedback.message}
    </p>
  )
}
