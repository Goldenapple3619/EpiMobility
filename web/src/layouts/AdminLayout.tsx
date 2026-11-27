import { Outlet } from 'react-router'
import { AppShell } from './AppShell'
import { adminNavigation } from './navigation'

export function AdminLayout() {
  return (
    <AppShell
      navigation={adminNavigation}
      navigationLabel="Navigation de l’administration"
      spaceLabel="Administration"
      showBreadcrumb
    >
      <Outlet />
    </AppShell>
  )
}
