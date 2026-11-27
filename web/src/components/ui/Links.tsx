import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClassName, type ButtonSize, type ButtonVariant } from './buttonStyles'
import { classNames } from './classNames'
import { Icon } from './Icon'

type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant
  size?: ButtonSize
}

/** Lien de navigation présenté comme un bouton (ex. appel à l'action). */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonLinkProps) {
  return <Link {...props} className={buttonClassName(variant, size, className)} />
}

type TextLinkProps = Readonly<{
  /** Route interne (`paths`) ou URL externe complète si `external`. */
  to: string
  external?: boolean
  className?: string
  children: ReactNode
}>

/** Lien textuel. Les liens externes s'ouvrent dans un nouvel onglet, ce qui est annoncé. */
export function TextLink({ to, external = false, className, children }: TextLinkProps) {
  const linkClassName = classNames('link', className)

  if (external) {
    return (
      <a className={linkClassName} href={to} target="_blank" rel="noopener noreferrer">
        {children}
        <Icon name="external" className="link__icon" />{' '}
        <span className="visually-hidden">(s’ouvre dans un nouvel onglet)</span>
      </a>
    )
  }

  return (
    <Link className={linkClassName} to={to}>
      {children}
    </Link>
  )
}
