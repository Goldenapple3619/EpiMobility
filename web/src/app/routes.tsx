import type { RouteObject } from 'react-router'
import { RequireRole } from '@/features/auth/RequireRole'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { RootRoute } from '@/layouts/RootRoute'
import { StudentLayout } from '@/layouts/StudentLayout'
import { AboutPage } from '@/pages/AboutPage'
import { ComponentCatalogPage } from '@/pages/ComponentCatalogPage'
import { HelpPage } from '@/pages/HelpPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { CataloguePage } from '@/pages/student/CataloguePage'
import type { RouteHandle } from '@/types/navigation'
import { paths } from './paths'

const studentSpace = 'Espace étudiant'
const adminSpace = 'Administration'

function handle(value: RouteHandle): RouteHandle {
  return value
}

export const routes: RouteObject[] = [
  {
    element: <RootRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: paths.home, element: <HomePage />, handle: handle({ title: 'Accueil' }) },
          { path: paths.about, element: <AboutPage />, handle: handle({ title: 'Présentation' }) },
          { path: paths.help, element: <HelpPage />, handle: handle({ title: 'Aide' }) },
          { path: paths.login, element: <LoginPage />, handle: handle({ title: 'Connexion' }) },
          {
            path: paths.forbidden,
            element: <ForbiddenPage />,
            handle: handle({ title: 'Accès interdit' }),
          },
          {
            path: paths.componentCatalog,
            element: <ComponentCatalogPage />,
            handle: handle({ title: 'Catalogue des composants' }),
          },
          { path: '*', element: <NotFoundPage />, handle: handle({ title: 'Page introuvable' }) },
        ],
      },
      {
        path: paths.student.root,
        element: <RequireRole allowed={['student']} />,
        handle: handle({ crumb: studentSpace }),
        children: [
          {
            element: <StudentLayout />,
            children: [
              {
                index: true,
                handle: handle({ title: 'Tableau de bord étudiant' }),
                element: (
                  <PlaceholderPage
                    space={studentSpace}
                    title="Tableau de bord"
                    description="Vue d’ensemble de votre démarche de mobilité : catalogue, vœux et affectation."
                  />
                ),
              },
              {
                path: paths.student.catalogue,
                handle: handle({ title: 'Catalogue des destinations', crumb: 'Catalogue' }),
                element: <CataloguePage />,
              },
              {
                path: paths.student.wishes,
                handle: handle({ title: 'Mes vœux', crumb: 'Mes vœux' }),
                element: (
                  <PlaceholderPage
                    space={studentSpace}
                    title="Mes vœux"
                    description="Classer ses destinations préférées avant la date limite."
                  />
                ),
              },
              {
                path: paths.student.assignment,
                handle: handle({ title: 'Mon affectation', crumb: 'Mon affectation' }),
                element: (
                  <PlaceholderPage
                    space={studentSpace}
                    title="Mon affectation"
                    description="Consulter le résultat de l’affectation et son explication."
                  />
                ),
              },
            ],
          },
        ],
      },
      {
        path: paths.admin.root,
        element: <RequireRole allowed={['admin']} />,
        handle: handle({ crumb: adminSpace }),
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                handle: handle({ title: 'Tableau de bord administration' }),
                element: (
                  <PlaceholderPage
                    space={adminSpace}
                    title="Tableau de bord administration"
                    description="Suivi des campagnes de mobilité, des vœux et des affectations."
                  />
                ),
              },
              {
                path: paths.admin.universities,
                handle: handle({ title: 'Gestion des universités', crumb: 'Universités' }),
                element: (
                  <PlaceholderPage
                    space={adminSpace}
                    title="Gestion des universités"
                    description="Créer et mettre à jour les destinations partenaires fictives."
                  />
                ),
              },
              {
                path: paths.admin.students,
                handle: handle({ title: 'Gestion des étudiants', crumb: 'Étudiants' }),
                element: (
                  <PlaceholderPage
                    space={adminSpace}
                    title="Gestion des étudiants"
                    description="Consulter les dossiers étudiants et l’état de leurs vœux."
                  />
                ),
              },
              {
                path: paths.admin.rulesets,
                handle: handle({ title: 'Règles d’affectation', crumb: 'Règles d’affectation' }),
                element: (
                  <PlaceholderPage
                    space={adminSpace}
                    title="Règles d’affectation"
                    description="Définir les critères et pondérations utilisés pour l’affectation."
                  />
                ),
              },
              {
                path: paths.admin.simulations,
                handle: handle({ title: 'Simulations', crumb: 'Simulations' }),
                element: (
                  <PlaceholderPage
                    space={adminSpace}
                    title="Simulations d’affectation"
                    description="Lancer et comparer des simulations avant publication des résultats."
                  />
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]

/** `BASE_URL` provient de l'option `base` de Vite (ex. `/panel/` si l'hébergement l'impose). */
export function routerBasename(baseUrl: string = import.meta.env.BASE_URL): string {
  return baseUrl.length > 1 ? baseUrl.replace(/\/+$/, '') : '/'
}
