import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('est un bouton de type "button" par défaut, activable au clavier', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Enregistrer</Button>)
    const button = screen.getByRole('button', { name: 'Enregistrer' })
    expect(button).toHaveAttribute('type', 'button')

    await user.tab()
    expect(button).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('reste focalisable mais n’exécute pas l’action pendant le chargement', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} isLoading loadingLabel="Enregistrement…">
        Enregistrer
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Enregistrement…' })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    await user.tab()
    expect(button).toHaveFocus()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('n’est ni focalisable ni activable lorsqu’il est désactivé', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Envoyer
      </Button>,
    )
    await user.tab()
    expect(screen.getByRole('button', { name: 'Envoyer' })).not.toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Envoyer' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
