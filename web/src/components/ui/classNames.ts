/** Concatène des classes CSS en ignorant les valeurs vides. */
export function classNames(...values: ReadonlyArray<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}
