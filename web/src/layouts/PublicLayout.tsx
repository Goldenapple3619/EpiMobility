import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from './AppShell'
import { publicNavigation } from './navigation'

type PublicLayoutProps = Readonly<{
  /** Contenu imposé (pages d'erreur) ; sinon la route enfant est affichée. */
  children?: ReactNode
  documentTitle?: string
}>

export function PublicLayout({ children, documentTitle }: PublicLayoutProps) {
  return (
    <AppShell
      navigation={publicNavigation}
      navigationLabel="Navigation principale"
      documentTitle={documentTitle}
    >
      {children ?? <Outlet />}
    </AppShell>
  )
}
