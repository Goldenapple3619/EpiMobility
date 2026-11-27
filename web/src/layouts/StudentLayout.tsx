import { Outlet } from 'react-router'
import { AppShell } from './AppShell'
import { studentNavigation } from './navigation'

export function StudentLayout() {
  return (
    <AppShell
      navigation={studentNavigation}
      navigationLabel="Navigation de l’espace étudiant"
      spaceLabel="Espace étudiant"
      showBreadcrumb
    >
      <Outlet />
    </AppShell>
  )
}
