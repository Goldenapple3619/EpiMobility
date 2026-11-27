import type { ApiConfig } from '../config'
import { createHttpClient } from '../http/httpClient'
import { createHttpApi } from './httpApi'
import { createMockApi, type MockApiOptions } from './mockApi'
import type { EpiMobilityApi } from './types'

type CreateApiOptions = Readonly<{
  fetchImpl?: typeof fetch
  mock?: MockApiOptions
}>

/** Point unique de bascule mock/API, piloté par la configuration. */
export function createApi(config: ApiConfig, options: CreateApiOptions = {}): EpiMobilityApi {
  if (config.mode === 'mock') return createMockApi(options.mock)
  return createHttpApi(
    createHttpClient({
      baseUrl: config.baseUrl,
      timeoutMs: config.timeoutMs,
      fetchImpl: options.fetchImpl,
    }),
  )
}
