import { useId, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { paths } from '@/app/paths'
import { Alert, Button, ButtonLink, RadioGroup } from '@/components/ui'
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

        <div id={noticeId} className="login-notice">
          <Alert tone="warning" title="Aucune authentification réelle">
            Ce choix de profil sert uniquement à parcourir les interfaces pendant le développement.
            Il ne donne accès à aucune donnée : l’authentification et le contrôle des droits seront
            assurés par l’API (mécanisme à définir avec le pôle Backend).
          </Alert>
        </div>

        {redirectTarget ? (
          <Alert tone="info" live>
            Connectez-vous avec un profil autorisé pour accéder à cette page.
          </Alert>
        ) : null}

        {session ? (
          <div className="login-current">
            <p>
              Session de démonstration active : <strong>{roleLabels[session.role]}</strong>.
            </p>
            <p className="login-current__actions">
              <ButtonLink to={homeByRole[session.role]}>Ouvrir mon espace</ButtonLink>
              <Button variant="secondary" onClick={signOut}>
                Se déconnecter
              </Button>
            </p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} aria-describedby={noticeId}>
            <RadioGroup
              legend="Choisissez un profil de démonstration"
              name="role"
              value={role}
              onChange={setRole}
              options={(Object.keys(roleLabels) as Role[]).map((value) => ({
                value,
                label: roleLabels[value],
              }))}
            />
            <Button type="submit">Ouvrir la session de démonstration</Button>
          </form>
        )}
      </div>
    </section>
  )
}
