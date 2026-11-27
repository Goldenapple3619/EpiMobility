export type ApiMode = 'mock' | 'http'

export type ApiConfig = Readonly<{
  mode: ApiMode
  baseUrl: string
  timeoutMs: number
}>

type ApiEnv = Readonly<{
  VITE_API_MODE?: string
  VITE_API_BASE_URL?: string
  VITE_API_TIMEOUT_MS?: string
}>

export const DEFAULT_API_BASE_URL = '/api'
export const DEFAULT_TIMEOUT_MS = 10_000

export class ApiConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiConfigError'
  }
}

/**
 * Lit la configuration de l'API. Le mode mock doit être choisi explicitement
 * (`VITE_API_MODE=mock`) : il n'y a jamais de bascule automatique vers les données fictives.
 */
export function readApiConfig(env: ApiEnv = import.meta.env): ApiConfig {
  const rawMode = env.VITE_API_MODE?.trim() || 'http'
  if (rawMode !== 'mock' && rawMode !== 'http') {
    throw new ApiConfigError(
      `VITE_API_MODE invalide : « ${rawMode} ». Valeurs acceptées : « mock » ou « http ».`,
    )
  }

  const baseUrl = (env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL).replace(/\/+$/, '')

  const rawTimeout = env.VITE_API_TIMEOUT_MS?.trim()
  const timeoutMs = rawTimeout ? Number(rawTimeout) : DEFAULT_TIMEOUT_MS
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new ApiConfigError(`VITE_API_TIMEOUT_MS invalide : « ${rawTimeout} ».`)
  }

  return { mode: rawMode, baseUrl, timeoutMs }
}
