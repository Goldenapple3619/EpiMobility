import { paths } from '@/app/paths'
import type { NavigationItem } from '@/types/navigation'

export const publicNavigation: readonly NavigationItem[] = [
  { label: 'Accueil', href: paths.home, end: true },
  { label: 'Espace étudiant', href: paths.student.root },
  { label: 'Administration', href: paths.admin.root },
]

export const studentNavigation: readonly NavigationItem[] = [
  { label: 'Tableau de bord', href: paths.student.root, end: true },
  { label: 'Catalogue', href: paths.student.catalogue },
  { label: 'Mes vœux', href: paths.student.wishes },
  { label: 'Mon affectation', href: paths.student.assignment },
]

export const adminNavigation: readonly NavigationItem[] = [
  { label: 'Tableau de bord', href: paths.admin.root, end: true },
  { label: 'Universités', href: paths.admin.universities },
  { label: 'Étudiants', href: paths.admin.students },
  { label: 'Règles d’affectation', href: paths.admin.rulesets },
  { label: 'Simulations', href: paths.admin.simulations },
]
