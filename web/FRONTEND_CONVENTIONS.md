# Front-end — architecture et conventions

## Objectif

Application web React, TypeScript et Vite, hébergée sous `web/` dans le dépôt EpiMobility.
Les interfaces étudiant et administration consomment la même API REST que l'application mobile.

## Structure

| Dossier | Responsabilité |
| --- | --- |
| `src/app/` | Point d'entrée applicatif, configuration et providers globaux |
| `src/pages/` | Pages assemblées depuis les fonctionnalités et composants |
| `src/features/` | Fonctionnalités métier autonomes (catalogue, vœux, administration) |
| `src/components/` | Composants UI réutilisables, sans accès direct à l'API |
| `src/hooks/` | Hooks React réutilisables |
| `src/lib/` | Utilitaires indépendants de React |
| `src/services/` | Clients HTTP, adaptateurs et erreurs normalisées |
| `src/styles/` | Styles transversaux et tokens du design system |
| `src/types/` | Types partagés par plusieurs fonctionnalités |
| `src/mocks/` | Données de démonstration séparées de l'API réelle |

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
npm run build
```

Pour corriger uniquement le formatage des sources et configurations : `npm run format`.

## Branches et revue

Une issue = une branche `feature/web-XX` = une pull request relue. La branche `dev` reçoit
les fonctionnalités validées ; `main` sert au déploiement. Les PR doivent mentionner l'issue,
les tests réalisés et les limites connues.

Les modifications Docker, Nginx, CI/CD et déploiement sont coordonnées avec le pôle Infrastructure.
