import { Link, useMatches } from 'react-router'
import type { RouteHandle } from '@/types/navigation'

export function Breadcrumb() {
  const crumbs = useMatches()
    .map((match) => ({
      pathname: match.pathname,
      label: (match.handle as RouteHandle | undefined)?.crumb,
    }))
    .filter((crumb): crumb is { pathname: string; label: string } => Boolean(crumb.label))

  if (crumbs.length === 0) return null

  return (
    <nav className="breadcrumb" aria-label="Fil d’Ariane">
      <ol>
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1
          return (
            <li key={crumb.pathname}>
              {isCurrent ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link to={crumb.pathname}>{crumb.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
