import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Alert } from './Alert'
import { Button } from './Button'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function DismissibleAlert({ before = true, after = true }: { before?: boolean; after?: boolean }) {
  const [visible, setVisible] = useState(true)
  return (
    <main id="main-content" tabIndex={-1}>
      {before ? <button type="button">Avant</button> : null}
      {visible ? (
        <Alert tone="info" onDismiss={() => setVisible(false)}>
          Message
        </Alert>
      ) : null}
      {after ? <button type="button">Après</button> : null}
    </main>
  )
}

describe('Fermeture d’une alerte : le focus ne retombe jamais sur <body>', () => {
  it('va sur l’élément suivant', async () => {
    const user = userEvent.setup()
    render(<DismissibleAlert />)
    await user.click(screen.getByRole('button', { name: 'Masquer le message' }))
    expect(screen.queryByText('Message')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Après' })).toHaveFocus()
  })

  it('va sur l’élément précédent s’il n’y a rien après', async () => {
    const user = userEvent.setup()
    render(<DismissibleAlert after={false} />)
    await user.click(screen.getByRole('button', { name: 'Masquer le message' }))
    expect(screen.getByRole('button', { name: 'Avant' })).toHaveFocus()
  })

  it('va sur le contenu principal s’il n’y a aucun autre élément focalisable', async () => {
    const user = userEvent.setup()
    render(<DismissibleAlert before={false} after={false} />)
    await user.click(screen.getByRole('button', { name: 'Masquer le message' }))
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('fonctionne au clavier (Entrée sur le bouton de fermeture)', async () => {
    const user = userEvent.setup()
    render(<DismissibleAlert />)
    screen.getByRole('button', { name: 'Masquer le message' }).focus()
    await user.keyboard('{Enter}')
    expect(document.body).not.toHaveFocus()
    expect(screen.getByRole('button', { name: 'Après' })).toHaveFocus()
  })
})

function ToastHarness() {
  const { notify } = useToast()
  return (
    <main id="main-content" tabIndex={-1}>
      <Button onClick={() => notify({ tone: 'success', message: 'Premier' })}>Notifier 1</Button>
      <Button onClick={() => notify({ tone: 'info', message: 'Second' })}>Notifier 2</Button>
    </main>
  )
}

describe('Fermeture d’une notification', () => {
  it('rend le focus au bouton qui l’a déclenchée', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'Notifier 1' })
    await user.click(trigger)
    screen.getByRole('button', { name: 'Masquer le message' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.queryByText('Premier')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('passe à la notification restante lorsqu’il en reste une', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Notifier 1' }))
    await user.click(screen.getByRole('button', { name: 'Notifier 2' }))
    const [first, second] = screen.getAllByRole('button', { name: 'Masquer le message' })
    await user.click(first)
    expect(screen.queryByText('Premier')).not.toBeInTheDocument()
    expect(second).toHaveFocus()
  })
})
