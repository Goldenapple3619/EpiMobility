import { useRef, type ReactNode } from 'react'
import type { Tone } from './Badge'
import { classNames } from './classNames'
import { findFocusTargetAround } from './focus'
import { Icon, type IconName } from './Icon'

export type AlertTone = Exclude<Tone, 'neutral'>

const alertIcons: Readonly<Record<AlertTone, IconName>> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

const alertPrefixes: Readonly<Record<AlertTone, string>> = {
  info: 'Information',
  success: 'Succès',
  warning: 'Attention',
  danger: 'Erreur',
}

type AlertProps = Readonly<{
  tone?: AlertTone
  title?: string
  children: ReactNode
  onDismiss?: () => void
  /**
   * Élément qui reçoit le focus quand l'alerte est fermée. Par défaut : l'élément focalisable
   * qui suit l'alerte, sinon celui qui la précède, sinon le contenu principal.
   */
  getFocusTargetOnDismiss?: (alert: HTMLElement) => HTMLElement | null
  /** Identifiant de notification (usage interne de `ToastProvider`). */
  dataToastId?: number
  /**
   * Annonce aux technologies d'assistance lors de l'apparition. À activer pour un message
   * affiché en réaction à une action ; laisser désactivé pour un message présent au chargement.
   */
  live?: boolean
  className?: string
}>

/** Notification en ligne : icône, préfixe textuel (« Erreur », « Succès »…) et message. */
export function Alert({
  tone = 'info',
  title,
  children,
  onDismiss,
  live = false,
  className,
  getFocusTargetOnDismiss = findFocusTargetAround,
  dataToastId,
}: AlertProps) {
  const role = live ? (tone === 'danger' ? 'alert' : 'status') : undefined
  const alertRef = useRef<HTMLDivElement>(null)

  function handleDismiss() {
    const alert = alertRef.current
    // Le bouton va disparaître avec l'alerte : déplacer le focus avant la fermeture.
    if (alert && alert.contains(document.activeElement)) getFocusTargetOnDismiss(alert)?.focus()
    onDismiss?.()
  }

  return (
    <div
      ref={alertRef}
      className={classNames('alert', `alert--${tone}`, className)}
      role={role}
      data-toast-id={dataToastId}
    >
      <Icon name={alertIcons[tone]} className="alert__icon" />
      <div className="alert__content">
        <p className="alert__title">
          <span className={title ? 'visually-hidden' : undefined}>
            {alertPrefixes[tone]}
            {title ? ' :' : null}
          </span>
          {title ? ` ${title}` : null}
        </p>
        <div className="alert__message">{children}</div>
      </div>
      {onDismiss ? (
        <button type="button" className="alert__dismiss" onClick={handleDismiss}>
          <Icon name="close" />
          <span className="visually-hidden">Masquer le message</span>
        </button>
      ) : null}
    </div>
  )
}
