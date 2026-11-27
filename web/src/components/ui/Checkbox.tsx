import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from './classNames'
import { FieldError, FieldHint, RequiredMark } from './FieldMessages'
import { describedBy, useFieldIds } from './useFieldIds'

type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: ReactNode
  hint?: ReactNode
  error?: string
}

export function Checkbox({ id, label, hint, error, required, className, ...props }: CheckboxProps) {
  const ids = useFieldIds(id)

  return (
    <div className={classNames('field field--choice', error && 'field--invalid', className)}>
      <div className="choice">
        <input
          {...props}
          id={ids.inputId}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, Boolean(hint), Boolean(error))}
        />
        <label htmlFor={ids.inputId}>
          {label}
          {required ? <RequiredMark /> : null}
        </label>
      </div>
      {hint ? <FieldHint id={ids.hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={ids.errorId}>{error}</FieldError> : null}
    </div>
  )
}
