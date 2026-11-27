import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/services/http/ApiError'
import { useAsyncResource } from './useAsyncResource'

describe('useAsyncResource', () => {
  it('annule la requête précédente lorsque la clé change, sans afficher d’erreur', async () => {
    const signals: AbortSignal[] = []
    const load = vi.fn((signal: AbortSignal) => {
      signals.push(signal)
      return new Promise<string>((resolve, reject) => {
        signal.addEventListener('abort', () =>
          reject(new ApiError({ kind: 'aborted', message: 'annulé' })),
        )
        setTimeout(() => resolve(`ok-${signals.length}`), 10)
      })
    })
    const { result, rerender } = renderHook(({ q }) => useAsyncResource(load, [q]), {
      initialProps: { q: 'a' },
    })
    expect(result.current.status).toBe('loading')
    rerender({ q: 'b' })
    expect(signals[0].aborted).toBe(true)
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.error).toBeNull()
  })

  it('annule la requête au démontage', () => {
    let captured: AbortSignal | undefined
    const { unmount } = renderHook(() =>
      useAsyncResource((signal) => {
        captured = signal
        return new Promise<never>(() => {})
      }, []),
    )
    unmount()
    expect(captured?.aborted).toBe(true)
  })

  it('expose une erreur puis recharge avec retry', async () => {
    const load = vi
      .fn<(signal: AbortSignal) => Promise<number>>()
      .mockRejectedValueOnce(new ApiError({ kind: 'http', status: 500, message: 'Panne.' }))
      .mockResolvedValue(42)
    const { result } = renderHook(() => useAsyncResource(load, []))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBe('Panne.')
    act(() => result.current.retry())
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.data).toBe(42))
  })
})
