import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { brand } from '@/app/brand'
import { paths } from '@/app/paths'
import { BrandMark } from '@/components/BrandMark'
import type { NavigationItem } from '@/types/navigation'
import { Breadcrumb } from './Breadcrumb'
import { MockModeBanner } from './MockModeBanner'
import { SessionStatus } from './SessionStatus'
import { MAIN_CONTENT_ID, SkipLink } from './SkipLink'
import { useDocumentTitle } from './useDocumentTitle'

type AppShellProps = Readonly<{
  navigation: readonly NavigationItem[]
  navigationLabel: string
  /** Nom de l'espace affiché à côté du logo (ex. « Espace étudiant »). */
  spaceLabel?: string
  showBreadcrumb?: boolean
  /** Titre d'onglet imposé, prioritaire sur celui de la route. */
  documentTitle?: string
  children: ReactNode
}>

export function AppShell({
  navigation,
  navigationLabel,
  spaceLabel,
  showBreadcrumb = false,
  documentTitle,
  children,
}: AppShellProps) {
  useDocumentTitle(documentTitle)

  return (
    <div className="page-shell">
      <SkipLink />
      <MockModeBanner />

      <header className="site-header">
        <div
          className={`container site-header__inner${spaceLabel ? ' site-header__inner--app' : ''}`}
        >
          <div className="site-header__brand">
            <Link className="brand-link" to={paths.home}>
              <BrandMark />
              <span className="visually-hidden">, retour à l’accueil</span>
            </Link>
            {spaceLabel ? <span className="space-label">{spaceLabel}</span> : null}
          </div>
          <nav className="site-nav" aria-label={navigationLabel}>
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <NavLink to={item.href} end={item.end}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <SessionStatus />
        </div>
      </header>

      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="site-main">
        {showBreadcrumb ? (
          <div className="container">
            <Breadcrumb />
          </div>
        ) : null}
        {children}
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>{brand.institutionName}</p>
          <p>
            <strong>{brand.disclaimer}</strong>
          </p>
        </div>
      </footer>
    </div>
  )
}
