import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Audit axe-core (règles WCAG 2.x A/AA). jsdom ne calcule pas le rendu : le contraste des
 * couleurs n'est pas évalué ici et doit être vérifié dans un vrai navigateur.
 */
export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    rules: { 'color-contrast': { enabled: false } },
  })
  const summary = results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help} → ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
  )
  expect(summary).toEqual([])
}
