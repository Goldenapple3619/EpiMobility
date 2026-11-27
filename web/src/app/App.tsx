import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ToastProvider } from '@/components/ui'
import { SessionProvider } from '@/features/auth/SessionProvider'
import { routerBasename, routes } from './routes'

export function App() {
  const [router] = useState(() => createBrowserRouter(routes, { basename: routerBasename() }))

  return (
    <SessionProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </SessionProvider>
  )
}
