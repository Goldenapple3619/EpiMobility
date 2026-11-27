import { useEffect } from 'react'
import { useMatches } from 'react-router'
import { brand } from '@/app/brand'
import type { RouteHandle } from '@/types/navigation'

export const APP_TITLE = `EpiMobility · ${brand.institutionName}`

export function formatDocumentTitle(title?: string): string {
  return title ? `${title} · ${APP_TITLE}` : APP_TITLE
}

/**
 * Met à jour le titre de l'onglet (WCAG 2.4.2) à partir du `handle.title` de la route la plus
 * profonde, sauf si un titre explicite est fourni (pages d'erreur rendues sur place).
 */
export function useDocumentTitle(override?: string) {
  const matches = useMatches()
  const routeTitle = [...matches]
    .reverse()
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .find(Boolean)
  const title = override ?? routeTitle

  useEffect(() => {
    document.title = formatDocumentTitle(title)
  }, [title])
}
