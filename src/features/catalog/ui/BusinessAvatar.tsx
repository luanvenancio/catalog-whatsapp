const ignoredNameParts = new Set(["da", "das", "de", "do", "dos", "e"])

export function BusinessAvatar({ name }: { name: string }) {
  return (
    <div
      aria-hidden="true"
      className="grid size-16 shrink-0 place-items-center rounded-xl border-4 border-white bg-emerald-700 text-lg font-bold text-white shadow-sm sm:size-20 sm:text-xl"
    >
      {getBusinessInitials(name)}
    </div>
  )
}

function getBusinessInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const meaningfulWords = words.filter(
    (word) => !ignoredNameParts.has(word.toLocaleLowerCase("pt-BR")),
  )
  const initialsSource = meaningfulWords.length > 0 ? meaningfulWords : words

  return (
    initialsSource
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toLocaleUpperCase("pt-BR") || "?"
  )
}
