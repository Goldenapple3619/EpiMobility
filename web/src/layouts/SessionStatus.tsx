import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { paths } from '@/app/paths'
import { Button } from '@/components/ui'
import { roleLabels } from '@/features/auth/session'
import { useSession } from '@/features/auth/useSession'

function isFocusLost() {
  return !document.activeElement || document.activeElement === document.body
}

export function SessionStatus() {
  const { demoEnabled, session, signOut } = useSession()
  const navigate = useNavigate()
  const loginLinkRef = useRef<HTMLAnchorElement>(null)
  const restoreFocusAfterSignOut = useRef(false)

  // Le bouton « Se déconnecter » disparaît : si aucun changement de page n'a déplacé le focus
  // (déconnexion depuis l'accueil), il est placé sur le lien « Connexion » qui le remplace.
  useEffect(() => {
    if (session || !restoreFocusAfterSignOut.current) return
    restoreFocusAfterSignOut.current = false
    if (isFocusLost()) loginLinkRef.current?.focus()
  }, [session])

  if (!session) {
    return (
      <Link ref={loginLinkRef} className="session-status__link" to={paths.login}>
        Connexion
        {demoEnabled ? (
          <>
            {' '}
            <span className="session-status__hint">(démonstration)</span>
          </>
        ) : null}
      </Link>
    )
  }

  async function handleSignOut() {
    restoreFocusAfterSignOut.current = true
    // Quitter d'abord l'espace protégé : sinon la garde redirigerait vers la connexion.
    await navigate(paths.home)
    signOut()
  }

  return (
    <div className="session-status">
      <p className="session-status__label">
        <span className="visually-hidden">Session de démonstration :</span>{' '}
        <span aria-hidden="true">Démo · </span>
        {roleLabels[session.role]}
      </p>
      <Button variant="secondary" size="sm" onClick={handleSignOut}>
        Se déconnecter
      </Button>
    </div>
  )
}
