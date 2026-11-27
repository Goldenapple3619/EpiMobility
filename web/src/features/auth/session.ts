import { createContext } from 'react'

/**
 * Rôles applicatifs provisoires. La liste définitive et le mécanisme d'authentification
 * restent à valider avec le pôle Backend.
 */
export type Role = 'student' | 'admin'

export type DemoSession = Readonly<{
  role: Role
  displayName: string
}>

export type SessionContextValue = Readonly<{
  session: DemoSession | null
  signIn: (role: Role) => void
  signOut: () => void
}>

export const roleLabels: Readonly<Record<Role, string>> = {
  student: 'Étudiant',
  admin: 'Administration',
}

export const SESSION_STORAGE_KEY = 'epimobility.demo-session'

export function isRole(value: unknown): value is Role {
  return value === 'student' || value === 'admin'
}

export function createDemoSession(role: Role): DemoSession {
  return {
    role,
    displayName: role === 'student' ? 'Étudiant de démonstration' : 'Gestionnaire de démonstration',
  }
}

export const SessionContext = createContext<SessionContextValue | null>(null)
