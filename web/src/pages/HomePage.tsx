import { InfoCard } from '@/components/InfoCard'
import type { NavigationItem } from '@/types/navigation'

const sections: readonly NavigationItem[] = [
  { label: 'Catalogue', href: '#catalogue' },
  { label: 'Vœux', href: '#voeux' },
  { label: 'Administration', href: '#administration' },
]

export function HomePage() {
  return (
    <main id="main-content">
      <h1>Mobilité internationale</h1>
      <p>Plateforme pédagogique de mobilité pour une école fictive.</p>
      <InfoCard title="Structure du front-end">
        <p>Les fonctionnalités seront développées par modules indépendants.</p>
        <nav aria-label="Sections prévues">
          <ul>
            {sections.map(({ label, href }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        {sections.map(({ label, href }) => (
          <section key={href} id={href.slice(1)} aria-label={label}>
            <h3>{label}</h3>
            <p>Module en cours de préparation.</p>
          </section>
        ))}
      </InfoCard>
      <p>Projet pédagogique : partenariats fictifs.</p>
    </main>
  )
}
