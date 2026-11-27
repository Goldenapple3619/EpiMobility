import { describe, expect, it } from 'vitest'
import { createMockApi } from './mockApi'

describe('mockApi', () => {
  const api = createMockApi({ latencyMs: 0 })

  it('pagine et recherche sans tenir compte des accents ni de la casse', async () => {
    const first = await api.universities.list({ page: 1, pageSize: 5 })
    expect(first).toMatchObject({ page: 1, pageSize: 5, totalItems: 7, totalPages: 2 })
    expect(first.items).toHaveLength(5)

    const search = await api.universities.list({ search: 'KAIRA' })
    expect(search.items.map((university) => university.name)).toEqual([
      'Institut technologique fictif de Kaïra',
    ])
  })

  it('renvoie une erreur 404 normalisée pour un identifiant inconnu', async () => {
    await expect(api.universities.get('inconnu')).rejects.toMatchObject({
      kind: 'http',
      status: 404,
    })
  })

  it('valide le nombre maximal de vœux', async () => {
    const tooMany = Array.from({ length: 6 }, (_, index) => ({
      universityId: `uni-fictive-0${index + 1}`,
      rank: index + 1,
    }))
    await expect(api.wishes.replaceMine(tooMany)).rejects.toMatchObject({
      kind: 'http',
      status: 422,
      code: 'TOO_MANY_WISHES',
    })
  })

  it('conserve les vœux enregistrés en mémoire', async () => {
    const localApi = createMockApi({ latencyMs: 0 })
    await localApi.wishes.replaceMine([{ universityId: 'uni-fictive-02', rank: 1 }])
    expect((await localApi.wishes.listMine()).map((wish) => wish.universityId)).toEqual([
      'uni-fictive-02',
    ])
  })

  it('respecte l’annulation', async () => {
    const slowApi = createMockApi({ latencyMs: 50 })
    const controller = new AbortController()
    const pending = slowApi.universities.list({}, { signal: controller.signal })
    controller.abort()
    await expect(pending).rejects.toMatchObject({ kind: 'aborted' })
  })

  it('renvoie des copies : modifier un résultat n’altère pas les données', async () => {
    const page = await api.universities.list({ pageSize: 1 })
    ;(page.items[0] as { name: string }).name = 'modifié'
    const again = await api.universities.list({ pageSize: 1 })
    expect(again.items[0].name).not.toBe('modifié')
  })
})
