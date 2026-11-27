import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { classNames } from './classNames'
import { FieldError, FieldHint, RequiredMark } from './FieldMessages'
import { describedBy, useFieldIds } from './useFieldIds'

export type SelectOption = Readonly<{
  value: string
  label: string
  disabled?: boolean
}>

type SelectFieldProps = Omit<ComponentPropsWithoutRef<'select'>, 'children'> & {
  label: string
  options: readonly SelectOption[]
  /** Première option vide, ex. « Choisir une destination ». */
  placeholder?: string
  hint?: ReactNode
  error?: string
}

export function SelectField({
  id,
  label,
  options,
  placeholder,
  hint,
  error,
  required,
  className,
  ...props
}: SelectFieldProps) {
  const ids = useFieldIds(id)

  return (
    <div className={classNames('field', error && 'field--invalid', className)}>
      <label className="field__label" htmlFor={ids.inputId}>
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      {hint ? <FieldHint id={ids.hintId}>{hint}</FieldHint> : null}
      <select
        {...props}
        id={ids.inputId}
        className="field__control field__control--select"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, Boolean(hint), Boolean(error))}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <FieldError id={ids.errorId}>{error}</FieldError> : null}
    </div>
  )
}
