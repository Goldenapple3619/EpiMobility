const TABBABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/** Zone principale des layouts (`<main id="main-content" tabIndex={-1}>`). */
const MAIN_CONTENT_ID = 'main-content'

function isAvailable(element: HTMLElement) {
  return !element.closest('[hidden], [inert], [aria-hidden="true"]')
}

/**
 * Cible de focus lorsqu'un élément focalisé va disparaître (alerte ou notification fermée) :
 * l'élément focalisable qui le suit, sinon celui qui le précède, sinon le contenu principal.
 * Évite que le focus retombe sur `<body>` (WCAG 2.4.3).
 */
export function findFocusTargetAround(element: HTMLElement): HTMLElement | null {
  const candidates = [...document.querySelectorAll<HTMLElement>(TABBABLE)].filter(
    (candidate) => !element.contains(candidate) && isAvailable(candidate),
  )
  const next = candidates.find(
    (candidate) => element.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING,
  )
  const previous = candidates
    .filter(
      (candidate) => element.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_PRECEDING,
    )
    .at(-1)
  return next ?? previous ?? document.getElementById(MAIN_CONTENT_ID)
}

export function focusMainContent() {
  document.getElementById(MAIN_CONTENT_ID)?.focus()
}
