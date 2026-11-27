import { describe, expect, it } from 'vitest'
import { ApiConfigError, readApiConfig } from './config'

describe('readApiConfig', () => {
  it('utilise l’API réelle sur /api par défaut (jamais le mock implicitement)', () => {
    expect(readApiConfig({})).toEqual({ mode: 'http', baseUrl: '/api', timeoutMs: 10_000 })
  })

  it('active le mode mock uniquement sur demande explicite', () => {
    expect(readApiConfig({ VITE_API_MODE: 'mock' }).mode).toBe('mock')
  })

  it('accepte une URL et un délai personnalisés', () => {
    expect(
      readApiConfig({
        VITE_API_MODE: 'http',
        VITE_API_BASE_URL: 'https://api.exemple.test/v1/',
        VITE_API_TIMEOUT_MS: '2500',
      }),
    ).toEqual({ mode: 'http', baseUrl: 'https://api.exemple.test/v1', timeoutMs: 2500 })
  })

  it('interdit le mode mock dans un build de production', () => {
    expect(() => readApiConfig({ VITE_API_MODE: 'mock' }, { production: true })).toThrow(
      /interdit dans un build de production/,
    )
    expect(readApiConfig({ VITE_API_MODE: 'http' }, { production: true }).mode).toBe('http')
    expect(readApiConfig({}, { production: true }).mode).toBe('http')
  })

  it('refuse un mode inconnu au lieu de basculer silencieusement', () => {
    expect(() => readApiConfig({ VITE_API_MODE: 'fake' })).toThrow(ApiConfigError)
  })

  it('refuse un délai invalide', () => {
    expect(() => readApiConfig({ VITE_API_TIMEOUT_MS: 'abc' })).toThrow(ApiConfigError)
    expect(() => readApiConfig({ VITE_API_TIMEOUT_MS: '0' })).toThrow(ApiConfigError)
  })
})
