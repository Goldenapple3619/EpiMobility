import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const toneIcons: Readonly<Record<Tone, IconName | null>> = {
  neutral: null,
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

type BadgeProps = Readonly<{
  tone?: Tone
  children: ReactNode
}>

/** Étiquette de statut : le texte porte toujours le sens, la couleur et l'icône le renforcent. */
export function Badge({ tone = 'neutral', children }: BadgeProps) {
  const icon = toneIcons[tone]
  return (
    <span className={`badge badge--${tone}`}>
      {icon ? <Icon name={icon} /> : null}
      {children}
    </span>
  )
}
