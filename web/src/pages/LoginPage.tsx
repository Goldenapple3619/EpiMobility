import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
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

const ROLE_ID_PREFIX = 'login-role'

/** Mode `http` : aucune connexion simulée, les espaces protégés restent inaccessibles. */
function LoginUnavailable() {
  return (
    <section className="section page-section" aria-labelledby="login-title">
      <div className="container page-section__narrow">
        <span className="eyebrow">Accès aux espaces</span>
        <h1 id="login-title">Connexion</h1>
        <Alert tone="info" title="Connexion bientôt disponible">
          L’authentification sera fournie par l’API (mécanisme en cours de définition avec le pôle
          Backend). D’ici là, les espaces étudiant et administration ne sont pas accessibles.
        </Alert>
        <p className="login-current__actions">
          <ButtonLink to={paths.home} variant="secondary">
            Revenir à l’accueil
          </ButtonLink>
          <ButtonLink to={paths.help} variant="ghost">
            Consulter l’aide
          </ButtonLink>
        </p>
      </div>
    </section>
  )
}

export function LoginPage() {
  const { demoEnabled } = useSession()
  return demoEnabled ? <DemoLogin /> : <LoginUnavailable />
}

function DemoLogin() {
  const { session, signIn, signOut } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState<Role>('student')
  const noticeId = useId()
  const redirectTarget = readRedirectTarget(location.state)
  // « Se déconnecter » disparaît avec la session : le focus passe au formulaire qui le remplace.
  const focusFormAfterSignOut = useRef(false)

  useEffect(() => {
    if (!session && focusFormAfterSignOut.current) {
      focusFormAfterSignOut.current = false
      document.getElementById(`${ROLE_ID_PREFIX}-${role}`)?.focus()
    }
  }, [session, role])

  function handleSignOut() {
    focusFormAfterSignOut.current = true
    signOut()
  }

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
              <Button variant="secondary" onClick={handleSignOut}>
                Se déconnecter
              </Button>
            </p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} aria-describedby={noticeId}>
            <RadioGroup
              legend="Choisissez un profil de démonstration"
              name="role"
              idPrefix={ROLE_ID_PREFIX}
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
