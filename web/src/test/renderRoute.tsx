import { StrictMode } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/routes'
import { ToastProvider } from '@/components/ui'
import { SessionProvider } from '@/features/auth/SessionProvider'
import { createDemoSession, type Role } from '@/features/auth/session'
import { ApiProvider } from '@/services/api/ApiProvider'
import { createMockApi } from '@/services/api/mockApi'
import type { EpiMobilityApi } from '@/services/api/types'

type RenderRouteOptions = Readonly<{
  role?: Role | null
  /** API injectée ; par défaut le mode mock sans latence. */
  api?: EpiMobilityApi
}>

/** Monte l'application complète sur une URL donnée, avec une session de démonstration. */
export function renderRoute(
  url: string,
  { role = null, api = createMockApi({ latencyMs: 0 }) }: RenderRouteOptions = {},
) {
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  const user = userEvent.setup()
  // StrictMode comme dans main.tsx : il double les effets et révèle leurs effets de bord.
  const view = render(
    <StrictMode>
      <ApiProvider api={api}>
        <SessionProvider initialSession={role ? createDemoSession(role) : null}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </SessionProvider>
      </ApiProvider>
    </StrictMode>,
  )
  return { ...view, router, user }
}
