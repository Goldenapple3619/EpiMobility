import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '@/test/axe'
import { Alert } from './Alert'
import { Badge } from './Badge'
import { Button } from './Button'
import { ErrorSummary } from './ErrorSummary'
import { Modal } from './Modal'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function ModalHarness({ onConfirm = () => {} }: Readonly<{ onConfirm?: () => void }>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmer"
        description="Action irréversible."
        actions={
          <Button
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            Valider
          </Button>
        }
      />
    </>
  )
}

describe('Modal', () => {
  it('s’ouvre avec un nom accessible et place le focus à l’intérieur', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }))
    const dialog = screen.getByRole('dialog', { name: 'Confirmer' })
    expect(dialog).toHaveAccessibleDescription('Action irréversible.')
    expect(within(dialog).getByRole('button', { name: 'Fermer la fenêtre' })).toHaveFocus()
  })

  it('se ferme avec Échap et rend le focus au déclencheur', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)
    const opener = screen.getByRole('button', { name: 'Ouvrir' })
    await user.click(opener)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('exécute l’action principale au clavier', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<ModalHarness onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: 'Ouvrir' }))
    await user.tab()
    expect(screen.getByRole('button', { name: 'Valider' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Alert', () => {
  it('préfixe le message par sa nature, pas seulement par la couleur', () => {
    render(<Alert tone="danger">Échec de l’enregistrement.</Alert>)
    expect(screen.getByText('Erreur')).toBeInTheDocument()
  })

  it('utilise role="alert" pour une erreur annoncée et role="status" sinon', () => {
    render(
      <>
        <Alert tone="danger" live>
          Erreur réseau
        </Alert>
        <Alert tone="success" live>
          Enregistré
        </Alert>
      </>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Erreur réseau')
    expect(screen.getByRole('status')).toHaveTextContent('Enregistré')
  })

  it('peut être masquée par un bouton nommé', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert tone="info" onDismiss={onDismiss}>
        Info
      </Alert>,
    )
    await user.click(screen.getByRole('button', { name: 'Masquer le message' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})

function ToastTrigger() {
  const { notify } = useToast()
  return (
    <Button onClick={() => notify({ tone: 'success', message: 'Vœux enregistrés.' })}>
      Notifier
    </Button>
  )
}

describe('Toasts', () => {
  it('ajoute la notification dans une zone live existante puis la ferme', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    )
    const region = screen.getByRole('region', { name: 'Notifications' })
    expect(region.querySelector('[aria-live="polite"]')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Notifier' }))
    expect(within(region).getByText('Vœux enregistrés.')).toBeInTheDocument()

    await user.click(within(region).getByRole('button', { name: 'Masquer le message' }))
    expect(within(region).queryByText('Vœux enregistrés.')).not.toBeInTheDocument()
  })
})

describe('ErrorSummary', () => {
  it('reçoit le focus et mène au champ en erreur', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ErrorSummary errors={[{ fieldId: 'nom', message: 'Renseignez le nom.' }]} />
        <input id="nom" aria-label="Nom" />
      </>,
    )
    expect(screen.getByRole('alert')).toHaveFocus()
    await user.click(screen.getByRole('link', { name: 'Renseignez le nom.' }))
    expect(screen.getByRole('textbox', { name: 'Nom' })).toHaveFocus()
  })

  it('ne rend rien sans erreur', () => {
    const { container } = render(<ErrorSummary errors={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('Badge', () => {
  it('porte son sens dans le texte', async () => {
    const { container } = render(<Badge tone="danger">Refusé</Badge>)
    expect(screen.getByText('Refusé')).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })
})

describe('Noms accessibles composés', () => {
  it('conserve les espaces entre préfixe masqué et titre', () => {
    render(
      <Alert tone="info" title="Campagne ouverte">
        Détail
      </Alert>,
    )
    expect(screen.getByText(/Campagne ouverte/).textContent).toBe('Information : Campagne ouverte')
  })
})
