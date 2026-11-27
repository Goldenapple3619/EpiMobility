import { ApiError, errorMessages, messageForStatus, type ApiFieldError } from './ApiError'

export type QueryValue = string | number | boolean | null | undefined
export type QueryParams = Readonly<Record<string, QueryValue | readonly QueryValue[]>>
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestOptions = Readonly<{
  method?: HttpMethod
  query?: QueryParams
  body?: unknown
  signal?: AbortSignal
  headers?: Readonly<Record<string, string>>
}>

export type HttpClientOptions = Readonly<{
  baseUrl: string
  timeoutMs: number
  fetchImpl?: typeof fetch
}>

export type HttpClient = Readonly<{
  request: <T>(path: string, options?: RequestOptions) => Promise<T>
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) => Promise<T>
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => Promise<T>
  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => Promise<T>
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) => Promise<T>
}>

export function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const params = new URLSearchParams()
  for (const [key, raw] of Object.entries(query ?? {})) {
    const values = Array.isArray(raw) ? raw : [raw]
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') params.append(key, String(value))
    }
  }
  const search = params.toString()
  return `${normalizedBase}${normalizedPath}${search ? `?${search}` : ''}`
}

/** Enveloppe d'erreur attendue (provisoire) : `{ "error": { "code", "message", "details" } }`. */
function readErrorEnvelope(body: unknown): { code?: string; fieldErrors?: ApiFieldError[] } {
  if (typeof body !== 'object' || body === null || !('error' in body)) return {}
  const { error } = body
  if (typeof error !== 'object' || error === null) return {}
  const code = 'code' in error && typeof error.code === 'string' ? error.code : undefined
  const details = 'details' in error && Array.isArray(error.details) ? error.details : []
  const fieldErrors = details.flatMap((detail: unknown) =>
    typeof detail === 'object' &&
    detail !== null &&
    'field' in detail &&
    'message' in detail &&
    typeof detail.field === 'string' &&
    typeof detail.message === 'string'
      ? [{ field: detail.field, message: detail.message }]
      : [],
  )
  return { code, fieldErrors }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  return text ? JSON.parse(text) : undefined
}

/**
 * Client HTTP centralisé : URL configurable, délai maximal, annulation, JSON et erreurs
 * normalisées en `ApiError`. Aucun jeton n'est ajouté ici : le mécanisme d'authentification
 * (cookie de session ou en-tête) reste à définir avec le pôle Backend.
 */
export function createHttpClient({
  baseUrl,
  timeoutMs,
  fetchImpl = (...args) => globalThis.fetch(...args),
}: HttpClientOptions): HttpClient {
  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', query, body, signal, headers } = options
    if (signal?.aborted) throw new ApiError({ kind: 'aborted', message: errorMessages.aborted })
    const controller = new AbortController()
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)
    const abortFromCaller = () => controller.abort()
    signal?.addEventListener('abort', abortFromCaller, { once: true })

    try {
      let response: Response
      try {
        response = await fetchImpl(buildUrl(baseUrl, path, query), {
          method,
          headers: {
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...headers,
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          credentials: 'same-origin',
          signal: controller.signal,
        })
      } catch (cause) {
        if (timedOut) throw new ApiError({ kind: 'timeout', message: errorMessages.timeout, cause })
        if (controller.signal.aborted)
          throw new ApiError({ kind: 'aborted', message: errorMessages.aborted, cause })
        throw new ApiError({ kind: 'network', message: errorMessages.network, cause })
      }

      if (!response.ok) {
        let envelope: ReturnType<typeof readErrorEnvelope> = {}
        try {
          envelope = readErrorEnvelope(await readJson(response))
        } catch {
          // Corps non JSON (page d'erreur du proxy…) : on garde le message par statut.
        }
        throw new ApiError({
          kind: 'http',
          status: response.status,
          message: messageForStatus(response.status),
          code: envelope.code,
          fieldErrors: envelope.fieldErrors,
        })
      }

      if (response.status === 204) return undefined as T
      try {
        return (await readJson(response)) as T
      } catch (cause) {
        if (controller.signal.aborted)
          throw timedOut
            ? new ApiError({ kind: 'timeout', message: errorMessages.timeout, cause })
            : new ApiError({ kind: 'aborted', message: errorMessages.aborted, cause })
        throw new ApiError({
          kind: 'parse',
          status: response.status,
          message: errorMessages.parse,
          cause,
        })
      }
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abortFromCaller)
    }
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  }
}
