const languageNames = new Intl.DisplayNames(['fr'], { type: 'language' })

/** Codes ISO 639-1 → noms en français (« en » → « anglais »). */
export function formatLanguages(codes: readonly string[]): string {
  return codes.map((code) => languageNames.of(code) ?? code).join(', ')
}
