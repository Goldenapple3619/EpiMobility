# Institut Orivane — Mini-charte graphique

**Statut :** proposition d'identité à valider par l'équipe. L'institut est fictif et ne représente aucun établissement existant.

## 1. Positionnement et identité

**Nom de travail :** Institut Orivane
**Signature :** Ouvrir des horizons, construire des parcours.
**Secteur :** enseignement supérieur fictif, mobilité internationale.
**Valeurs :** clarté, ouverture, équité, accessibilité et fiabilité.

Le nom et le symbole sont proposés pour le projet pédagogique. Une vérification d'antériorité des marques reste nécessaire avant tout usage hors de ce cadre.

Le logotype est un symbole géométrique de boussole, dessiné en SVG directement dans `src/components/BrandMark.tsx`. Sa forme évoque l'orientation et le mouvement, sans utiliser les marques ou logos d'universités réelles.

## 2. Palette et typographie

| Rôle | Hexadécimal | Emploi |
| --- | --- | --- |
| Primaire | `#0B5E5C` | Actions, liens, accents |
| Primaire survol | `#0A4F4D` | États interactifs |
| Encre | `#143440` | Titres et pied de page |
| Texte | `#244C53` | Texte courant |
| Secondaire | `#49646D` | Texte descriptif |
| Sable | `#D3A76D` | Décoration uniquement, pas de texte sur blanc |
| Fond | `#F4F8F6` | Page |
| Brume | `#EFF5F3` | Surfaces secondaires |
| Blanc | `#FFFFFF` | Cartes et texte sur primaire |

**Police :** pile système `Inter, ui-sans-serif, system-ui, ...` avec repli garanti, sans téléchargement externe. Les titres sont compacts, le texte courant a une hauteur de ligne de 1,6. Espacements sur une échelle de 4 px ; rayons doux (10, 16, 28 px).

## 3. Composants et accessibilité

Les variables source sont centralisées dans `src/styles/tokens.css`. La présentation se trouve dans `src/styles/brand.css`.

- Contraste calculé du texte `#244C53` sur fond blanc : environ **9,4:1**.
- Contraste calculé de blanc sur primaire `#0B5E5C` : environ **7,6:1**.
- Contraste calculé de `#49646D` sur fond blanc : environ **6,3:1**.
- Les ratios indiqués s'appliquent aux associations ci-dessus seulement ; les autres combinaisons nécessitent une vérification.
- Le sable doré est réservé à la décoration et ne sert pas à transmettre seul une information.
- Navigation clavier, focus visible, lien d'accès direct au contenu et respect de `prefers-reduced-motion`.
- Pour un composant interactif, conserver une cible tactile confortable et un libellé explicite.
- L'objectif WCAG 2.2 AA doit être validé par audits automatisés et tests manuels, sur l'ensemble des pages finales.

## 4. Iconographie, ressources et limites

L'icône du logo, la boussole de démonstration et les décors géométriques ont été créés localement en SVG/CSS. Aucune photographie, police distante ou marque d'université n'est intégrée à cette étape.

Les futures photos de campus devront provenir de sources autorisant la réutilisation, avec attribution, licence, source et texte alternatif pertinents. Une liste de ces crédits sera maintenue dans la documentation du catalogue.

La page actuelle sert à présenter la direction graphique ; elle ne prétend pas implémenter le catalogue, les vœux, l'administration ou l'affectation. Ces fonctionnalités font l'objet d'autres issues.

**Mention obligatoire dans l'interface :** « Projet pédagogique : partenariats fictifs ».
