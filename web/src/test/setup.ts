import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  window.sessionStorage.clear()
})

// jsdom n'implémente pas le défilement : ScrollRestoration et les liens d'évitement l'appellent.
window.scrollTo = () => {}

// jsdom ne fournit pas showModal/close : comportement minimal pour tester la logique React.
// Le piège de focus et l'inertie de la page relèvent du navigateur (vérifiés manuellement).
if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
