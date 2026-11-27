export type NavigationItem = Readonly<{
  label: string
  href: string
  /** Active le lien uniquement sur l'URL exacte (utile pour les pages racines). */
  end?: boolean
}>

/** Métadonnées portées par chaque route via `handle`. */
export type RouteHandle = Readonly<{
  /** Titre de la page, utilisé pour `document.title`. */
  title?: string
  /** Libellé dans le fil d'Ariane. */
  crumb?: string
}>
