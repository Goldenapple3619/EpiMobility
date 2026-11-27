import { describe, expect, it } from 'vitest'

/** Sources applicatives (hors tests), lues comme texte. */
const sources = Object.entries(
  import.meta.glob<string>('/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true }),
).filter(([path]) => !/\.test\.tsx?$/.test(path) && !path.startsWith('/src/test/'))

describe('Séparation des données mock et réelles', () => {
  it('seul le module mockApi importe les données de src/mocks', () => {
    const importers = sources
      .filter(([, code]) => /from '@\/mocks\/|from '\.\.?\/.*mocks\//.test(code))
      .map(([path]) => path)
    expect(importers).toEqual(['/src/services/api/mockApi.ts'])
  })

  it('seul createApi charge mockApi, et uniquement par import dynamique réservé au dev', () => {
    const importers = sources
      .filter(([path]) => path !== '/src/services/api/mockApi.ts')
      .filter(([, code]) => /mockApi'\)?/.test(code) && /import\(|from '.*mockApi'/.test(code))
      .map(([path]) => path)
    expect(importers).toEqual(['/src/services/api/createApi.ts'])

    const createApiCode = sources.find(([path]) => path === '/src/services/api/createApi.ts')![1]
    expect(createApiCode).toMatch(/import\.meta\.env\.DEV \? \(\) => import\('\.\/mockApi'\)/)
    // Seul un import de type (effacé à la compilation) est autorisé statiquement.
    expect(createApiCode).not.toMatch(/^import \{[^}]*\} from '\.\/mockApi'/m)
  })

  it('les données mock sont toutes marquées fictives et sans source', async () => {
    const { mockUniversities } = await import('@/mocks/data/universities')
    for (const university of mockUniversities) {
      expect(university.isFictional).toBe(true)
      expect(university.sourceUrl).toBeNull()
      expect(university.name).toMatch(/fictif|fictive/i)
    }
    const { mockStudents } = await import('@/mocks/data/fixtures')
    for (const student of mockStudents) expect(student.email).toMatch(/@example\.org$/)
  })
})
