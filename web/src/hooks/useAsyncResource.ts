import { useCallback, useEffect, useRef, useState } from 'react'
import { isAbortError, isApiError } from '@/services/http/ApiError'

export type AsyncResource<T> =
  | Readonly<{ status: 'loading'; data: null; error: null }>
  | Readonly<{ status: 'success'; data: T; error: null }>
  | Readonly<{ status: 'error'; data: null; error: string }>

type ResourceResult<T> = AsyncResource<T> & Readonly<{ retry: () => void }>

/** Valeurs simples identifiant la requête : tout changement relance le chargement. */
export type ResourceKey = ReadonlyArray<string | number | boolean | null | undefined>

type Settled<T> = Readonly<{ key: string; result: AsyncResource<T> }>

const GENERIC_ERROR = 'Une erreur inattendue est survenue.'
const LOADING = { status: 'loading', data: null, error: null } as const

/**
 * Charge une ressource avec annulation automatique (démontage ou changement de clé) et
 * relance manuelle. Les annulations ne sont jamais affichées comme des erreurs.
 * `load` peut changer à chaque rendu : seule `key` déclenche un nouveau chargement.
 */
export function useAsyncResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
  key: ResourceKey,
): ResourceResult<T> {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)
  const requestKey = JSON.stringify([...key, attempt])
  const loadRef = useRef(load)

  // Déclaré avant l'effet de chargement : la dernière fonction est en place quand il s'exécute.
  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    const controller = new AbortController()
    loadRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted)
          setSettled({ key: requestKey, result: { status: 'success', data, error: null } })
      },
      (error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return
        setSettled({
          key: requestKey,
          result: {
            status: 'error',
            data: null,
            error: isApiError(error) ? error.message : GENERIC_ERROR,
          },
        })
      },
    )
    return () => controller.abort()
  }, [requestKey])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])
  const result = settled?.key === requestKey ? settled.result : LOADING
  return { ...result, retry }
}
