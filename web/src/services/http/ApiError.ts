/**
 * - `network` : serveur injoignable ; `timeout` : délai dépassé ;
 * - `aborted` : requête annulée volontairement (changement de page…) — à ne pas afficher ;
 * - `http` : réponse 4xx/5xx ; `parse` : réponse illisible.
 */
export type ApiErrorKind = 'network' | 'timeout' | 'aborted' | 'http' | 'parse'

export type ApiFieldError = Readonly<{
  field: string
  message: string
}>

type ApiErrorInit = Readonly<{
  kind: ApiErrorKind
  message: string
  status?: number
  code?: string
  fieldErrors?: readonly ApiFieldError[]
  cause?: unknown
}>

/** Erreur unique exposée par le client HTTP et le mode mock. `message` est affichable. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null
  readonly code: string | null
  readonly fieldErrors: readonly ApiFieldError[]

  constructor(init: ApiErrorInit) {
    super(init.message, { cause: init.cause })
    this.name = 'ApiError'
    this.kind = init.kind
    this.status = init.status ?? null
    this.code = init.code ?? null
    this.fieldErrors = init.fieldErrors ?? []
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/** Vrai pour une annulation volontaire, qui ne doit pas être présentée comme une erreur. */
export function isAbortError(error: unknown): boolean {
  return isApiError(error) && error.kind === 'aborted'
}

const statusMessages: Readonly<Record<number, string>> = {
  400: 'La requête est invalide. Vérifiez les informations saisies.',
  401: 'Votre session a expiré. Reconnectez-vous pour continuer.',
  403: 'Vous n’avez pas les droits nécessaires pour cette action.',
  404: 'La ressource demandée est introuvable.',
  409: 'Cette action entre en conflit avec une modification récente. Rechargez la page.',
  422: 'Certaines informations sont invalides. Corrigez-les puis réessayez.',
  429: 'Trop de requêtes. Patientez quelques instants avant de réessayer.',
}

export function messageForStatus(status: number): string {
  if (statusMessages[status]) return statusMessages[status]
  if (status >= 500) return 'Le service rencontre un problème. Réessayez dans quelques instants.'
  return 'La requête n’a pas abouti.'
}

export const errorMessages = {
  network: 'Impossible de joindre le serveur. Vérifiez votre connexion puis réessayez.',
  timeout: 'Le serveur met trop de temps à répondre. Réessayez dans quelques instants.',
  aborted: 'La requête a été annulée.',
  parse: 'La réponse du serveur est illisible.',
} as const
