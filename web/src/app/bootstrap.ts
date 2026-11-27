import { createApi } from '@/services/api/createApi'
import type { EpiMobilityApi } from '@/services/api/types'
import { readApiConfig } from '@/services/config'

export type BootstrapResult =
  Readonly<{ ok: true; api: EpiMobilityApi }> | Readonly<{ ok: false; message: string }>

/** Lit la configuration et crée l'API ; une configuration invalide ne démarre jamais en silence. */
export async function bootstrap(): Promise<BootstrapResult> {
  try {
    return { ok: true, api: await createApi(readApiConfig()) }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) }
  }
}
