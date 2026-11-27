# Front-end — architecture et conventions

## Objectif

Application web React, TypeScript et Vite, hébergée sous `web/` dans le dépôt EpiMobility.
Les interfaces étudiant et administration consomment la même API REST que l'application mobile.

## Structure

| Dossier | Responsabilité |
| --- | --- |
| `src/app/` | Point d'entrée applicatif, configuration et providers globaux |
| `src/pages/` | Pages assemblées depuis les fonctionnalités et composants |
| `src/layouts/` | Layouts public, étudiant et administration (en-tête, menus, fil d'Ariane) |
| `src/features/` | Fonctionnalités métier autonomes (catalogue, vœux, administration) |
| `src/components/` | Composants UI réutilisables, sans accès direct à l'API |
| `src/hooks/` | Hooks React réutilisables |
| `src/lib/` | Utilitaires indépendants de React |
| `src/services/` | Clients HTTP, adaptateurs et erreurs normalisées |
| `src/styles/` | Styles transversaux et tokens du design system |
| `src/types/` | Types partagés par plusieurs fonctionnalités |
| `src/mocks/` | Données de démonstration séparées de l'API réelle |
| `src/test/` | Configuration et utilitaires de test (Vitest, Testing Library) |

## Conventions

- **Composants et pages :** PascalCase (`InfoCard.tsx`, `HomePage.tsx`).
- **Hooks :** `useNomDuHook.ts`, un seul objectif par hook.
- **Fonctions, constantes locales et variables :** camelCase ; constantes globales immuables explicites.
- **Types et interfaces :** PascalCase ; éviter `any` et les affirmations de type inutiles.
- **Imports :** alias `@/` vers `src/` pour les imports internes ; imports relatifs acceptés à l'intérieur d'un même module.
- **Responsabilités :** aucun appel HTTP dans les composants de présentation ; passer par `services/` ou les modules `features/`.
- **Données :** ne jamais présenter comme réels des établissements ou coûts inventés ; sourcer les destinations réelles.
- **Sécurité :** ne stocker aucun secret dans les variables client `VITE_`; les contrôles d'autorisation restent obligatoires côté API.
- **Accessibilité :** HTML sémantique, libellés explicites, navigation clavier, focus visible, WCAG 2.2 AA.

## Routage

- Routeur : React Router (`createBrowserRouter`), configuration dans `src/app/routes.tsx`.
- **Routes nommées :** toute URL interne provient de `src/app/paths.ts` ; ne pas écrire de chemin en dur.
- Chaque route déclare `handle.title` (titre d'onglet) et, dans les espaces connectés, `handle.crumb` (fil d'Ariane).
- Les menus utilisent `NavLink` : le lien actif reçoit `aria-current="page"` et un soulignement visible.
- Au changement de page, le focus est placé sur `<main id="main-content">`.
- `RequireRole` n'affiche un espace qu'au rôle prévu ; un écran refusé n'est jamais monté.
  **Ce n'est pas une mesure de sécurité** : l'API doit authentifier et autoriser chaque requête.
- La session actuelle est une **session de démonstration** (choix du profil sur `/connexion`),
  à remplacer par l'authentification fournie par l'API.

### Prérequis d'hébergement (à coordonner avec le pôle Infrastructure)

- Le serveur doit renvoyer `index.html` pour toute URL de l'application (fallback SPA),
  sinon un rechargement de `/etudiant/catalogue` renvoie une 404 serveur.
- Si l'application est servie sous un préfixe (ex. `/panel/`), le définir via l'option `base`
  de Vite : le routeur l'utilise automatiquement comme `basename`.

## Bibliothèque de composants UI

Les composants partagés sont dans `src/components/ui/` et s'importent depuis `@/components/ui`.
Leur démonstration (tous les états) est visible sur la route interne **`/composants`**,
volontairement absente des menus.

| Besoin | Composant |
| --- | --- |
| Action | `Button` (`primary`, `secondary`, `ghost`, `danger` ; `isLoading`, `disabled`) |
| Navigation | `TextLink` (interne ou `external`), `ButtonLink` |
| Saisie | `TextField`, `SelectField`, `Checkbox`, `RadioGroup` (props `label`/`legend`, `hint`, `error`, `required`) |
| Validation | `ErrorSummary` + messages de `@/lib/validation` |
| Présentation | `Card`, `Badge`, `Table` (états chargement/erreur/vide intégrés) |
| Retour utilisateur | `Alert` (en ligne), `useToast` (notifications), `Modal` |
| États | `LoadingState`, `EmptyState`, `ErrorState` (avec « Réessayer ») |

Règles :

- Ne pas recréer un bouton, un champ ou une alerte avec des classes ad hoc : étendre le composant.
- Une erreur s'affiche toujours avec une icône **et** un texte (préfixe « Erreur : »), jamais par la seule couleur.
- Les composants UI n'appellent jamais l'API ; ils reçoivent données et callbacks en props.
- Les couleurs d'état sont des tokens (`--color-danger`, `--color-success`…) dont le contraste est documenté dans `tokens.css`.
- Les tests d'accessibilité utilisent `expectNoAxeViolations` (`src/test/axe.ts`) ; le contraste n'étant pas
  calculé par jsdom, il se vérifie dans un navigateur.

## Créer une page ou un composant

1. Créer la page en `src/pages/NouvellePage.tsx` ou un composant en `src/components/NouveauComposant.tsx`.
2. Exposer un composant React nommé, avec des props TypeScript précises.
3. Déplacer la logique spécifique dans `features/`, les appels réseau dans `services/`.
4. Utiliser les imports `@/...` lorsque la référence sort du dossier courant.
5. Vérifier le rendu et l'accessibilité, puis exécuter les validations ci-dessous.

## Commandes

Depuis `web/` :

```bash
npm ci
npm run dev
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run build
```

Les tests (`*.test.ts(x)`) utilisent Vitest, jsdom et Testing Library. Privilégier les requêtes
par rôle et nom accessible (`getByRole`) et `user-event` pour simuler clavier et souris.

Pour corriger uniquement le formatage des sources et configurations : `npm run format`.

## Branches et revue

Une issue = une branche `feature/web-XX` = une pull request relue. La branche `dev` reçoit
les fonctionnalités validées ; `main` sert au déploiement. Les PR doivent mentionner l'issue,
les tests réalisés et les limites connues.

Les modifications Docker, Nginx, CI/CD et déploiement sont coordonnées avec le pôle Infrastructure.
