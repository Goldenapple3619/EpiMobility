import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { paths } from '@/app/paths'
import { expectNoAxeViolations } from '@/test/axe'
import { renderRoute } from '@/test/renderRoute'

describe('Catalogue des composants', () => {
  it('est accessible sur sa route sans figurer dans le menu principal', () => {
    renderRoute(paths.componentCatalog)
    expect(screen.getByRole('heading', { level: 1, name: 'Catalogue des composants' }))
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })
    expect(within(nav).queryByRole('link', { name: /composants/i })).not.toBeInTheDocument()
  })

  it('valide le formulaire d’exemple avec récapitulatif et messages par champ', async () => {
    const { user } = renderRoute(paths.componentCatalog)
    await user.click(screen.getByRole('button', { name: 'Valider l’exemple' }))

    const summary = screen.getByRole('alert', { name: /Le formulaire contient des erreurs/ })
    expect(summary).toHaveFocus()
    expect(within(summary).getAllByRole('link')).toHaveLength(5)
    expect(screen.getByRole('textbox', { name: 'Nom complet (obligatoire)' })).toBeInvalid()

    await user.type(screen.getByRole('textbox', { name: /Adresse e-mail/ }), 'pas-un-email')
    await user.click(screen.getByRole('button', { name: 'Valider l’exemple' }))
    expect(screen.getAllByText(/Saisissez une adresse e-mail valide/)).not.toHaveLength(0)
  })

  it('ne présente aucune violation axe détectable', async () => {
    const { container } = renderRoute(paths.componentCatalog)
    await expectNoAxeViolations(container)
  })
})
