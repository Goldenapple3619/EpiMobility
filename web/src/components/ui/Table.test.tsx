import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '@/test/axe'
import { Table, type TableColumn } from './Table'

type Row = { id: string; name: string; seats: number }
const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Destination', render: (row) => row.name, isRowHeader: true },
  { key: 'seats', header: 'Places', render: (row) => row.seats, align: 'end' },
]
const rows: Row[] = [
  { id: '1', name: 'Destination A', seats: 3 },
  { id: '2', name: 'Destination B', seats: 0 },
]

describe('Table', () => {
  it('expose légende, en-têtes de colonnes et de lignes', async () => {
    const { container } = render(
      <Table caption="Destinations" columns={columns} rows={rows} getRowKey={(row) => row.id} />,
    )
    const table = screen.getByRole('table', { name: 'Destinations' })
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Destination', 'Places'])
    expect(within(table).getByRole('rowheader', { name: 'Destination A' })).toBeInTheDocument()
    // Zone défilante atteignable au clavier.
    expect(screen.getByRole('region', { name: 'Destinations' })).toHaveAttribute('tabindex', '0')
    await expectNoAxeViolations(container)
  })

  it('affiche un état vide explicite', () => {
    render(
      <Table
        caption="Destinations"
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        emptyTitle="Aucune destination"
      />,
    )
    expect(screen.getByText('Aucune destination')).toBeInTheDocument()
  })

  it('annonce le chargement', () => {
    render(
      <Table
        caption="Destinations"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        isLoading
      />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Chargement en cours…')
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('Destination A')).not.toBeInTheDocument()
  })

  it('affiche l’erreur et permet de relancer', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <Table
        caption="Destinations"
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.id}
        error="Le serveur n’a pas répondu."
        onRetry={onRetry}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Le serveur n’a pas répondu.')
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
