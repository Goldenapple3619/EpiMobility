import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { paths } from '@/app/paths'
import { expectNoAxeViolations } from '@/test/axe'
import { renderRoute } from '@/test/renderRoute'

const DISCLAIMER = 'Projet pédagogique : partenariats fictifs'

describe('Accueil public', () => {
  it('affiche la mention obligatoire dès le haut de page et dans le pied de page', () => {
    renderRoute(paths.home)
    const hero = screen.getByRole('region', { name: /Ouvrir des horizons/ })
    expect(within(hero).getByText(`${DISCLAIMER}.`)).toBeInTheDocument()
    expect(within(screen.getByRole('contentinfo')).getByText(DISCLAIMER)).toBeInTheDocument()
  })

  it('oriente vers les principales interfaces', () => {
    renderRoute(paths.home)
    const expected: Array<[RegExp, string]> = [
      [/Explorer le catalogue/, paths.student.catalogue],
      [/Ouvrir l’espace étudiant/, paths.student.root],
      [/Ouvrir l’administration/, paths.admin.root],
      [/Consulter l’aide/, paths.help],
      [/Découvrir l’institut/, paths.about],
    ]
    for (const [name, href] of expected) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('mène au catalogue via la connexion de démonstration', async () => {
    const { user, router } = renderRoute(paths.home)
    await user.click(screen.getByRole('link', { name: /Explorer le catalogue/ }))
    expect(router.state.location.pathname).toBe(paths.login)
    await user.click(screen.getByRole('button', { name: 'Ouvrir la session de démonstration' }))
    expect(router.state.location.pathname).toBe(paths.student.catalogue)
    expect(await screen.findByRole('heading', { level: 1, name: 'Catalogue des destinations' }))
  })

  it('n’utilise aucun style en ligne (bloqué par la CSP style-src self)', () => {
    const { container } = renderRoute(paths.home)
    expect(container.querySelectorAll('[style]')).toHaveLength(0)
  })

  it('n’affiche pas de chiffres présentés comme des faits', () => {
    renderRoute(paths.home)
    expect(screen.queryByText(/100 destinations|1 000 étudiants/)).not.toBeInTheDocument()
  })

  it('expose la palette comme une liste nommée et lisible', () => {
    renderRoute(paths.home)
    const palette = screen.getByRole('list', { name: 'Palette graphique' })
    expect(within(palette).getAllByRole('listitem')).toHaveLength(4)
    expect(within(palette).getByText('Sable doré')).toBeInTheDocument()
  })

  it('ne présente aucune violation axe détectable', async () => {
    const { container } = renderRoute(paths.home)
    await expectNoAxeViolations(container)
  })
})

describe('Pages d’information', () => {
  it('présente l’école fictive avec la mention obligatoire', async () => {
    const { container } = renderRoute(paths.about)
    expect(screen.getByRole('heading', { level: 1, name: 'Institut Orivane' }))
    expect(screen.getByText(/école d’ingénierie fictive/)).toBeInTheDocument()
    expect(screen.getAllByText(new RegExp(DISCLAIMER)).length).toBeGreaterThan(1)
    expect(document.title).toBe('Présentation · EpiMobility · Institut Orivane')
    await expectNoAxeViolations(container)
  })

  it('propose une aide structurée avec sommaire', async () => {
    const { container } = renderRoute(paths.help)
    expect(screen.getByRole('heading', { level: 1, name: 'Aide et questions fréquentes' }))
    const toc = screen.getByRole('navigation', { name: 'Sommaire de l’aide' })
    expect(within(toc).getAllByRole('link')).toHaveLength(6)
    expect(screen.getByRole('heading', { level: 2, name: 'Accessibilité' })).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })

  it('est accessible depuis le menu principal et le pied de page', async () => {
    const { user, router } = renderRoute(paths.home)
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    await user.click(within(nav).getByRole('link', { name: 'Aide' }))
    expect(router.state.location.pathname).toBe(paths.help)
    expect(within(nav).getByRole('link', { name: 'Aide' })).toHaveAttribute('aria-current', 'page')

    const footerNav = screen.getByRole('navigation', { name: 'Liens du pied de page' })
    await user.click(within(footerNav).getByRole('link', { name: 'Présentation de l’institut' }))
    expect(router.state.location.pathname).toBe(paths.about)
  })
})
