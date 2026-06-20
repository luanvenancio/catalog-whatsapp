export function ProductUpdatedAt({ value }: { value: string }) {
  const date = new Date(value)
  const today = new Date()
  const label =
    date.toDateString() === today.toDateString()
      ? "Hoje"
      : new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "short",
        }).format(date)

  return <time dateTime={value}>{label}</time>
}
