import { useId, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { paths } from '@/app/paths'
import { roleLabels, type Role } from '@/features/auth/session'
import { useSession } from '@/features/auth/useSession'

const homeByRole: Readonly<Record<Role, string>> = {
  student: paths.student.root,
  admin: paths.admin.root,
}

function readRedirectTarget(state: unknown): string | null {
  if (typeof state !== 'object' || state === null || !('from' in state)) return null
  const { from } = state
  // Uniquement des chemins internes à l'application.
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : null
}

function isTargetAllowed(target: string, role: Role): boolean {
  if (target.startsWith(paths.admin.root)) return role === 'admin'
  if (target.startsWith(paths.student.root)) return role === 'student'
  return true
}

export function LoginPage() {
  const { session, signIn, signOut } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState<Role>('student')
  const noticeId = useId()
  const redirectTarget = readRedirectTarget(location.state)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    signIn(role)
    const target =
      redirectTarget && isTargetAllowed(redirectTarget, role) ? redirectTarget : homeByRole[role]
    navigate(target, { replace: true })
  }

  return (
    <section className="section page-section" aria-labelledby="login-title">
      <div className="container page-section__narrow">
        <span className="eyebrow">Accès aux espaces</span>
        <h1 id="login-title">Connexion de démonstration</h1>

        <div className="notice" id={noticeId}>
          <p>
            <strong>Aucune authentification réelle.</strong> Ce choix de profil sert uniquement à
            parcourir les interfaces pendant le développement. Il ne donne accès à aucune donnée :
            l’authentification et le contrôle des droits seront assurés par l’API (mécanisme à
            définir avec le pôle Backend).
          </p>
        </div>

        {redirectTarget ? (
          <p role="status">Connectez-vous avec un profil autorisé pour accéder à cette page.</p>
        ) : null}

        {session ? (
          <div className="login-current">
            <p>
              Session de démonstration active : <strong>{roleLabels[session.role]}</strong>.
            </p>
            <p className="login-current__actions">
              <Link className="button-primary" to={homeByRole[session.role]}>
                Ouvrir mon espace
              </Link>
              <button type="button" className="button-secondary" onClick={signOut}>
                Se déconnecter
              </button>
            </p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} aria-describedby={noticeId}>
            <fieldset>
              <legend>Choisissez un profil de démonstration</legend>
              {(Object.keys(roleLabels) as Role[]).map((value) => (
                <label key={value} className="choice">
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value)}
                  />
                  {roleLabels[value]}
                </label>
              ))}
            </fieldset>
            <button type="submit" className="button-primary">
              Ouvrir la session de démonstration
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
