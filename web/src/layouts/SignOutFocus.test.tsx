import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { paths } from '@/app/paths'
import { renderRoute } from '@/test/renderRoute'

describe('Déconnexion : le focus ne retombe jamais sur <body>', () => {
  it('depuis l’accueil, place le focus sur le lien « Connexion » qui remplace le bouton', async () => {
    const { user } = renderRoute(paths.home, { role: 'student' })
    screen.getByRole('button', { name: 'Se déconnecter' }).focus()
    await user.keyboard('{Enter}')
    // Nom accessible exact : l'espace avant « (démonstration) » doit être conservé.
    const login = await screen.findByRole('link', { name: 'Connexion (démonstration)' })
    await waitFor(() => expect(login).toHaveFocus())
  })

  it('depuis un espace protégé, revient à l’accueil avec le focus sur le contenu', async () => {
    const { user, router } = renderRoute(paths.student.root, { role: 'student' })
    screen.getByRole('button', { name: 'Se déconnecter' }).focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(router.state.location.pathname).toBe(paths.home))
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus())
  })

  it('depuis la page de connexion, place le focus sur le formulaire qui réapparaît', async () => {
    const { user } = renderRoute(paths.login, { role: 'admin' })
    const signOut = screen.getAllByRole('button', { name: 'Se déconnecter' })
    // Bouton de la page (le second est celui de l'en-tête).
    const pageButton = signOut.find((button) => screen.getByRole('main').contains(button))!
    pageButton.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Étudiant' })).toHaveFocus())
  })
})
