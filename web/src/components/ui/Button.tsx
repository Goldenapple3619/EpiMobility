import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles'
import { Spinner } from './Spinner'

type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Action en cours : le bouton reste focalisable mais n'est plus activable. */
  isLoading?: boolean
  /** Libellé affiché pendant le chargement (ex. « Enregistrement… »). */
  loadingLabel?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingLabel,
  type = 'button',
  className,
  onClick,
  children,
  ...props
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isLoading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <button
      {...props}
      type={type}
      className={buttonClassName(variant, size, className)}
      aria-disabled={isLoading || undefined}
      aria-busy={isLoading || undefined}
      onClick={handleClick}
    >
      {isLoading ? <Spinner /> : null}
      <span>{isLoading && loadingLabel ? loadingLabel : children}</span>
    </button>
  )
}
