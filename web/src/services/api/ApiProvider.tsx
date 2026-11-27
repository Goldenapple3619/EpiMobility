import type { ReactNode } from 'react'
import { ApiContext } from './apiContext'
import type { EpiMobilityApi } from './types'

export function ApiProvider({
  api,
  children,
}: Readonly<{ api: EpiMobilityApi; children: ReactNode }>) {
  return <ApiContext value={api}>{children}</ApiContext>
}
