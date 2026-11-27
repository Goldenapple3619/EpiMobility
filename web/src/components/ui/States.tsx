import type { ReactNode } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { Spinner } from './Spinner'

export function LoadingState({ label = 'Chargement en cours…' }: Readonly<{ label?: string }>) {
  return (
    <div className="state state--loading" role="status">
      <Spinner />
      <p>{label}</p>
    </div>
  )
}

type EmptyStateProps = Readonly<{
  title: string
  description?: ReactNode
  action?: ReactNode
}>

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="state state--empty">
      <Icon name="empty" className="state__icon" />
      <p className="state__title">{title}</p>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  )
}

type ErrorStateProps = Readonly<{
  title?: string
  message: ReactNode
  onRetry?: () => void
  retryLabel?: string
}>

export function ErrorState({
  title = 'Le chargement a échoué',
  message,
  onRetry,
  retryLabel = 'Réessayer',
}: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <Icon name="error" className="state__icon" />
      <p className="state__title">{title}</p>
      <p>{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
