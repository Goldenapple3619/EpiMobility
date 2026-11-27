import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useApi } from '@/services/api/useApi'
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
 * Session de démonstration côté navigateur, active UNIQUEMENT en mode mock. Elle ne constitue
 * PAS un contrôle d'accès : l'API doit vérifier l'identité et les droits à chaque requête.
 * En mode `http`, toute session simulée (stockée ou imposée) est ignorée et effacée.
 */
export function SessionProvider({ children, initialSession }: SessionProviderProps) {
  const demoEnabled = useApi().mode === 'mock'
  const [demoSession, setSession] = useState<DemoSession | null>(() =>
    initialSession === undefined ? readStoredSession() : initialSession,
  )
  const session = demoEnabled ? demoSession : null

  useEffect(() => {
    if (!demoEnabled) writeStoredRole(null)
  }, [demoEnabled])

  const signIn = useCallback(
    (role: Role) => {
      if (!demoEnabled) {
        throw new Error('La connexion de démonstration est désactivée hors mode mock.')
      }
      writeStoredRole(role)
      setSession(createDemoSession(role))
    },
    [demoEnabled],
  )

  const signOut = useCallback(() => {
    writeStoredRole(null)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ demoEnabled, session, signIn, signOut }),
    [demoEnabled, session, signIn, signOut],
  )

  return <SessionContext value={value}>{children}</SessionContext>
}
