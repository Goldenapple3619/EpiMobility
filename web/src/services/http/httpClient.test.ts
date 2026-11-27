import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, isAbortError } from './ApiError'
import { buildUrl, createHttpClient } from './httpClient'

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

/** fetch qui ne répond jamais mais respecte l'annulation, comme un vrai navigateur. */
function hangingFetch(): typeof fetch {
  return (_input, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () =>
        reject(new DOMException('The operation was aborted.', 'AbortError')),
      )
    })
}

async function captureError(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise
  } catch (error) {
    if (error instanceof ApiError) return error
    throw error
  }
  throw new Error('La promesse aurait dû échouer.')
}

afterEach(() => {
  vi.useRealTimers()
})

describe('buildUrl', () => {
  it('assemble base, chemin et paramètres en ignorant les valeurs vides', () => {
    expect(
      buildUrl('/api/', 'universities', {
        page: 2,
        search: 'val mont',
        countryCode: undefined,
        q: '',
      }),
    ).toBe('/api/universities?page=2&search=val+mont')
  })

  it('répète les clés pour les tableaux', () => {
    expect(buildUrl('/api', '/x', { lang: ['fr', 'en'] })).toBe('/api/x?lang=fr&lang=en')
  })
})

describe('createHttpClient', () => {
  it('envoie une requête GET JSON vers l’URL configurée et renvoie le corps', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({ ok: true }))
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })

    await expect(client.get('/universities', { query: { page: 1 } })).resolves.toEqual({ ok: true })

    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('/api/universities?page=1')
    expect(init?.method).toBe('GET')
    expect(init?.credentials).toBe('same-origin')
    expect(init?.headers).toEqual({ Accept: 'application/json' })
    expect(init?.body).toBeUndefined()
  })

  it('sérialise le corps des requêtes d’écriture', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse([]))
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })

    await client.put('/me/wishes', { wishes: [{ universityId: 'u1', rank: 1 }] })

    const [, init] = fetchImpl.mock.calls[0]
    expect(init?.method).toBe('PUT')
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' })
    expect(init?.body).toBe('{"wishes":[{"universityId":"u1","rank":1}]}')
  })

  it('renvoie undefined pour une réponse 204', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }))
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })
    await expect(client.delete('/x')).resolves.toBeUndefined()
  })

  it('normalise une erreur HTTP avec enveloppe JSON (code et erreurs de champ)', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Détail technique interne',
            details: [{ field: 'rank', message: 'Rang invalide' }, { bad: true }],
          },
        },
        { status: 422 },
      ),
    )
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })
    const error = await captureError(client.get('/x'))

    expect(error.kind).toBe('http')
    expect(error.status).toBe(422)
    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.fieldErrors).toEqual([{ field: 'rank', message: 'Rang invalide' }])
    // Le message affichable est maîtrisé côté front, pas le texte brut du serveur.
    expect(error.message).toBe(
      'Certaines informations sont invalides. Corrigez-les puis réessayez.',
    )
  })

  it('normalise une erreur HTTP sans corps JSON (ex. page du proxy)', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('<html>Bad Gateway</html>', { status: 502 }))
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })
    const error = await captureError(client.get('/x'))
    expect(error).toMatchObject({ kind: 'http', status: 502, code: null })
    expect(error.message).toMatch(/Le service rencontre un problème/)
  })

  it('signale une panne réseau', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch'))
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })
    const error = await captureError(client.get('/x'))
    expect(error.kind).toBe('network')
    expect(error.message).toMatch(/Impossible de joindre le serveur/)
  })

  it('signale une réponse illisible', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('{pas du json', { status: 200 }))
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })
    expect((await captureError(client.get('/x'))).kind).toBe('parse')
  })

  it('distingue une annulation volontaire (non affichée) d’une erreur', async () => {
    const client = createHttpClient({
      baseUrl: '/api',
      timeoutMs: 10_000,
      fetchImpl: hangingFetch(),
    })
    const controller = new AbortController()
    const pending = client.get('/x', { signal: controller.signal })
    controller.abort()
    const error = await captureError(pending)
    expect(error.kind).toBe('aborted')
    expect(isAbortError(error)).toBe(true)
  })

  it('n’envoie rien si le signal est déjà annulé', async () => {
    const fetchImpl = vi.fn(hangingFetch())
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 1000, fetchImpl })
    const controller = new AbortController()
    controller.abort()
    expect((await captureError(client.get('/x', { signal: controller.signal }))).kind).toBe(
      'aborted',
    )
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('interrompt une requête trop longue (timeout)', async () => {
    vi.useFakeTimers()
    const client = createHttpClient({ baseUrl: '/api', timeoutMs: 5000, fetchImpl: hangingFetch() })
    const pending = captureError(client.get('/x'))
    await vi.advanceTimersByTimeAsync(5000)
    const error = await pending
    expect(error.kind).toBe('timeout')
    expect(isAbortError(error)).toBe(false)
  })
})
