import { useId, type ReactNode } from 'react'
import { classNames } from './classNames'
import { FieldError, FieldHint, RequiredMark } from './FieldMessages'

export type RadioOption<Value extends string> = Readonly<{
  value: Value
  label: ReactNode
  disabled?: boolean
}>

type RadioGroupProps<Value extends string> = Readonly<{
  legend: string
  name: string
  options: readonly RadioOption<Value>[]
  value: Value | null
  onChange: (value: Value) => void
  hint?: ReactNode
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  /** Préfixe des identifiants des options (`<prefix>-<value>`), pour y lier un récapitulatif. */
  idPrefix?: string
}>

/** Groupe de boutons radio natifs : les flèches du clavier changent la sélection. */
export function RadioGroup<Value extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
  error,
  required,
  disabled,
  className,
  idPrefix,
}: RadioGroupProps<Value>) {
  const generatedId = useId()
  const baseId = idPrefix ?? generatedId
  const hintId = `${baseId}-hint`
  const errorId = `${baseId}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <fieldset
      className={classNames('field field--group', error && 'field--invalid', className)}
      aria-describedby={describedBy}
      disabled={disabled}
    >
      <legend className="field__label">
        {legend}
        {required ? <RequiredMark /> : null}
      </legend>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      <div className="field__options">
        {options.map((option) => {
          const optionId = `${baseId}-${option.value}`
          return (
            <div className="choice" key={option.value}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                required={required}
                onChange={() => onChange(option.value)}
              />
              <label htmlFor={optionId}>{option.label}</label>
            </div>
          )
        })}
      </div>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </fieldset>
  )
}
