import {
  MOCK_CURRENT_STUDENT_ID,
  mockAssignment,
  mockRulesets,
  mockSimulations,
  mockStudents,
  mockWishes,
} from '@/mocks/data/fixtures'
import { mockUniversities } from '@/mocks/data/universities'
import type { Page, PageParams, Wish } from '@/types/domain'
import { ApiError, errorMessages, messageForStatus } from '../http/ApiError'
import type { CallOptions, EpiMobilityApi } from './types'

export type MockApiOptions = Readonly<{
  /** Latence simulée en ms pour rendre visibles les états de chargement (0 en test). */
  latencyMs?: number
}>

const DEFAULT_PAGE_SIZE = 20

function abortedError() {
  return new ApiError({ kind: 'aborted', message: errorMessages.aborted })
}

/** Simule un aller-retour réseau annulable. */
function respond<T>(value: () => T, latencyMs: number, { signal }: CallOptions = {}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortedError())
      return
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      try {
        resolve(structuredClone(value()))
      } catch (error) {
        reject(error)
      }
    }, latencyMs)
    function onAbort() {
      clearTimeout(timer)
      reject(abortedError())
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function paginate<T>(
  items: readonly T[],
  { page = 1, pageSize = DEFAULT_PAGE_SIZE }: PageParams,
): Page<T> {
  const safeSize = Math.max(1, Math.min(pageSize, 100))
  const totalPages = Math.max(1, Math.ceil(items.length / safeSize))
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * safeSize
  return {
    items: items.slice(start, start + safeSize),
    page: safePage,
    pageSize: safeSize,
    totalItems: items.length,
    totalPages,
  }
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
}

function notFound(): never {
  throw new ApiError({
    kind: 'http',
    status: 404,
    code: 'NOT_FOUND',
    message: messageForStatus(404),
  })
}

/**
 * Implémentation locale du contrat d'API, sans aucun appel réseau. Activée uniquement par
 * `VITE_API_MODE=mock`. Les vœux modifiés sont conservés en mémoire jusqu'au rechargement.
 */
export function createMockApi({ latencyMs = 400 }: MockApiOptions = {}): EpiMobilityApi {
  let wishes: readonly Wish[] = mockWishes

  return {
    mode: 'mock',
    universities: {
      list: (filters = {}, options) =>
        respond(
          () => {
            const search = filters.search ? normalize(filters.search.trim()) : ''
            const filtered = mockUniversities.filter(
              (university) =>
                (!search || normalize(`${university.name} ${university.city}`).includes(search)) &&
                (!filters.countryCode || university.countryCode === filters.countryCode),
            )
            return paginate(filtered, filters)
          },
          latencyMs,
          options,
        ),
      get: (id, options) =>
        respond(
          () => mockUniversities.find((university) => university.id === id) ?? notFound(),
          latencyMs,
          options,
        ),
    },
    students: {
      list: (params = {}, options) =>
        respond(
          () => {
            const search = params.search ? normalize(params.search.trim()) : ''
            const filtered = mockStudents.filter(
              (student) =>
                !search ||
                normalize(
                  `${student.firstName} ${student.lastName} ${student.studentNumber}`,
                ).includes(search),
            )
            return paginate(filtered, params)
          },
          latencyMs,
          options,
        ),
    },
    wishes: {
      listMine: (options) => respond(() => wishes, latencyMs, options),
      replaceMine: (input, options) =>
        respond(
          () => {
            const maxWishes = mockRulesets.find((ruleset) => ruleset.isActive)?.maxWishes ?? 5
            if (input.length > maxWishes) {
              throw new ApiError({
                kind: 'http',
                status: 422,
                code: 'TOO_MANY_WISHES',
                message: messageForStatus(422),
                fieldErrors: [{ field: 'wishes', message: `${maxWishes} vœux maximum.` }],
              })
            }
            const now = new Date().toISOString()
            wishes = input.map((wish, index) => ({
              id: `wish-demo-${index + 1}`,
              studentId: MOCK_CURRENT_STUDENT_ID,
              universityId: wish.universityId,
              rank: wish.rank,
              createdAt: now,
              updatedAt: now,
            }))
            return wishes
          },
          latencyMs,
          options,
        ),
    },
    assignments: {
      getMine: (options) => respond(() => mockAssignment, latencyMs, options),
    },
    rulesets: {
      list: (options) => respond(() => mockRulesets, latencyMs, options),
    },
    simulations: {
      list: (params = {}, options) =>
        respond(() => paginate(mockSimulations, params), latencyMs, options),
      get: (id, options) =>
        respond(
          () => mockSimulations.find((simulation) => simulation.id === id) ?? notFound(),
          latencyMs,
          options,
        ),
    },
  }
}
