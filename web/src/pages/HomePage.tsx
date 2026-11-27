import { brand } from '@/app/brand'
import { BrandMark } from '@/components/BrandMark'
import { FeatureCard } from '@/components/FeatureCard'

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
            <div className="hero-actions">
              <a className="button-primary" href="#parcours">
                Découvrir le parcours <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href="#approche">
                Comprendre le projet
              </a>
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
            <div className="hero-art__tag hero-art__tag--top">100 destinations</div>
            <div className="hero-art__tag hero-art__tag--bottom">1 000 étudiants</div>
          </div>
        </div>
      </section>

      <section className="section" id="approche" aria-labelledby="approche-title">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Notre vision</span>
            <h2 id="approche-title">Une plateforme pensée pour les étudiants.</h2>
            <p>
              Un espace unique pour découvrir des destinations, exprimer ses préférences et
              comprendre son affectation. Les fonctions ci-dessous seront intégrées progressivement
              au fil du développement.
            </p>
          </div>
          <div className="feature-grid" id="parcours">
            <FeatureCard
              number="01 / Explorer"
              title="Découvrir les universités"
              description="Un catalogue mondial, des filtres utiles et des informations sourcées."
            />
            <FeatureCard
              number="02 / Choisir"
              title="Construire ses vœux"
              description="Cinq destinations classées selon ses préférences et ses objectifs."
            />
            <FeatureCard
              number="03 / Comprendre"
              title="Suivre son affectation"
              description="Un résultat expliqué de manière claire et transparente."
            />
          </div>
        </div>
      </section>

      <section className="section section--muted" id="identite" aria-labelledby="identite-title">
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
            <div className="color-palette" role="group" aria-label="Palette graphique">
              <span
                className="color-swatch"
                style={{ backgroundColor: '#0B5E5C' }}
                title="Vert profond"
                aria-label="Vert profond"
              />
              <span
                className="color-swatch"
                style={{ backgroundColor: '#143440' }}
                title="Bleu encre"
                aria-label="Bleu encre"
              />
              <span
                className="color-swatch"
                style={{ backgroundColor: '#D3A76D' }}
                title="Sable doré"
                aria-label="Sable doré"
              />
              <span
                className="color-swatch"
                style={{ backgroundColor: '#EFF5F3' }}
                title="Brume"
                aria-label="Brume"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
