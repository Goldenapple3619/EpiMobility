import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ToastProvider } from '@/components/ui'
import { SessionProvider } from '@/features/auth/SessionProvider'
import { ApiProvider } from '@/services/api/ApiProvider'
import { createApi } from '@/services/api/createApi'
import { readApiConfig } from '@/services/config'
import { ConfigErrorPage } from '@/pages/ConfigErrorPage'
import { routerBasename, routes } from './routes'

type Bootstrap =
  | Readonly<{ ok: true; api: ReturnType<typeof createApi> }>
  | Readonly<{ ok: false; message: string }>

function bootstrap(): Bootstrap {
  try {
    return { ok: true, api: createApi(readApiConfig()) }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) }
  }
}

export function App() {
  const [setup] = useState(bootstrap)
  const [router] = useState(() => createBrowserRouter(routes, { basename: routerBasename() }))

  if (!setup.ok) return <ConfigErrorPage message={setup.message} />

  return (
    <ApiProvider api={setup.api}>
      <SessionProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </SessionProvider>
    </ApiProvider>
  )
}
