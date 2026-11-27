type PlaceholderPageProps = Readonly<{
  space: string
  title: string
  description: string
  /** Référence de l'issue qui réalisera l'écran (ex. « WEB-08 »). */
  plannedIn?: string
}>

/** Écran explicite indiquant qu'une fonctionnalité n'est pas encore réalisée. */
export function PlaceholderPage({ space, title, description, plannedIn }: PlaceholderPageProps) {
  return (
    <section className="section page-section" aria-labelledby="page-title">
      <div className="container">
        <span className="eyebrow">{space}</span>
        <h1 id="page-title">{title}</h1>
        <p className="page-section__lead">{description}</p>
        <p className="placeholder-note">
          <strong>Écran en préparation.</strong> Cette page est un emplacement réservé : aucune
          donnée n’y est encore affichée.
          {plannedIn ? ` Réalisation prévue dans ${plannedIn}.` : null}
        </p>
      </div>
    </section>
  )
}
