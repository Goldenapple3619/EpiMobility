import type { ReactNode } from 'react'
import { Icon } from './Icon'

export function FieldHint({ id, children }: Readonly<{ id: string; children: ReactNode }>) {
  return (
    <p id={id} className="field__hint">
      {children}
    </p>
  )
}

/** Message d'erreur : icône + préfixe textuel, l'information ne repose pas sur la couleur. */
export function FieldError({ id, children }: Readonly<{ id: string; children: ReactNode }>) {
  return (
    <p id={id} className="field__error">
      <Icon name="error" />
      <span>
        <span className="visually-hidden">Erreur :</span> {children}
      </span>
    </p>
  )
}

/** L'espace est hors du `<span>` : sinon il disparaît du nom accessible calculé. */
export function RequiredMark() {
  return (
    <>
      {' '}
      <span className="field__required">(obligatoire)</span>
    </>
  )
}
