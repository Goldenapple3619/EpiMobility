import type { ReactNode } from 'react'
import { classNames } from './classNames'

type CardProps = Readonly<{
  title: ReactNode
  /** Niveau de titre selon la hiérarchie de la page. */
  headingLevel?: 2 | 3 | 4
  eyebrow?: ReactNode
  footer?: ReactNode
  className?: string
  children?: ReactNode
}>

export function Card({ title, headingLevel = 3, eyebrow, footer, className, children }: CardProps) {
  const Heading = `h${headingLevel}` as const

  return (
    <article className={classNames('card', className)}>
      {eyebrow ? <p className="card__eyebrow">{eyebrow}</p> : null}
      <Heading className="card__title">{title}</Heading>
      {children ? <div className="card__body">{children}</div> : null}
      {footer ? <div className="card__footer">{footer}</div> : null}
    </article>
  )
}
