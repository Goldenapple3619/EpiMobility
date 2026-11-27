import { useEffect, useId, useRef } from 'react'

export type FormErrorEntry = Readonly<{
  fieldId: string
  message: string
}>

type ErrorSummaryProps = Readonly<{
  errors: readonly FormErrorEntry[]
  title?: string
}>

/**
 * Récapitulatif des erreurs d'un formulaire, focalisé à l'apparition ; chaque lien mène au
 * champ concerné (WCAG 3.3.1).
 */
export function ErrorSummary({
  errors,
  title = 'Le formulaire contient des erreurs',
}: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (errors.length > 0) ref.current?.focus()
  }, [errors])

  if (errors.length === 0) return null

  return (
    <div className="error-summary" ref={ref} tabIndex={-1} role="alert" aria-labelledby={titleId}>
      <h2 id={titleId} className="error-summary__title">
        {title} ({errors.length})
      </h2>
      <ul>
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a
              href={`#${error.fieldId}`}
              onClick={(event) => {
                event.preventDefault()
                document.getElementById(error.fieldId)?.focus()
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
