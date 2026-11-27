import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ToastProvider } from '@/components/ui'
import { SessionProvider } from '@/features/auth/SessionProvider'
import { ApiProvider } from '@/services/api/ApiProvider'
import type { EpiMobilityApi } from '@/services/api/types'
import { routerBasename, routes } from './routes'

/** Application prête : l'API (réelle ou mock) est créée par `bootstrap.ts` avant le rendu. */
export function App({ api }: Readonly<{ api: EpiMobilityApi }>) {
  const [router] = useState(() => createBrowserRouter(routes, { basename: routerBasename() }))

  return (
    <ApiProvider api={api}>
      <SessionProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </SessionProvider>
    </ApiProvider>
  )
}
