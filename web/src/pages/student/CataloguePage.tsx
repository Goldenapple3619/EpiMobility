import { useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { Badge, Button, Table, TextField, type TableColumn } from '@/components/ui'
import { formatLanguages } from '@/features/catalogue/languages'
import { useUniversityCatalogue } from '@/features/catalogue/useUniversityCatalogue'
import type { University } from '@/types/domain'

const columns: readonly TableColumn<University>[] = [
  {
    key: 'name',
    header: 'Destination',
    isRowHeader: true,
    render: (university) => (
      <span className="catalogue__name">
        {university.name}
        {university.isFictional ? <Badge tone="info">Fictive</Badge> : null}
      </span>
    ),
  },
  { key: 'city', header: 'Ville', render: (university) => university.city },
  { key: 'country', header: 'Pays', render: (university) => university.countryName },
  {
    key: 'languages',
    header: 'Langues d’enseignement',
    render: (university) => formatLanguages(university.teachingLanguages),
  },
  { key: 'seats', header: 'Places', align: 'end', render: (university) => university.seats },
]

const SEARCH_INPUT_ID = 'catalogue-search'

function readPage(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q')?.trim() ?? ''
  const page = readPage(searchParams.get('page'))
  const [draft, setDraft] = useState(search)
  const catalogue = useUniversityCatalogue(search, page)
  // Les boutons de pagination, « Effacer » et « Réessayer » disparaissent pendant le
  // rechargement : le focus est déplacé sur un élément stable pour ne pas retomber sur <body>.
  const resultsRef = useRef<HTMLDivElement>(null)

  function updateParams(next: { q?: string; page?: number }) {
    const params = new URLSearchParams()
    const q = next.q ?? search
    const p = next.page ?? 1
    if (q) params.set('q', q)
    if (p > 1) params.set('page', String(p))
    setSearchParams(params)
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateParams({ q: draft.trim(), page: 1 })
  }

  function clearSearch() {
    setDraft('')
    updateParams({ q: '', page: 1 })
    document.getElementById(SEARCH_INPUT_ID)?.focus()
  }

  function goToPage(nextPage: number) {
    updateParams({ page: nextPage })
    resultsRef.current?.focus()
  }

  function retry() {
    catalogue.retry()
    resultsRef.current?.focus()
  }

  const result = catalogue.status === 'success' ? catalogue.data : null

  return (
    <section className="section page-section" aria-labelledby="page-title">
      <div className="container">
        <span className="eyebrow">Espace étudiant</span>
        <h1 id="page-title">Catalogue des destinations</h1>
        <p className="page-section__lead">
          Consultez les destinations proposées pour la campagne de mobilité. Dans le cadre du projet
          pédagogique, tous les partenariats sont fictifs.
        </p>

        <form className="catalogue__search" role="search" onSubmit={handleSearch}>
          <TextField
            id={SEARCH_INPUT_ID}
            label="Rechercher une destination"
            type="search"
            hint="Nom de l’établissement ou de la ville."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="catalogue__search-actions">
            <Button type="submit">Rechercher</Button>
            {search ? (
              <Button variant="ghost" onClick={clearSearch}>
                Effacer la recherche
              </Button>
            ) : null}
          </div>
        </form>

        <p className="catalogue__count" role="status">
          {result
            ? `${result.totalItems} destination${result.totalItems > 1 ? 's' : ''} trouvée${result.totalItems > 1 ? 's' : ''}${search ? ` pour « ${search} »` : ''}.`
            : ''}
        </p>

        <Table
          caption="Destinations partenaires (fictives)"
          columns={columns}
          rows={result?.items ?? []}
          getRowKey={(university) => university.id}
          isLoading={catalogue.status === 'loading'}
          error={catalogue.status === 'error' ? catalogue.error : null}
          onRetry={retry}
          regionRef={resultsRef}
          emptyTitle="Aucune destination trouvée"
          emptyDescription={
            search
              ? 'Essayez un autre terme ou effacez la recherche.'
              : 'Aucune destination n’est encore publiée.'
          }
        />

        {result && result.totalPages > 1 ? (
          <nav className="pagination" aria-label="Pagination du catalogue">
            <Button
              variant="secondary"
              size="sm"
              disabled={result.page <= 1}
              onClick={() => goToPage(result.page - 1)}
            >
              Page précédente
            </Button>
            <p>
              Page {result.page} sur {result.totalPages}
            </p>
            <Button
              variant="secondary"
              size="sm"
              disabled={result.page >= result.totalPages}
              onClick={() => goToPage(result.page + 1)}
            >
              Page suivante
            </Button>
          </nav>
        ) : null}
      </div>
    </section>
  )
}
