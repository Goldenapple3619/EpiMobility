import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from './classNames'
import { FieldError, FieldHint, RequiredMark } from './FieldMessages'
import { describedBy, useFieldIds } from './useFieldIds'

type TextFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: string
  type?: 'text' | 'email' | 'search' | 'password' | 'tel' | 'url' | 'number' | 'date'
  hint?: ReactNode
  error?: string
}

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  className,
  type = 'text',
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextFieldProps) {
  const ids = useFieldIds(id)

  return (
    <div className={classNames('field', error && 'field--invalid', className)}>
      <label className="field__label" htmlFor={ids.inputId}>
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      {hint ? <FieldHint id={ids.hintId}>{hint}</FieldHint> : null}
      <input
        {...props}
        id={ids.inputId}
        type={type}
        className="field__control"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, Boolean(hint), Boolean(error), ariaDescribedBy)}
      />
      {error ? <FieldError id={ids.errorId}>{error}</FieldError> : null}
    </div>
  )
}
