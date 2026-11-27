import { brand } from '@/app/brand'

/** Affiché si la configuration (`VITE_API_*`) est invalide : on ne démarre pas en silence. */
export function ConfigErrorPage({ message }: Readonly<{ message: string }>) {
  return (
    <main className="section">
      <div className="container status-page__inner">
        <h1>Configuration invalide</h1>
        <p>L’application ne peut pas démarrer : {message}</p>
        <p>Consultez la documentation du front-end (variables `VITE_API_*`).</p>
        <p>
          {brand.institutionName} — {brand.disclaimer}
        </p>
      </div>
    </main>
  )
}
