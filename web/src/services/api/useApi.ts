import { useContext } from 'react'
import { ApiContext } from './apiContext'
import type { EpiMobilityApi } from './types'

export function useApi(): EpiMobilityApi {
  const api = useContext(ApiContext)
  if (!api) throw new Error('useApi doit être utilisé dans un ApiProvider.')
  return api
}
