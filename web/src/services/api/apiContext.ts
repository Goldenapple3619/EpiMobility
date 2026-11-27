import { createContext } from 'react'
import type { EpiMobilityApi } from './types'

export const ApiContext = createContext<EpiMobilityApi | null>(null)
