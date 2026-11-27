import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  createDemoSession,
  isRole,
  SESSION_STORAGE_KEY,
  SessionContext,
  type DemoSession,
  type Role,
} from './session'

function readStoredSession(): DemoSession | null {
  try {
    const storedRole = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
    return isRole(storedRole) ? createDemoSession(storedRole) : null
  } catch {
    return null
  }
}

function writeStoredRole(role: Role | null) {
  try {
    if (role) {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, role)
    } else {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  } catch {
    // Stockage indisponible (navigation privée stricte) : la session reste en mémoire.
  }
}

type SessionProviderProps = Readonly<{
  children: ReactNode
  /** Session initiale imposée, utilisée par les tests. */
  initialSession?: DemoSession | null
}>

/**
 * Session de démonstration côté navigateur. Elle ne constitue PAS un contrôle d'accès :
 * l'API doit vérifier l'identité et les droits à chaque requête.
 */
export function SessionProvider({ children, initialSession }: SessionProviderProps) {
  const [session, setSession] = useState<DemoSession | null>(() =>
    initialSession === undefined ? readStoredSession() : initialSession,
  )

  const signIn = useCallback((role: Role) => {
    writeStoredRole(role)
    setSession(createDemoSession(role))
  }, [])

  const signOut = useCallback(() => {
    writeStoredRole(null)
    setSession(null)
  }, [])

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut])

  return <SessionContext value={value}>{children}</SessionContext>
}
