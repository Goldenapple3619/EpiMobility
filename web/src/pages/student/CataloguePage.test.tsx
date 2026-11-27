import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { paths } from '@/app/paths'
import { createMockApi } from '@/services/api/mockApi'
import type { EpiMobilityApi } from '@/services/api/types'
import { ApiError } from '@/services/http/ApiError'
import { renderRoute } from '@/test/renderRoute'

describe('Catalogue étudiant (mode mock, sans serveur)', () => {
  it('affiche le chargement puis les destinations fictives et le bandeau de démonstration', async () => {
    renderRoute(paths.student.catalogue, { role: 'student' })

    expect(screen.getByText('Chargement en cours…')).toBeInTheDocument()
    expect(await screen.findByRole('rowheader', { name: /Université fictive de Valmont/ }))
    expect(screen.getByText('7 destinations trouvées.')).toBeInTheDocument()
    expect(screen.getByRole('note', { name: 'Mode démonstration' })).toHaveTextContent(
      'données fictives locales',
    )
  })

  it('recherche, affiche l’état vide puis efface la recherche', async () => {
    const { user, router } = renderRoute(paths.student.catalogue, { role: 'student' })
    await screen.findByRole('rowheader', { name: /Valmont/ })

    const input = screen.getByRole('searchbox', { name: 'Rechercher une destination' })
    await user.type(input, 'norhaven')
    await user.click(screen.getByRole('button', { name: 'Rechercher' }))
    expect(await screen.findByText('1 destination trouvée pour « norhaven ».')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?q=norhaven')

    await user.clear(input)
    await user.type(input, 'introuvable')
    await user.click(screen.getByRole('button', { name: 'Rechercher' }))
    expect(await screen.findByText('Aucune destination trouvée')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Effacer la recherche' }))
    expect(input).toHaveFocus()
    expect(await screen.findByText('7 destinations trouvées.')).toBeInTheDocument()
  })

  it('pagine les résultats', async () => {
    const { user } = renderRoute(paths.student.catalogue, { role: 'student' })
    const pagination = await screen.findByRole('navigation', { name: 'Pagination du catalogue' })
    expect(within(pagination).getByText('Page 1 sur 2')).toBeInTheDocument()
    expect(within(pagination).getByRole('button', { name: 'Page précédente' })).toBeDisabled()

    within(pagination).getByRole('button', { name: 'Page suivante' }).focus()
    await user.keyboard('{Enter}')
    const results = screen.getByRole('region', { name: 'Destinations partenaires (fictives)' })
    expect(results).toHaveFocus()
    expect(await screen.findByText('Page 2 sur 2')).toBeInTheDocument()
    expect(results).toHaveFocus()
    expect(screen.getAllByRole('rowheader')).toHaveLength(2)
  })

  it('affiche une erreur compréhensible et permet de relancer', async () => {
    const mock = createMockApi({ latencyMs: 0 })
    let serverDown = true
    const list = vi.fn<EpiMobilityApi['universities']['list']>((filters, options) =>
      serverDown
        ? Promise.reject(
            new ApiError({ kind: 'network', message: 'Impossible de joindre le serveur.' }),
          )
        : mock.universities.list(filters, options),
    )
    const api: EpiMobilityApi = {
      ...mock,
      // Mode mock avec panne simulée : en mode http, l'espace étudiant est inaccessible tant
      // que l'authentification réelle n'existe pas.
      universities: { ...mock.universities, list },
    }

    const { user } = renderRoute(paths.student.catalogue, { role: 'student', api })

    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible de joindre le serveur.')

    serverDown = false
    const callsBeforeRetry = list.mock.calls.length
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(
      screen.getByRole('region', { name: 'Destinations partenaires (fictives)' }),
    ).toHaveFocus()
    expect(await screen.findByRole('rowheader', { name: /Valmont/ })).toBeInTheDocument()
    expect(list.mock.calls.length).toBeGreaterThan(callsBeforeRetry)
  })
})
