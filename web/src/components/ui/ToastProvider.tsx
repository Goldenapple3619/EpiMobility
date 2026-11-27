import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Alert } from './Alert'
import { focusMainContent } from './focus'
import { ToastContext, type Toast, type ToastInput } from './toastContext'

/**
 * Notifications temporaires. Les zones `aria-live` existent dès le chargement pour que les
 * messages ajoutés soient annoncés. Pas de disparition automatique (WCAG 2.2.1) : l'utilisateur
 * ferme lui-même chaque notification.
 */
export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toasts, setToasts] = useState<readonly Toast[]>([])
  const nextId = useRef(1)
  /** Élément focalisé au moment de chaque notification (souvent le bouton déclencheur). */
  const openers = useRef(new Map<number, HTMLElement>())
  const regionRef = useRef<HTMLElement>(null)

  const dismiss = useCallback((id: number) => {
    openers.current.delete(id)
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((toast: ToastInput) => {
    const id = nextId.current++
    if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
      openers.current.set(id, document.activeElement)
    }
    setToasts((current) => [...current, { ...toast, id }])
    return id
  }, [])

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])
  const urgent = toasts.filter((toast) => toast.tone === 'danger')
  const polite = toasts.filter((toast) => toast.tone !== 'danger')

  /**
   * À la fermeture d'une notification : focus sur la notification restante la plus récente,
   * sinon sur l'élément qui l'a déclenchée (s'il existe encore), sinon sur le contenu principal.
   */
  function focusTargetAfter(id: number) {
    return () => {
      const remaining = [
        ...(regionRef.current?.querySelectorAll<HTMLElement>('.alert__dismiss') ?? []),
      ].filter((button) => !button.closest(`[data-toast-id="${id}"]`))
      const opener = openers.current.get(id)
      if (remaining.length > 0) return remaining[remaining.length - 1]
      if (opener?.isConnected && !regionRef.current?.contains(opener)) return opener
      focusMainContent()
      return null
    }
  }

  function renderToast(toast: Toast) {
    return (
      <Alert
        key={toast.id}
        getFocusTargetOnDismiss={focusTargetAfter(toast.id)}
        dataToastId={toast.id}
        tone={toast.tone ?? 'info'}
        title={toast.title}
        onDismiss={() => dismiss(toast.id)}
        className="toast"
      >
        {toast.message}
      </Alert>
    )
  }

  return (
    <ToastContext value={value}>
      {children}
      <section ref={regionRef} className="toast-region" aria-label="Notifications">
        <div aria-live="assertive" aria-relevant="additions">
          {urgent.map(renderToast)}
        </div>
        <div aria-live="polite" aria-relevant="additions">
          {polite.map(renderToast)}
        </div>
      </section>
    </ToastContext>
  )
}
