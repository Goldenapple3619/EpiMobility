import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { MAIN_CONTENT_ID } from './SkipLink'

/**
 * Après chaque changement de page (hors premier affichage), le focus est placé sur la zone
 * principale pour que les lecteurs d'écran et la navigation clavier repartent du contenu.
 */
function useFocusMainOnNavigation() {
  const { pathname } = useLocation()
  // Comparaison au chemin précédent (et non un drapeau « premier rendu ») : reste correct
  // lorsque React StrictMode exécute les effets deux fois au montage.
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current === pathname) return
    previousPathname.current = pathname
    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true })
  }, [pathname])
}

export function RootRoute() {
  useFocusMainOnNavigation()

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
