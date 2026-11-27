import type { ApiConfig } from '../config'
import { ApiConfigError } from '../config'
import { createHttpClient } from '../http/httpClient'
import { createHttpApi } from './httpApi'
import type { MockApiOptions } from './mockApi'
import type { EpiMobilityApi } from './types'

type CreateApiOptions = Readonly<{
  fetchImpl?: typeof fetch
  mock?: MockApiOptions
}>

/**
 * Chargement du mode mock, défini uniquement hors production. En build de production,
 * `import.meta.env.DEV` vaut `false` : l'import dynamique est supprimé et ni `mockApi` ni
 * les données de `src/mocks/` ne sont inclus dans le bundle (vérifié par `npm run check:bundle`).
 */
const loadMockApi = import.meta.env.DEV ? () => import('./mockApi') : null

/** Point unique de bascule mock/API, piloté par la configuration. */
export async function createApi(
  config: ApiConfig,
  options: CreateApiOptions = {},
): Promise<EpiMobilityApi> {
  if (config.mode === 'mock') {
    if (!loadMockApi) {
      throw new ApiConfigError('Le mode mock n’est pas disponible dans un build de production.')
    }
    const { createMockApi } = await loadMockApi()
    return createMockApi(options.mock)
  }
  return createHttpApi(
    createHttpClient({
      baseUrl: config.baseUrl,
      timeoutMs: config.timeoutMs,
      fetchImpl: options.fetchImpl,
    }),
  )
}
