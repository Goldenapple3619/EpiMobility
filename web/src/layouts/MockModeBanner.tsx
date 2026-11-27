import { useApi } from '@/services/api/useApi'

/** Signale en permanence que les données affichées sont fictives (mode mock explicite). */
export function MockModeBanner() {
  const { mode } = useApi()
  if (mode !== 'mock') return null

  return (
    <div className="mock-banner" role="note" aria-label="Mode démonstration">
      <div className="container">
        <p>
          <strong>Mode démonstration :</strong> données fictives locales, aucun serveur API n’est
          contacté.
        </p>
      </div>
    </div>
  )
}
