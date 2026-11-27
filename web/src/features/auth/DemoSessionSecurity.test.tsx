import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { paths } from '@/app/paths'
import { SESSION_STORAGE_KEY } from '@/features/auth/session'
import { createMockApi } from '@/services/api/mockApi'
import type { EpiMobilityApi } from '@/services/api/types'
import { renderRoute } from '@/test/renderRoute'

/** Même contrat que l'API réelle, mais identifié comme mode `http` (aucun mock autorisé). */
function httpModeApi(): EpiMobilityApi {
  return { ...createMockApi({ latencyMs: 0 }), mode: 'http' }
}

describe('Mode http : aucun accès simulé aux espaces protégés', () => {
  it('ne propose pas de connexion de démonstration', () => {
    renderRoute(paths.login, { api: httpModeApi() })
    expect(screen.getByRole('heading', { level: 1, name: 'Connexion' })).toBeInTheDocument()
    expect(screen.getByText(/Connexion bientôt disponible/)).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Ouvrir la session de démonstration' }),
    ).not.toBeInTheDocument()
  })

  it('ignore et efface une session de démonstration stockée', () => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, 'admin')
    const { router } = renderRoute(paths.admin.universities, { api: httpModeApi() })
    expect(router.state.location.pathname).toBe(paths.login)
    expect(
      screen.queryByRole('navigation', { name: 'Navigation de l’administration' }),
    ).not.toBeInTheDocument()
    expect(window.sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })

  it('ignore une session imposée et garde l’espace étudiant fermé', () => {
    const { router } = renderRoute(paths.student.catalogue, { role: 'student', api: httpModeApi() })
    expect(router.state.location.pathname).toBe(paths.login)
    expect(screen.queryByRole('heading', { name: 'Catalogue des destinations' })).toBeNull()
  })

  it('n’affiche ni bandeau de démonstration ni mention « démonstration » dans l’en-tête', () => {
    renderRoute(paths.home, { api: httpModeApi() })
    expect(screen.queryByRole('note', { name: 'Mode démonstration' })).not.toBeInTheDocument()
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: 'Connexion' })).toBeInTheDocument()
    expect(within(header).queryByText(/démonstration/)).not.toBeInTheDocument()
  })
})

describe('Mode mock : la connexion de démonstration reste disponible', () => {
  it('propose le choix du profil', () => {
    renderRoute(paths.login)
    expect(screen.getByRole('radio', { name: 'Étudiant' })).toBeInTheDocument()
  })
})
