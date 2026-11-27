import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Icon } from './Icon'

type ModalProps = Readonly<{
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children?: ReactNode
  /** Actions principales (boutons) affichées en bas de la fenêtre. */
  actions?: ReactNode
}>

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Fenêtre modale basée sur `<dialog>` natif (`showModal`) : le reste de la page devient inerte,
 * Échap ferme la fenêtre et le focus revient sur l'élément qui l'a ouverte.
 */
export function Modal({ open, onClose, title, description, children, actions }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!dialog.open) dialog.showModal()
    const firstFocusable = dialog.querySelector<HTMLElement>(`.modal__body ${FOCUSABLE}`)
    ;(firstFocusable ?? dialog.querySelector<HTMLElement>(FOCUSABLE))?.focus()

    return () => {
      if (dialog.open) dialog.close()
      opener?.focus()
    }
  }, [open])

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onKeyDown={handleKeyDown}
      onCancel={(event) => {
        // Échap : l'état React reste la source de vérité.
        event.preventDefault()
        onClose()
      }}
    >
      {open ? (
        <div className="modal__panel">
          <div className="modal__header">
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
            <button type="button" className="modal__close" onClick={onClose}>
              <Icon name="close" />
              <span className="visually-hidden">Fermer la fenêtre</span>
            </button>
          </div>
          {description ? (
            <p id={descriptionId} className="modal__description">
              {description}
            </p>
          ) : null}
          {children ? <div className="modal__body">{children}</div> : null}
          {actions ? <div className="modal__actions">{actions}</div> : null}
        </div>
      ) : null}
    </dialog>
  )
}
