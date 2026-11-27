import { StrictMode } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/routes'
import { SessionProvider } from '@/features/auth/SessionProvider'
import { createDemoSession, type Role } from '@/features/auth/session'

type RenderRouteOptions = Readonly<{
  role?: Role | null
}>

/** Monte l'application complète sur une URL donnée, avec une session de démonstration. */
export function renderRoute(url: string, { role = null }: RenderRouteOptions = {}) {
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  const user = userEvent.setup()
  // StrictMode comme dans main.tsx : il double les effets et révèle leurs effets de bord.
  const view = render(
    <StrictMode>
      <SessionProvider initialSession={role ? createDemoSession(role) : null}>
        <RouterProvider router={router} />
      </SessionProvider>
    </StrictMode>,
  )
  return { ...view, router, user }
}
