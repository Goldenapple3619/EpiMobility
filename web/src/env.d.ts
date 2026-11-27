/// <reference types="vite/client" />

/**
 * Variables exposées au navigateur. Elles sont publiques par nature (intégrées au bundle) :
 * n'y placer AUCUN secret, clé privée ou jeton.
 */
interface ImportMetaEnv {
  /** `mock` (données fictives locales) ou `http` (API réelle). */
  readonly VITE_API_MODE?: string
  /** URL de base de l'API, relative de préférence (`/api`). */
  readonly VITE_API_BASE_URL?: string
  /** Délai maximal d'une requête, en millisecondes. */
  readonly VITE_API_TIMEOUT_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
