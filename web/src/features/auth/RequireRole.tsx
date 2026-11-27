import { Navigate, Outlet, useLocation } from 'react-router'
import { paths } from '@/app/paths'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import type { Role } from './session'
import { useSession } from './useSession'

type RequireRoleProps = Readonly<{
  allowed: readonly Role[]
}>

/**
 * Garde d'interface : évite d'afficher un espace à un rôle non prévu. Les écrans protégés ne
 * sont pas montés tant que le rôle n'est pas autorisé, donc aucune requête de données n'est
 * lancée. La sécurité réelle reste assurée par l'API (contrôle serveur à chaque requête).
 */
export function RequireRole({ allowed }: RequireRoleProps) {
  const { session } = useSession()
  const location = useLocation()

  if (!session) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }

  if (!allowed.includes(session.role)) {
    return (
      <PublicLayout documentTitle="Accès interdit">
        <ForbiddenPage />
      </PublicLayout>
    )
  }

  return <Outlet />
}
