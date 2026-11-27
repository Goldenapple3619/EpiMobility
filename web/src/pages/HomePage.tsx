import { brand } from '@/app/brand'
import { paths } from '@/app/paths'
import { BrandMark } from '@/components/BrandMark'
import { FeatureCard } from '@/components/FeatureCard'
import { ButtonLink, Card, TextLink } from '@/components/ui'

const palette = [
  { name: 'Vert profond', className: 'color-swatch--primary' },
  { name: 'Bleu encre', className: 'color-swatch--ink' },
  { name: 'Sable doré', className: 'color-swatch--sand' },
  { name: 'Brume', className: 'color-swatch--mist' },
] as const

export function HomePage() {
  return (
    <>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Une nouvelle perspective sur le monde</span>
            <h1 id="hero-title">
              Ouvrir des horizons, <span>construire des parcours.</span>
            </h1>
            <p>
              {brand.institutionName} imagine une mobilité internationale plus lisible, plus
              accessible et mieux adaptée aux aspirations de chaque étudiant.
            </p>
            <p className="disclaimer-callout">
              <strong>{brand.disclaimer}.</strong> L’école et les universités présentées sont
              inventées pour un projet d’étudiants ; aucun partenariat réel n’est proposé.
            </p>
            <div className="hero-actions">
              <ButtonLink to={paths.student.catalogue}>
                Explorer le catalogue <span aria-hidden="true">→</span>
              </ButtonLink>
              <TextLink to={paths.about}>Découvrir l’institut</TextLink>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-art__ring" />
            <div className="hero-art__compass">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#D3A76D" />
                <path d="M24 5 31 24 24 19 17 24Z" fill="white" />
                <path d="M17 24 24 29 31 24 24 43Z" fill="#D3A76D" />
              </svg>
            </div>
            <div className="hero-art__tag hero-art__tag--top">Destinations fictives</div>
            <div className="hero-art__tag hero-art__tag--bottom">Vœux classés</div>
          </div>
        </div>
      </section>

      <section className="section" id="acces" aria-labelledby="acces-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Accès rapides</span>
            <h2 id="acces-title">Accéder à la plateforme.</h2>
            <p>
              Choisissez l’espace qui vous concerne. Pendant le développement, la connexion se fait
              avec un profil de démonstration.
            </p>
          </div>
          <div className="access-grid">
            <Card
              eyebrow="Étudiants"
              title="Espace étudiant"
              headingLevel={3}
              footer={<ButtonLink to={paths.student.root}>Ouvrir l’espace étudiant</ButtonLink>}
            >
              <p>Consulter le catalogue, classer ses vœux et suivre son affectation.</p>
            </Card>
            <Card
              eyebrow="Équipe pédagogique"
              title="Administration"
              headingLevel={3}
              footer={
                <ButtonLink to={paths.admin.root} variant="secondary">
                  Ouvrir l’administration
                </ButtonLink>
              }
            >
              <p>Gérer les destinations, les règles d’affectation et les simulations.</p>
            </Card>
            <Card
              eyebrow="Besoin d’aide ?"
              title="Aide et questions fréquentes"
              headingLevel={3}
              footer={
                <ButtonLink to={paths.help} variant="secondary">
                  Consulter l’aide
                </ButtonLink>
              }
            >
              <p>Connexion, vœux, affectation, accessibilité : les réponses essentielles.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section section--muted" id="approche" aria-labelledby="approche-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Notre vision</span>
            <h2 id="approche-title">Une plateforme pensée pour les étudiants.</h2>
            <p>
              Un espace unique pour découvrir des destinations, exprimer ses préférences et
              comprendre son affectation. Ces fonctions sont intégrées progressivement au fil du
              développement.
            </p>
          </div>
          <div className="feature-grid" id="parcours">
            <FeatureCard
              number="01 / Explorer"
              title="Découvrir les universités"
              description="Un catalogue de destinations fictives, avec recherche et informations claires."
            />
            <FeatureCard
              number="02 / Choisir"
              title="Construire ses vœux"
              description="Des destinations classées selon ses préférences et ses objectifs."
            />
            <FeatureCard
              number="03 / Comprendre"
              title="Suivre son affectation"
              description="Un résultat expliqué de manière claire et transparente."
            />
          </div>
        </div>
      </section>

      <section className="section" id="identite" aria-labelledby="identite-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Notre univers graphique</span>
            <h2 id="identite-title">Une identité claire, sobre et ouverte.</h2>
          </div>
          <div className="brand-specimen">
            <div>
              <BrandMark />
              <p>
                Une boussole stylisée, des couleurs profondes et des contrastes étudiés pour
                faciliter la lecture.
              </p>
            </div>
            <ul className="color-palette" aria-label="Palette graphique">
              {palette.map((color) => (
                <li key={color.name} className="color-palette__item">
                  <span className={`color-swatch ${color.className}`} aria-hidden="true" />
                  <span className="color-palette__name">{color.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
