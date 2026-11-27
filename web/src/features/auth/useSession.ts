import { useContext } from 'react'
import { SessionContext, type SessionContextValue } from './session'

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext)
  if (!value) {
    throw new Error('useSession doit être utilisé dans un SessionProvider.')
  }
  return value
}
