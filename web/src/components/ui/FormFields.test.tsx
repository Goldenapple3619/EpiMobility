import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '@/test/axe'
import { Checkbox } from './Checkbox'
import { RadioGroup } from './RadioGroup'
import { SelectField } from './SelectField'
import { TextField } from './TextField'

describe('TextField', () => {
  it('associe le libellé, l’aide et l’erreur au champ', async () => {
    const { container } = render(
      <TextField
        label="Adresse e-mail"
        required
        hint="Format : nom@domaine.fr"
        error="Adresse invalide."
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Adresse e-mail (obligatoire)' })
    expect(input).toBeRequired()
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Format : nom@domaine.fr Erreur : Adresse invalide.')
    // Le texte « Erreur : » rend l'erreur compréhensible sans la couleur.
    expect(screen.getByText('Erreur :', { exact: false })).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })

  it('n’est pas marqué invalide sans erreur', () => {
    render(<TextField label="Nom" />)
    expect(screen.getByRole('textbox', { name: 'Nom' })).not.toHaveAttribute('aria-invalid')
  })

  it('accepte la saisie clavier', async () => {
    const user = userEvent.setup()
    render(<TextField label="Nom" />)
    await user.tab()
    await user.keyboard('Camille')
    expect(screen.getByRole('textbox', { name: 'Nom' })).toHaveValue('Camille')
  })
})

describe('SelectField', () => {
  it('propose les options et respecte les options désactivées', async () => {
    const user = userEvent.setup()
    render(
      <SelectField
        label="Destination"
        placeholder="Choisir"
        options={[
          { value: 'a', label: 'Destination A' },
          { value: 'b', label: 'Destination B', disabled: true },
        ]}
      />,
    )
    const select = screen.getByRole('combobox', { name: 'Destination' })
    await user.selectOptions(select, 'a')
    expect(select).toHaveValue('a')
    expect(screen.getByRole('option', { name: 'Destination B' })).toBeDisabled()
  })
})

describe('Checkbox', () => {
  it('se coche avec la barre d’espace', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="J’accepte" />)
    const checkbox = screen.getByRole('checkbox', { name: 'J’accepte' })
    await user.tab()
    expect(checkbox).toHaveFocus()
    await user.keyboard(' ')
    expect(checkbox).toBeChecked()
  })

  it('expose son message d’erreur', () => {
    render(<Checkbox label="J’accepte" error="Cochez la case." />)
    expect(screen.getByRole('checkbox', { name: 'J’accepte' })).toHaveAccessibleDescription(
      'Erreur : Cochez la case.',
    )
  })
})

function ControlledRadioGroup() {
  const [value, setValue] = useState<'s1' | 's2' | null>(null)
  return (
    <RadioGroup
      legend="Semestre"
      name="semester"
      value={value}
      onChange={setValue}
      error={value ? undefined : 'Choisissez un semestre.'}
      options={[
        { value: 's1', label: 'Semestre 1' },
        { value: 's2', label: 'Semestre 2' },
      ]}
    />
  )
}

describe('RadioGroup', () => {
  it('forme un groupe nommé et se pilote au clavier', async () => {
    const user = userEvent.setup()
    const { container } = render(<ControlledRadioGroup />)
    const group = screen.getByRole('group', { name: 'Semestre' })
    expect(group).toHaveAccessibleDescription('Erreur : Choisissez un semestre.')

    await user.tab()
    expect(screen.getByRole('radio', { name: 'Semestre 1' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('radio', { name: 'Semestre 1' })).toBeChecked()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Semestre 2' })).toBeChecked()
    expect(screen.queryByText('Choisissez un semestre.')).not.toBeInTheDocument()
    await expectNoAxeViolations(container)
  })
})
