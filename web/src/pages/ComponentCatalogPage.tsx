import { useState, type FormEvent, type ReactNode } from 'react'
import { paths } from '@/app/paths'
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  Checkbox,
  EmptyState,
  ErrorState,
  ErrorSummary,
  LoadingState,
  Modal,
  RadioGroup,
  SelectField,
  Table,
  TextField,
  TextLink,
  useToast,
  type FormErrorEntry,
  type TableColumn,
} from '@/components/ui'
import { isBlank, isEmail, validationMessages } from '@/lib/validation'

const sections = [
  { id: 'boutons', title: 'Boutons' },
  { id: 'liens', title: 'Liens' },
  { id: 'formulaires', title: 'Champs de formulaire' },
  { id: 'badges', title: 'Badges' },
  { id: 'cartes', title: 'Cartes' },
  { id: 'tableaux', title: 'Tableaux' },
  { id: 'modales', title: 'Modales' },
  { id: 'notifications', title: 'Notifications' },
  { id: 'etats', title: 'États de chargement, vide et erreur' },
] as const

type DemoDestination = Readonly<{
  id: string
  name: string
  country: string
  seats: number
  status: 'open' | 'full'
}>

/** Exemples purement fictifs, utilisés uniquement pour illustrer les composants. */
const demoDestinations: readonly DemoDestination[] = [
  { id: 'd1', name: 'Université fictive de Valmont', country: 'Pays A', seats: 4, status: 'open' },
  { id: 'd2', name: 'Institut fictif de Norhaven', country: 'Pays B', seats: 0, status: 'full' },
  { id: 'd3', name: 'École fictive de Lisandre', country: 'Pays C', seats: 2, status: 'open' },
]

const destinationColumns: readonly TableColumn<DemoDestination>[] = [
  { key: 'name', header: 'Destination', render: (row) => row.name, isRowHeader: true },
  { key: 'country', header: 'Pays', render: (row) => row.country },
  { key: 'seats', header: 'Places', render: (row) => row.seats, align: 'end' },
  {
    key: 'status',
    header: 'Statut',
    render: (row) =>
      row.status === 'open' ? (
        <Badge tone="success">Ouverte</Badge>
      ) : (
        <Badge tone="danger">Complète</Badge>
      ),
  },
]

type TableDemoState = 'data' | 'loading' | 'error' | 'empty'

function CatalogSection({
  id,
  title,
  children,
}: Readonly<{ id: string; title: string; children: ReactNode }>) {
  return (
    <section className="catalog-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  )
}

function DemoForm() {
  const { notify } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [destination, setDestination] = useState('')
  const [semester, setSemester] = useState<'s1' | 's2' | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<readonly FormErrorEntry[]>([])

  const errorFor = (fieldId: string) => errors.find((error) => error.fieldId === fieldId)?.message

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FormErrorEntry[] = []
    if (isBlank(name))
      nextErrors.push({ fieldId: 'demo-name', message: validationMessages.required('Nom complet') })
    if (isBlank(email))
      nextErrors.push({
        fieldId: 'demo-email',
        message: validationMessages.required('Adresse e-mail'),
      })
    else if (!isEmail(email))
      nextErrors.push({
        fieldId: 'demo-email',
        message: validationMessages.email('Adresse e-mail'),
      })
    if (isBlank(destination))
      nextErrors.push({
        fieldId: 'demo-destination',
        message: validationMessages.requiredChoice('Destination souhaitée'),
      })
    if (!semester)
      nextErrors.push({
        fieldId: 'demo-semester-s1',
        message: validationMessages.requiredChoice('Semestre de départ'),
      })
    if (!accepted)
      nextErrors.push({
        fieldId: 'demo-accept',
        message: validationMessages.mustAccept('J’ai lu les conditions'),
      })
    setErrors(nextErrors)
    if (nextErrors.length === 0) {
      notify({
        tone: 'success',
        title: 'Formulaire valide',
        message: 'Exemple uniquement : aucune donnée n’a été envoyée.',
      })
    }
  }

  return (
    <form className="catalog-form" noValidate onSubmit={handleSubmit}>
      <ErrorSummary errors={errors} />
      <TextField
        id="demo-name"
        label="Nom complet"
        required
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errorFor('demo-name')}
      />
      <TextField
        id="demo-email"
        label="Adresse e-mail"
        type="email"
        required
        autoComplete="email"
        hint="Format attendu : nom@domaine.fr"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errorFor('demo-email')}
      />
      <SelectField
        id="demo-destination"
        label="Destination souhaitée"
        required
        placeholder="Choisir une destination"
        options={demoDestinations.map((item) => ({
          value: item.id,
          label: item.name,
          disabled: item.status === 'full',
        }))}
        hint="Les destinations complètes ne peuvent pas être choisies."
        value={destination}
        onChange={(event) => setDestination(event.target.value)}
        error={errorFor('demo-destination')}
      />
      <RadioGroup
        legend="Semestre de départ"
        name="demo-semester"
        required
        value={semester}
        onChange={setSemester}
        options={[
          { value: 's1', label: 'Semestre 1' },
          { value: 's2', label: 'Semestre 2' },
        ]}
        error={errorFor('demo-semester-s1')}
        idPrefix="demo-semester"
      />
      <Checkbox
        id="demo-accept"
        label="J’ai lu les conditions de candidature"
        required
        checked={accepted}
        onChange={(event) => setAccepted(event.target.checked)}
        error={errorFor('demo-accept')}
      />
      <TextField
        label="Identifiant étudiant"
        value="ORV-0000"
        disabled
        readOnly
        hint="Champ désactivé : attribué automatiquement."
      />
      <Button type="submit">Valider l’exemple</Button>
    </form>
  )
}

export function ComponentCatalogPage() {
  const { notify } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [tableState, setTableState] = useState<TableDemoState>('data')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleAlerts, setVisibleAlerts] = useState({
    info: true,
    success: true,
    warning: true,
    danger: true,
  })

  function simulateSave() {
    setIsSaving(true)
    window.setTimeout(() => setIsSaving(false), 2000)
  }

  return (
    <div className="section">
      <div className="container catalog">
        <span className="eyebrow">Usage interne</span>
        <h1>Catalogue des composants</h1>
        <p className="page-section__lead">
          Démonstration des composants partagés de l’interface et de leurs états. Les contenus
          présentés sont des exemples fictifs.
        </p>

        <nav className="catalog-toc" aria-label="Sommaire du catalogue">
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <CatalogSection id="boutons" title="Boutons">
          <div className="catalog-row">
            <Button>Principal</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="ghost">Discret</Button>
            <Button variant="danger">Supprimer</Button>
            <Button size="sm">Petit</Button>
          </div>
          <div className="catalog-row">
            <Button disabled>Désactivé</Button>
            <Button isLoading={isSaving} loadingLabel="Enregistrement…" onClick={simulateSave}>
              Simuler un enregistrement
            </Button>
          </div>
        </CatalogSection>

        <CatalogSection id="liens" title="Liens">
          <div className="catalog-row">
            <TextLink to={paths.home}>Lien interne vers l’accueil</TextLink>
            <TextLink to="https://www.w3.org/WAI/standards-guidelines/wcag/fr" external>
              Lien externe (WCAG)
            </TextLink>
            <ButtonLink to={paths.login} variant="secondary">
              Lien présenté comme un bouton
            </ButtonLink>
          </div>
        </CatalogSection>

        <CatalogSection id="formulaires" title="Champs de formulaire">
          <p>
            Soumettez le formulaire vide pour afficher le récapitulatif et les messages d’erreur
            standardisés.
          </p>
          <DemoForm />
        </CatalogSection>

        <CatalogSection id="badges" title="Badges">
          <div className="catalog-row">
            <Badge>Brouillon</Badge>
            <Badge tone="info">En attente</Badge>
            <Badge tone="success">Validé</Badge>
            <Badge tone="warning">À compléter</Badge>
            <Badge tone="danger">Refusé</Badge>
          </div>
        </CatalogSection>

        <CatalogSection id="cartes" title="Cartes">
          <div className="catalog-grid">
            <Card
              eyebrow="Pays A · fictif"
              title="Université fictive de Valmont"
              footer={
                <ButtonLink to={paths.home} variant="secondary" size="sm">
                  Voir le détail
                </ButtonLink>
              }
            >
              <p>Exemple de carte de destination avec un badge de statut.</p>
              <Badge tone="success">Ouverte</Badge>
            </Card>
            <Card title="Carte simple">
              <p>Une carte peut ne contenir qu’un titre et un texte.</p>
            </Card>
          </div>
        </CatalogSection>

        <CatalogSection id="tableaux" title="Tableaux">
          <RadioGroup
            legend="État du tableau"
            name="table-state"
            value={tableState}
            onChange={setTableState}
            options={[
              { value: 'data', label: 'Données' },
              { value: 'loading', label: 'Chargement' },
              { value: 'error', label: 'Erreur' },
              { value: 'empty', label: 'Vide' },
            ]}
            className="catalog-inline-group"
          />
          <Table
            caption="Destinations fictives (exemple)"
            columns={destinationColumns}
            rows={tableState === 'data' ? demoDestinations : []}
            getRowKey={(row) => row.id}
            isLoading={tableState === 'loading'}
            error={
              tableState === 'error'
                ? 'Le serveur n’a pas répondu. Vérifiez votre connexion.'
                : null
            }
            onRetry={() => setTableState('data')}
            emptyTitle="Aucune destination"
            emptyDescription="Aucune destination ne correspond aux filtres choisis."
          />
        </CatalogSection>

        <CatalogSection id="modales" title="Modales">
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Ouvrir la fenêtre de confirmation
          </Button>
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Retirer ce vœu ?"
            description="Cette action est un exemple : aucune donnée n’est modifiée."
            actions={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setIsModalOpen(false)
                    notify({ tone: 'info', message: 'Exemple : le vœu aurait été retiré.' })
                  }}
                >
                  Retirer le vœu
                </Button>
              </>
            }
          />
        </CatalogSection>

        <CatalogSection id="notifications" title="Notifications">
          <div className="catalog-stack">
            {visibleAlerts.info ? (
              <Alert
                tone="info"
                title="Campagne ouverte"
                onDismiss={() => setVisibleAlerts((v) => ({ ...v, info: false }))}
              >
                Les vœux peuvent être saisis jusqu’à la date limite (exemple).
              </Alert>
            ) : null}
            {visibleAlerts.success ? (
              <Alert
                tone="success"
                onDismiss={() => setVisibleAlerts((v) => ({ ...v, success: false }))}
              >
                Vos vœux ont été enregistrés (exemple).
              </Alert>
            ) : null}
            {visibleAlerts.warning ? (
              <Alert
                tone="warning"
                title="Dossier incomplet"
                onDismiss={() => setVisibleAlerts((v) => ({ ...v, warning: false }))}
              >
                Il manque un justificatif de niveau de langue (exemple).
              </Alert>
            ) : null}
            {visibleAlerts.danger ? (
              <Alert
                tone="danger"
                onDismiss={() => setVisibleAlerts((v) => ({ ...v, danger: false }))}
              >
                L’enregistrement a échoué. Réessayez dans quelques instants (exemple).
              </Alert>
            ) : null}
          </div>
          <div className="catalog-row">
            <Button
              variant="secondary"
              onClick={() =>
                notify({ tone: 'success', message: 'Notification de succès (exemple).' })
              }
            >
              Afficher une notification de succès
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                notify({
                  tone: 'danger',
                  title: 'Échec',
                  message: 'Notification d’erreur (exemple).',
                })
              }
            >
              Afficher une notification d’erreur
            </Button>
          </div>
        </CatalogSection>

        <CatalogSection id="etats" title="États de chargement, vide et erreur">
          <div className="catalog-grid">
            <Card title="Chargement">
              <LoadingState />
            </Card>
            <Card title="Vide">
              <EmptyState
                title="Aucun vœu enregistré"
                description="Ajoutez une destination depuis le catalogue."
              />
            </Card>
            <Card title="Erreur">
              <ErrorState
                message="Impossible de récupérer les données."
                onRetry={() => notify({ message: 'Nouvelle tentative (exemple).' })}
              />
            </Card>
          </div>
        </CatalogSection>
      </div>
    </div>
  )
}
