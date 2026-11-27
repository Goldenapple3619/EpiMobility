import type { MouseEvent } from 'react'

export const MAIN_CONTENT_ID = 'main-content'

/** Premier élément focalisable de chaque page : permet d'ignorer l'en-tête et les menus. */
export function SkipLink() {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(MAIN_CONTENT_ID)
    if (!target) return
    event.preventDefault()
    target.focus()
    target.scrollIntoView?.()
  }

  return (
    <a className="skip-link" href={`#${MAIN_CONTENT_ID}`} onClick={handleClick}>
      Aller au contenu principal
    </a>
  )
}
