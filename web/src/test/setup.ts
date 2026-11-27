import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  window.sessionStorage.clear()
})

// jsdom n'implémente pas le défilement : ScrollRestoration et les liens d'évitement l'appellent.
window.scrollTo = () => {}
