import { Link } from 'react-router'
import { paths } from '@/app/paths'
import { roleLabels } from '@/features/auth/session'
import { useSession } from '@/features/auth/useSession'

export function ForbiddenPage() {
  const { session } = useSession()

  return (
    <section className="section status-page" aria-labelledby="forbidden-title">
      <div className="container status-page__inner">
        <p className="status-page__code" aria-hidden="true">
          403
        </p>
        <h1 id="forbidden-title">Accès interdit</h1>
        <p>
          {session
            ? `Votre profil (${roleLabels[session.role]}) ne permet pas d’accéder à cet espace.`
            : 'Vous devez être connecté avec un profil autorisé pour accéder à cet espace.'}
        </p>
        <p>
          <Link className="button-primary" to={paths.home}>
            Revenir à l’accueil
          </Link>{' '}
          <Link className="text-link" to={paths.login}>
            Changer de profil
          </Link>
        </p>
      </div>
    </section>
  )
}
