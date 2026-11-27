import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApi } from './createApi'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('bascule mock / API', () => {
  it('en mode mock, ne fait aucun appel réseau', async () => {
    const fetchSpy = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchSpy)
    const api = await createApi(
      { mode: 'mock', baseUrl: '/api', timeoutMs: 1000 },
      { mock: { latencyMs: 0 } },
    )

    const page = await api.universities.list({ pageSize: 3 })
    await api.wishes.listMine()
    await api.rulesets.list()

    expect(api.mode).toBe('mock')
    expect(page.items).toHaveLength(3)
    expect(page.items.every((university) => university.isFictional)).toBe(true)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('en mode http, interroge l’URL configurée avec le même contrat', async () => {
    const body = { items: [], page: 1, pageSize: 5, totalItems: 0, totalPages: 1 }
    const fetchSpy = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }))
    vi.stubGlobal('fetch', fetchSpy)
    const api = await createApi({ mode: 'http', baseUrl: '/api', timeoutMs: 1000 })

    await expect(
      api.universities.list({ search: 'valmont', page: 1, pageSize: 5 }),
    ).resolves.toEqual(body)

    expect(api.mode).toBe('http')
    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(fetchSpy.mock.calls[0][0]).toBe('/api/universities?search=valmont&page=1&pageSize=5')
  })

  it('en mode http, une panne du serveur reste une erreur (pas de repli sur le mock)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')),
    )
    const api = await createApi({ mode: 'http', baseUrl: '/api', timeoutMs: 1000 })
    await expect(api.universities.list()).rejects.toMatchObject({ kind: 'network' })
  })
})
