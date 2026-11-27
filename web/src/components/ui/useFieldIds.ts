import { useId } from 'react'

export type FieldIds = Readonly<{
  inputId: string
  hintId: string
  errorId: string
}>

/** Identifiants stables reliant un champ à son aide et à son message d'erreur. */
export function useFieldIds(id?: string): FieldIds {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return { inputId, hintId: `${inputId}-hint`, errorId: `${inputId}-error` }
}

export function describedBy(
  ids: FieldIds,
  hasHint: boolean,
  hasError: boolean,
  extra?: string,
): string | undefined {
  const value = [extra, hasHint && ids.hintId, hasError && ids.errorId].filter(Boolean).join(' ')
  return value || undefined
}
