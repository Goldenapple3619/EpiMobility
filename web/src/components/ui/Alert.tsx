import type { ReactNode } from 'react'
import type { Tone } from './Badge'
import { classNames } from './classNames'
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
}: AlertProps) {
  const role = live ? (tone === 'danger' ? 'alert' : 'status') : undefined

  return (
    <div className={classNames('alert', `alert--${tone}`, className)} role={role}>
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
        <button type="button" className="alert__dismiss" onClick={onDismiss}>
          <Icon name="close" />
          <span className="visually-hidden">Masquer le message</span>
        </button>
      ) : null}
    </div>
  )
}
