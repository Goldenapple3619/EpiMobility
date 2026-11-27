import { classNames } from './classNames'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'sm'

/** Classes d'un bouton, partagées par `Button` et `ButtonLink`. */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
) {
  return classNames('btn', `btn--${variant}`, size === 'sm' && 'btn--sm', extra)
}
