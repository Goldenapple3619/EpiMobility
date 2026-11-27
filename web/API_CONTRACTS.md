# Contrats d'API provisoires — Front-end EpiMobility

**Statut : PROPOSITION du pôle Front-end, NON VALIDÉE par le pôle Backend.**
Au moment de la rédaction, le dossier `api/` ne contient qu'un `Dockerfile` : aucune route,
aucun schéma et aucun format d'erreur n'existent encore côté serveur. Ce document décrit ce que
le front-end consomme aujourd'hui afin de servir de base de discussion. Tout élément marqué
**À valider** peut changer ; le front-end s'adaptera dans `src/services/api/httpApi.ts` et
`src/types/domain.ts` sans toucher aux pages.

## 1. Configuration côté client

| Variable | Valeurs | Défaut | Rôle |
| --- | --- | --- | --- |
| `VITE_API_MODE` | `mock`, `http` | `http` | `mock` : données fictives locales, aucun appel réseau. |
| `VITE_API_BASE_URL` | URL | `/api` | Préfixe de toutes les routes ci-dessous. |
| `VITE_API_TIMEOUT_MS` | entier > 0 | `10000` | Délai maximal d'une requête. |

- `npm run dev` charge `.env.development`, qui active **explicitement** `VITE_API_MODE=mock`.
  Un bandeau « Mode démonstration » est alors affiché sur toutes les pages.
- Un build de production (`npm run build`) utilise `http` par défaut. **Le mode `mock` y est
  interdit** (écran « Configuration invalide ») et son code n'est pas inclus dans le bundle :
  `src/services/api/createApi.ts` ne le charge que par un import dynamique réservé au
  développement. Vérification : `npm run build && npm run check:bundle`.
- La **connexion de démonstration n'existe qu'en mode `mock`**. En mode `http`, toute session
  simulée est ignorée et effacée : les espaces étudiant et administration restent inaccessibles
  tant que l'authentification réelle (API) n'est pas branchée.
- **Aucune bascule automatique** : si l'API est indisponible en mode `http`, l'interface affiche
  une erreur et propose de réessayer ; elle ne présente jamais de données fictives à la place.
- Une valeur invalide bloque le démarrage avec un écran « Configuration invalide ».
- Les variables `VITE_*` sont **publiques** (intégrées au bundle) : aucun secret ne doit y figurer.
- Garder une URL **relative** (même origine) : la CSP Nginx actuelle (`connect-src 'self'`)
  bloquerait une API sur une autre origine. Le proxy `/api/` existe déjà dans `web/nginx/default.conf`.

Pour basculer, modifier la variable puis relancer le serveur de développement ou reconstruire :

```bash
VITE_API_MODE=http VITE_API_BASE_URL=/api npm run dev
```

## 2. Conventions générales (À valider)

| Sujet | Proposition | À valider |
| --- | --- | --- |
| Format | JSON UTF-8, `Accept: application/json` | — |
| Nommage des champs | `camelCase` | ou `snake_case` ? |
| Identifiants | chaînes (`"uni-…"`, UUID) | UUID ou entiers ? |
| Dates | ISO 8601 UTC (`2026-11-27T10:00:00Z`) | — |
| Pays / langues | ISO 3166-1 alpha-2 / ISO 639-1 | — |
| Authentification | cookie de session `HttpOnly` même origine (`credentials: 'same-origin'`) | **cookie ou jeton ?** CSRF ? |
| Utilisateur courant | routes `/me/...` déduites de la session | — |
| Autorisations | vérifiées par l'API à chaque requête ; 401 si non connecté, 403 si rôle insuffisant | rôles exacts (`student`, `admin`) |

Le front-end n'ajoute aucun en-tête d'authentification aujourd'hui. Les gardes de route du
navigateur ne sont qu'un confort d'interface et ne remplacent pas ces contrôles.

## 3. Pagination et filtres (À valider)

Requête : `?page=1&pageSize=20` (page à partir de 1, `pageSize` ≤ 100), filtres en paramètres
simples (`search`, `countryCode`). Paramètre répété pour une liste (`lang=fr&lang=en`).
Les paramètres vides ne sont pas envoyés.

Réponse d'une liste paginée :

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 1
}
```

À valider : pagination par page ou par curseur ; noms des paramètres ; tri (`sort=name`) ;
recherche insensible aux accents.

## 4. Erreurs (À valider)

Toute réponse 4xx/5xx devrait suivre l'enveloppe suivante :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description technique",
    "details": [{ "field": "rank", "message": "Rang invalide" }]
  }
}
```

Côté client, toute erreur devient une `ApiError` (`src/services/http/ApiError.ts`) :

| `kind` | Cause | Affichage |
| --- | --- | --- |
| `http` | statut 4xx/5xx (`status`, `code`, `fieldErrors`) | message en français selon le statut |
| `network` | serveur injoignable | « Impossible de joindre le serveur… » + Réessayer |
| `timeout` | délai `VITE_API_TIMEOUT_MS` dépassé | « Le serveur met trop de temps… » + Réessayer |
| `aborted` | requête annulée (changement de page, nouvelle recherche) | **jamais affichée** |
| `parse` | corps JSON invalide | « La réponse du serveur est illisible. » |

Le `message` du serveur n'est pas affiché tel quel (il peut contenir des détails techniques) ;
`code` et `details` servent à afficher les erreurs par champ. À valider : liste des `code`.

## 5. Ressources et routes

Toutes les routes sont relatives à `VITE_API_BASE_URL`. Les types TypeScript correspondants
sont dans `src/types/domain.ts`.

| Méthode | Route | Rôle | Réponse | Utilisée par |
| --- | --- | --- | --- | --- |
| GET | `/universities` | étudiant, admin | `Page<University>` ; filtres `search`, `countryCode` | catalogue étudiant |
| GET | `/universities/{id}` | étudiant, admin | `University` ou 404 | — (prévu) |
| GET | `/students` | admin | `Page<Student>` ; filtre `search` | — (prévu) |
| GET | `/me/wishes` | étudiant | `Wish[]` triés par `rank` | — (prévu) |
| PUT | `/me/wishes` | étudiant | corps `{ "wishes": [{ "universityId", "rank" }] }` → `Wish[]` ; 422 si trop de vœux | — (prévu) |
| GET | `/me/assignment` | étudiant | `Assignment` ou `null` | — (prévu) |
| GET | `/rulesets` | admin | `Ruleset[]` | — (prévu) |
| GET | `/simulations` | admin | `Page<Simulation>` | — (prévu) |
| GET | `/simulations/{id}` | admin | `Simulation` ou 404 | — (prévu) |

### Modèles (résumé)

- **University** : `id`, `name`, `city`, `countryCode`, `countryName`, `teachingLanguages[]`,
  `seats`, `description`, `isFictional`, `sourceUrl` (obligatoire si l'établissement est réel).
- **Student** : `id`, `studentNumber`, `firstName`, `lastName`, `email`, `program`, `year`.
  Données personnelles : accès réservé à l'administration (à confirmer RGPD).
- **Wish** : `id`, `studentId`, `universityId`, `rank` (1 = premier choix), `createdAt`, `updatedAt`.
- **Assignment** : `id`, `studentId`, `simulationId`, `universityId | null`, `wishRank | null`,
  `status` (`provisional` | `published` | `unassigned`), `explanation`.
- **Ruleset** : `id`, `name`, `version`, `maxWishes`, `criteria[]` (`key`, `label`, `weight` 0–1),
  `isActive`, `updatedAt`.
- **Simulation** : `id`, `rulesetId`, `status` (`pending` | `running` | `completed` | `failed`),
  `createdAt`, `completedAt | null`, `summary | null` (`assignedCount`, `unassignedCount`,
  `firstChoiceRate` 0–1).

## 6. Points à valider avec le pôle Backend

1. Format des identifiants (UUID texte ou entier).
2. Convention de nommage des champs JSON (`camelCase` proposé).
3. Mécanisme d'authentification (cookie de session ou jeton), protection CSRF, durée de session.
4. Liste des rôles et matrice d'autorisations par route.
5. Pagination (page/curseur), noms des paramètres, tri, taille maximale.
6. Enveloppe d'erreur et liste des `code` métier.
7. `GET /me/assignment` sans affectation : `200 null` ou `404` ?
8. Remplacement atomique des vœux (`PUT /me/wishes`) ou routes unitaires ; contrôle des doublons
   et de la date limite côté serveur.
9. Champs exacts de `University` (langues, niveau requis, domaines, durée…) et source des données réelles.
10. Champs du `Student` réellement nécessaires (minimisation des données personnelles).
11. Structure des critères d'un `Ruleset` et déclenchement d'une `Simulation` (POST asynchrone ?).
12. Versionnement de l'API (`/api/v1` ?).

## 7. Mode mock

- Implémentation : `src/services/api/mockApi.ts`, données : `src/mocks/data/`.
- Sept destinations **entièrement fictives** (noms et villes inventés, marqués `isFictional: true`,
  sans source), trois étudiants fictifs (adresses `example.org`), une règle et une simulation de démonstration.
- Latence simulée de 400 ms pour rendre visibles les états de chargement ; annulation respectée.
- Les vœux enregistrés restent en mémoire jusqu'au rechargement de la page.
- Le mode mock implémente exactement le même contrat (`EpiMobilityApi`) que le client HTTP :
  les pages ne connaissent pas le mode utilisé.
