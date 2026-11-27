import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from '@/app/App'
import { bootstrap } from '@/app/bootstrap'
import { ConfigErrorPage } from '@/pages/ConfigErrorPage'

const root = createRoot(document.getElementById('root')!)

void bootstrap().then((result) => {
  root.render(
    <StrictMode>
      {result.ok ? <App api={result.api} /> : <ConfigErrorPage message={result.message} />}
    </StrictMode>,
  )
})
