import { Link } from 'react-router'
import { paths } from '@/app/paths'

export function NotFoundPage() {
  return (
    <section className="section status-page" aria-labelledby="not-found-title">
      <div className="container status-page__inner">
        <p className="status-page__code" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-title">Page introuvable</h1>
        <p>
          L’adresse demandée ne correspond à aucune page. Elle a peut-être été déplacée ou saisie
          avec une erreur.
        </p>
        <p>
          <Link className="button-primary" to={paths.home}>
            Revenir à l’accueil
          </Link>
        </p>
      </div>
    </section>
  )
}
