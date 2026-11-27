import { isRouteErrorResponse, useRouteError } from 'react-router'
import { PublicLayout } from '@/layouts/PublicLayout'
import { NotFoundPage } from './NotFoundPage'

/** Écran affiché lorsqu'une route lève une erreur inattendue. */
export function RouteErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <PublicLayout documentTitle="Page introuvable">
        <NotFoundPage />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout documentTitle="Erreur">
      <section className="section status-page" aria-labelledby="route-error-title">
        <div className="container status-page__inner">
          <h1 id="route-error-title">Une erreur est survenue</h1>
          <p>
            La page n’a pas pu être affichée. Rechargez la page ou revenez plus tard. Si le problème
            persiste, signalez-le à l’équipe du projet.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
