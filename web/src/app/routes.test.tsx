import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/test/renderRoute'
import { paths } from './paths'
import { routerBasename } from './routes'

describe('routes publiques', () => {
  it('affiche l’accueil avec la mention obligatoire', () => {
    renderRoute(paths.home)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ouvrir des horizons')
    expect(screen.getByText('Projet pédagogique : partenariats fictifs')).toBeInTheDocument()
  })

  it('affiche une page 404 explicite pour une URL inconnue', () => {
    renderRoute('/page-qui-n-existe-pas')
    expect(screen.getByRole('heading', { name: 'Page introuvable' })).toBeInTheDocument()
    expect(document.title).toBe('Page introuvable · EpiMobility · Institut Orivane')
  })

  it('affiche la page d’accès interdit sur sa route dédiée', () => {
    renderRoute(paths.forbidden)
    expect(screen.getByRole('heading', { name: 'Accès interdit' })).toBeInTheDocument()
  })

  it('met à jour le titre du document selon la route', () => {
    renderRoute(paths.home)
    expect(document.title).toBe('Accueil · EpiMobility · Institut Orivane')
  })
})

describe('navigation active', () => {
  it('marque uniquement le lien courant avec aria-current="page"', () => {
    renderRoute(paths.home)
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).getByRole('link', { name: 'Accueil' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Espace étudiant' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('suit la navigation entre les pages de l’espace étudiant', async () => {
    const { user } = renderRoute(paths.student.root, { role: 'student' })
    const nav = screen.getByRole('navigation', { name: 'Navigation de l’espace étudiant' })

    await user.click(within(nav).getByRole('link', { name: 'Catalogue' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Catalogue des destinations' }))
    expect(within(nav).getByRole('link', { name: 'Catalogue' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Tableau de bord' })).not.toHaveAttribute(
      'aria-current',
    )
    const breadcrumb = screen.getByRole('navigation', { name: 'Fil d’Ariane' })
    expect(within(breadcrumb).getByRole('link', { name: 'Espace étudiant' })).toBeInTheDocument()
    expect(within(breadcrumb).getByText('Catalogue')).toHaveAttribute('aria-current', 'page')
  })
})

describe('protection des espaces selon le rôle', () => {
  it('redirige un visiteur non connecté vers la connexion', () => {
    const { router } = renderRoute(paths.admin.universities)
    expect(router.state.location.pathname).toBe(paths.login)
    expect(screen.getByRole('heading', { name: 'Connexion de démonstration' })).toBeInTheDocument()
  })

  it('refuse l’administration à un étudiant sans monter le contenu protégé', () => {
    renderRoute(paths.admin.universities, { role: 'student' })
    expect(screen.getByRole('heading', { name: 'Accès interdit' })).toBeInTheDocument()
    expect(screen.queryByText('Gestion des universités')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: 'Navigation de l’administration' }),
    ).not.toBeInTheDocument()
    expect(document.title).toBe('Accès interdit · EpiMobility · Institut Orivane')
  })

  it('refuse l’espace étudiant à un profil administration', () => {
    renderRoute(paths.student.wishes, { role: 'admin' })
    expect(screen.getByRole('heading', { name: 'Accès interdit' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Mes vœux' })).not.toBeInTheDocument()
  })

  it('ouvre l’administration à un profil administration', () => {
    renderRoute(paths.admin.universities, { role: 'admin' })
    expect(screen.getByRole('heading', { level: 1, name: 'Gestion des universités' }))
    expect(screen.getByText(/Écran en préparation/)).toBeInTheDocument()
  })

  it('ramène vers la page demandée après la connexion de démonstration', async () => {
    const { router, user } = renderRoute(paths.student.wishes)
    await user.click(screen.getByRole('radio', { name: 'Étudiant' }))
    await user.click(screen.getByRole('button', { name: 'Ouvrir la session de démonstration' }))
    expect(router.state.location.pathname).toBe(paths.student.wishes)
    expect(window.sessionStorage.getItem('epimobility.demo-session')).toBe('student')
  })

  it('n’utilise pas une redirection incompatible avec le rôle choisi', async () => {
    const { router, user } = renderRoute(paths.admin.root)
    await user.click(screen.getByRole('radio', { name: 'Étudiant' }))
    await user.click(screen.getByRole('button', { name: 'Ouvrir la session de démonstration' }))
    expect(router.state.location.pathname).toBe(paths.student.root)
  })

  it('ferme la session et revient à l’accueil', async () => {
    const { router, user } = renderRoute(paths.student.root, { role: 'student' })
    await user.click(screen.getByRole('button', { name: 'Se déconnecter' }))
    expect(router.state.location.pathname).toBe(paths.home)
    expect(screen.getByRole('link', { name: /Connexion/ })).toBeInTheDocument()
  })
})

describe('navigation au clavier', () => {
  it('propose le lien d’évitement en premier et place le focus sur le contenu', async () => {
    const { user } = renderRoute(paths.home)
    await user.tab()
    const skipLink = screen.getByRole('link', { name: 'Aller au contenu principal' })
    expect(skipLink).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('parcourt l’en-tête dans un ordre logique', async () => {
    const { user } = renderRoute(paths.home)
    await user.tab() // lien d'évitement
    await user.tab()
    expect(screen.getByRole('link', { name: /retour à l’accueil/ })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Accueil' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Espace étudiant' })).toHaveFocus()
  })

  it('active un lien de menu avec Entrée et déplace le focus sur le contenu', async () => {
    const { router, user } = renderRoute(paths.student.root, { role: 'student' })
    screen.getByRole('link', { name: 'Mes vœux' }).focus()
    await user.keyboard('{Enter}')
    expect(router.state.location.pathname).toBe(paths.student.wishes)
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus())
  })
})

describe('routerBasename', () => {
  it('retire la barre oblique finale de la base Vite', () => {
    expect(routerBasename('/')).toBe('/')
    expect(routerBasename('/panel/')).toBe('/panel')
  })
})
