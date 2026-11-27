import { useId, type ReactNode, type Ref } from 'react'
import { EmptyState, ErrorState, LoadingState } from './States'

export type TableColumn<Row> = Readonly<{
  key: string
  header: string
  render: (row: Row) => ReactNode
  /** La cellule identifie la ligne (rendue en `<th scope="row">`). */
  isRowHeader?: boolean
  align?: 'start' | 'end'
}>

type TableProps<Row> = Readonly<{
  caption: string
  columns: readonly TableColumn<Row>[]
  rows: readonly Row[]
  getRowKey: (row: Row) => string
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: ReactNode
  /** Zone du tableau (toujours montée) : cible de focus après pagination ou relance. */
  regionRef?: Ref<HTMLDivElement>
}>

/**
 * Tableau de données accessible : légende obligatoire, en-têtes de colonnes et de lignes,
 * zone défilante focalisable au clavier sur petits écrans.
 */
export function Table<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  isLoading = false,
  error = null,
  onRetry,
  emptyTitle = 'Aucun élément à afficher',
  emptyDescription,
  regionRef,
}: TableProps<Row>) {
  const captionId = useId()

  let stateContent: ReactNode = null
  if (isLoading) stateContent = <LoadingState />
  else if (error) stateContent = <ErrorState message={error} onRetry={onRetry} />
  else if (rows.length === 0)
    stateContent = <EmptyState title={emptyTitle} description={emptyDescription} />

  return (
    <div
      ref={regionRef}
      className="table-wrapper"
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
    >
      <table className="table" aria-busy={isLoading || undefined}>
        <caption id={captionId}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={alignClass(column.align)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stateContent ? (
            <tr>
              <td colSpan={columns.length}>{stateContent}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) =>
                  column.isRowHeader ? (
                    <th key={column.key} scope="row" className={alignClass(column.align)}>
                      {column.render(row)}
                    </th>
                  ) : (
                    <td key={column.key} className={alignClass(column.align)}>
                      {column.render(row)}
                    </td>
                  ),
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function alignClass(align: TableColumn<unknown>['align']) {
  return align === 'end' ? 'table__cell--end' : undefined
}
