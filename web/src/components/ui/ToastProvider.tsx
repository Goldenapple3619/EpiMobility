import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Alert } from './Alert'
import { ToastContext, type Toast, type ToastInput } from './toastContext'

/**
 * Notifications temporaires. Les zones `aria-live` existent dès le chargement pour que les
 * messages ajoutés soient annoncés. Pas de disparition automatique (WCAG 2.2.1) : l'utilisateur
 * ferme lui-même chaque notification.
 */
export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toasts, setToasts] = useState<readonly Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((toast: ToastInput) => {
    const id = nextId.current++
    setToasts((current) => [...current, { ...toast, id }])
    return id
  }, [])

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])
  const urgent = toasts.filter((toast) => toast.tone === 'danger')
  const polite = toasts.filter((toast) => toast.tone !== 'danger')

  function renderToast(toast: Toast) {
    return (
      <Alert
        key={toast.id}
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
      <section className="toast-region" aria-label="Notifications">
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
