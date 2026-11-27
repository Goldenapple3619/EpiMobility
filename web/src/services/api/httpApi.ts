import type {
  Assignment,
  Page,
  Ruleset,
  Simulation,
  Student,
  University,
  Wish,
} from '@/types/domain'
import type { HttpClient } from '../http/httpClient'
import type { EpiMobilityApi } from './types'

/**
 * Routes PROVISOIRES, documentées dans `web/API_CONTRACTS.md` et à valider avec le Backend.
 * Elles sont relatives à `VITE_API_BASE_URL` (par défaut `/api`).
 */
export const endpoints = {
  universities: '/universities',
  university: (id: string) => `/universities/${encodeURIComponent(id)}`,
  students: '/students',
  myWishes: '/me/wishes',
  myAssignment: '/me/assignment',
  rulesets: '/rulesets',
  simulations: '/simulations',
  simulation: (id: string) => `/simulations/${encodeURIComponent(id)}`,
} as const

export function createHttpApi(client: HttpClient): EpiMobilityApi {
  return {
    mode: 'http',
    universities: {
      list: (filters = {}, { signal } = {}) =>
        client.get<Page<University>>(endpoints.universities, { query: filters, signal }),
      get: (id, { signal } = {}) => client.get<University>(endpoints.university(id), { signal }),
    },
    students: {
      list: (params = {}, { signal } = {}) =>
        client.get<Page<Student>>(endpoints.students, { query: params, signal }),
    },
    wishes: {
      listMine: ({ signal } = {}) => client.get<readonly Wish[]>(endpoints.myWishes, { signal }),
      replaceMine: (wishes, { signal } = {}) =>
        client.put<readonly Wish[]>(endpoints.myWishes, { wishes }, { signal }),
    },
    assignments: {
      getMine: async ({ signal } = {}) => {
        // À valider : 404 ou 200 + null lorsqu'aucune affectation n'est publiée.
        const assignment = await client.get<Assignment | null>(endpoints.myAssignment, { signal })
        return assignment ?? null
      },
    },
    rulesets: {
      list: ({ signal } = {}) => client.get<readonly Ruleset[]>(endpoints.rulesets, { signal }),
    },
    simulations: {
      list: (params = {}, { signal } = {}) =>
        client.get<Page<Simulation>>(endpoints.simulations, { query: params, signal }),
      get: (id, { signal } = {}) => client.get<Simulation>(endpoints.simulation(id), { signal }),
    },
  }
}
