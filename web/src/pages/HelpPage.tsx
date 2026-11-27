import { brand } from '@/app/brand'
import { paths } from '@/app/paths'
import { TextLink } from '@/components/ui'

const topics = [
  { id: 'connexion', title: 'Se connecter' },
  { id: 'catalogue', title: 'Consulter le catalogue' },
  { id: 'voeux', title: 'Formuler ses vœux' },
  { id: 'affectation', title: 'Comprendre son affectation' },
  { id: 'accessibilite', title: 'Accessibilité' },
  { id: 'donnees', title: 'Données fictives' },
] as const

export function HelpPage() {
  return (
    <div className="section info-page">
      <div className="container">
        <span className="eyebrow">Aide</span>
        <h1>Aide et questions fréquentes</h1>
        <p className="page-section__lead">
          Retrouvez ici l’essentiel pour utiliser la plateforme de mobilité de{' '}
          {brand.institutionName}.
        </p>

        <nav className="catalog-toc" aria-label="Sommaire de l’aide">
          <ul>
            {topics.map((topic) => (
              <li key={topic.id}>
                <a href={`#${topic.id}`}>{topic.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="info-section" id="connexion" aria-labelledby="connexion-title">
          <h2 id="connexion-title">Se connecter</h2>
          <p>
            L’authentification définitive n’est pas encore disponible. Pendant le développement, la
            page <TextLink to={paths.login}>Connexion</TextLink> permet de choisir un profil de
            démonstration (étudiant ou administration) pour parcourir les espaces. Ce choix ne donne
            accès à aucune donnée réelle.
          </p>
        </section>

        <section className="info-section" id="catalogue" aria-labelledby="catalogue-title">
          <h2 id="catalogue-title">Consulter le catalogue</h2>
          <p>
            Depuis l’espace étudiant, le <TextLink to={paths.student.catalogue}>catalogue</TextLink>{' '}
            liste les destinations, leur ville, leur pays, leurs langues d’enseignement et le nombre
            de places. Utilisez le champ de recherche pour filtrer par nom d’établissement ou de
            ville.
          </p>
        </section>

        <section className="info-section" id="voeux" aria-labelledby="voeux-title">
          <h2 id="voeux-title">Formuler ses vœux</h2>
          <p>
            Vous classerez vos destinations par ordre de préférence (1 = premier choix). Le nombre
            maximal de vœux et la date limite sont fixés par les règles de la campagne. Cette
            fonction est en cours de réalisation.
          </p>
        </section>

        <section className="info-section" id="affectation" aria-labelledby="affectation-title">
          <h2 id="affectation-title">Comprendre son affectation</h2>
          <p>
            Après la clôture des vœux, l’équipe pédagogique applique des règles d’affectation
            connues à l’avance. Chaque étudiant pourra consulter sa destination et une explication
            du résultat. Cette fonction est en cours de réalisation.
          </p>
        </section>

        <section className="info-section" id="accessibilite" aria-labelledby="accessibilite-title">
          <h2 id="accessibilite-title">Accessibilité</h2>
          <ul>
            <li>
              Le lien « Aller au contenu principal », accessible avec la touche Tab en haut de
              chaque page, permet d’ignorer les menus.
            </li>
            <li>Toutes les fonctions sont utilisables au clavier, avec un focus visible.</li>
            <li>
              Les pages restent lisibles avec un zoom du navigateur jusqu’à 200 % et sur mobile.
            </li>
            <li>
              Les erreurs de formulaire sont décrites par un texte, pas seulement par une couleur.
            </li>
          </ul>
          <p>
            L’objectif est la conformité au niveau AA des WCAG 2.2. Un audit complet reste à mener
            sur les pages finales.
          </p>
        </section>

        <section className="info-section" id="donnees" aria-labelledby="donnees-title">
          <h2 id="donnees-title">Données fictives</h2>
          <p>
            <strong>{brand.disclaimer}.</strong> {brand.institutionName} et les universités
            présentées sont inventés. Lorsque la plateforme affiche un bandeau « Mode démonstration
            », les données proviennent d’un jeu d’exemples local et aucun serveur n’est contacté.
          </p>
          <p>
            Pour en savoir plus sur le projet, consultez la page{' '}
            <TextLink to={paths.about}>Présentation</TextLink>.
          </p>
        </section>
      </div>
    </div>
  )
}
