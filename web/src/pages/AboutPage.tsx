import { brand } from '@/app/brand'
import { paths } from '@/app/paths'
import { ButtonLink, Card } from '@/components/ui'

const values = [
  { title: 'Clarté', text: 'Des informations lisibles et des règles d’affectation expliquées.' },
  { title: 'Ouverture', text: 'Encourager chaque étudiant à envisager un parcours international.' },
  { title: 'Équité', text: 'Des critères connus à l’avance et appliqués de la même façon à tous.' },
  {
    title: 'Accessibilité',
    text: 'Une plateforme utilisable au clavier, au lecteur d’écran et sur mobile.',
  },
  {
    title: 'Fiabilité',
    text: 'Des données sourcées lorsqu’elles sont réelles, signalées lorsqu’elles sont fictives.',
  },
] as const

const steps = [
  { title: 'Explorer', text: 'Consulter le catalogue des destinations et leurs conditions.' },
  { title: 'Choisir', text: 'Classer ses vœux par ordre de préférence avant la date limite.' },
  {
    title: 'Affecter',
    text: 'L’équipe pédagogique applique les règles publiées et simule l’affectation.',
  },
  { title: 'Comprendre', text: 'Chaque étudiant consulte son résultat et son explication.' },
] as const

export function AboutPage() {
  return (
    <div className="section info-page">
      <div className="container">
        <span className="eyebrow">Présentation</span>
        <h1>{brand.institutionName}</h1>
        <p className="page-section__lead">
          {brand.institutionName} est une <strong>école d’ingénierie fictive</strong>, imaginée pour
          le projet pédagogique EpiMobility. Elle sert de cadre à une plateforme de gestion de la
          mobilité internationale.
        </p>

        <div className="disclaimer-callout">
          <p>
            <strong>{brand.disclaimer}.</strong> L’institut, ses étudiants et les universités
            partenaires présentés sur cette plateforme n’existent pas. Aucune information ne doit
            être interprétée comme une offre réelle d’échange ou de partenariat.
          </p>
        </div>

        <section className="info-section" aria-labelledby="mission-title">
          <h2 id="mission-title">Notre mission</h2>
          <p>
            Rendre la mobilité internationale plus lisible : où partir, comment candidater, et
            comment les places sont attribuées. La signature de l’institut résume cette ambition :
            <em> « {brand.tagline} »</em>
          </p>
        </section>

        <section className="info-section" aria-labelledby="values-title">
          <h2 id="values-title">Nos valeurs</h2>
          <ul className="info-grid">
            {values.map((value) => (
              <li key={value.title}>
                <Card title={value.title} headingLevel={3}>
                  <p>{value.text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="info-section" aria-labelledby="steps-title">
          <h2 id="steps-title">Le parcours de mobilité</h2>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong> — {step.text}
              </li>
            ))}
          </ol>
        </section>

        <section className="info-section" aria-labelledby="project-title">
          <h2 id="project-title">Le projet EpiMobility</h2>
          <p>
            La plateforme comprend un espace étudiant, une interface d’administration et une
            application mobile qui partagent la même API. Elle est développée par une équipe
            d’étudiants organisée en pôles (Front-end, Back-end, Infrastructure).
          </p>
          <p className="info-actions">
            <ButtonLink to={paths.student.catalogue}>Explorer le catalogue</ButtonLink>
            <ButtonLink to={paths.help} variant="secondary">
              Consulter l’aide
            </ButtonLink>
          </p>
        </section>
      </div>
    </div>
  )
}
