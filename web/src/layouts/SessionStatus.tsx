import { Link, useNavigate } from 'react-router'
import { paths } from '@/app/paths'
import { roleLabels } from '@/features/auth/session'
import { useSession } from '@/features/auth/useSession'

export function SessionStatus() {
  const { session, signOut } = useSession()
  const navigate = useNavigate()

  if (!session) {
    return (
      <Link className="session-status__link" to={paths.login}>
        Connexion <span className="session-status__hint">(démonstration)</span>
      </Link>
    )
  }

  async function handleSignOut() {
    // Quitter d'abord l'espace protégé : sinon la garde redirigerait vers la connexion.
    await navigate(paths.home)
    signOut()
  }

  return (
    <div className="session-status">
      <p className="session-status__label">
        <span className="visually-hidden">Session de démonstration : </span>
        <span aria-hidden="true">Démo · </span>
        {roleLabels[session.role]}
      </p>
      <button type="button" className="session-status__button" onClick={handleSignOut}>
        Se déconnecter
      </button>
    </div>
  )
}
