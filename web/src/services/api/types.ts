import type {
  Assignment,
  Id,
  Page,
  PageParams,
  Ruleset,
  Simulation,
  Student,
  University,
  Wish,
} from '@/types/domain'
import type { ApiMode } from '../config'

export type CallOptions = Readonly<{ signal?: AbortSignal }>

export type UniversityFilters = PageParams &
  Readonly<{
    /** Recherche plein texte sur le nom et la ville. */
    search?: string
    countryCode?: string
  }>

export type WishInput = Readonly<{ universityId: Id; rank: number }>

/**
 * Contrat d'accès aux données utilisé par les pages. Il est implémenté deux fois :
 * `httpApi` (API réelle) et `mockApi` (données fictives locales). Les pages ne savent pas
 * laquelle est utilisée : changer `VITE_API_MODE` suffit.
 */
export type EpiMobilityApi = Readonly<{
  mode: ApiMode
  universities: Readonly<{
    list: (filters?: UniversityFilters, options?: CallOptions) => Promise<Page<University>>
    get: (id: Id, options?: CallOptions) => Promise<University>
  }>
  students: Readonly<{
    list: (
      params?: PageParams & { search?: string },
      options?: CallOptions,
    ) => Promise<Page<Student>>
  }>
  wishes: Readonly<{
    /** Vœux de l'étudiant connecté. */
    listMine: (options?: CallOptions) => Promise<readonly Wish[]>
    /** Remplace l'ensemble des vœux de l'étudiant connecté (opération atomique). */
    replaceMine: (wishes: readonly WishInput[], options?: CallOptions) => Promise<readonly Wish[]>
  }>
  assignments: Readonly<{
    /** Affectation publiée de l'étudiant connecté, `null` si aucune. */
    getMine: (options?: CallOptions) => Promise<Assignment | null>
  }>
  rulesets: Readonly<{
    list: (options?: CallOptions) => Promise<readonly Ruleset[]>
  }>
  simulations: Readonly<{
    list: (params?: PageParams, options?: CallOptions) => Promise<Page<Simulation>>
    get: (id: Id, options?: CallOptions) => Promise<Simulation>
  }>
}>
