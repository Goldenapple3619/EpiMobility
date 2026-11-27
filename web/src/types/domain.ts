/**
 * Types métier PROVISOIRES partagés avec l'API. Ils n'engagent pas le pôle Backend :
 * chaque point marqué « À valider » est listé dans `web/API_CONTRACTS.md`.
 */

/** À valider : identifiants texte (UUID) ou numériques. */
export type Id = string

/** Date-heure ISO 8601 en UTC, ex. `2026-11-27T10:00:00Z`. */
export type IsoDateTime = string

/** Code pays ISO 3166-1 alpha-2, ex. `CA`. */
export type CountryCode = string

export type University = Readonly<{
  id: Id
  name: string
  city: string
  countryCode: CountryCode
  countryName: string
  /** Langues d'enseignement (codes ISO 639-1). */
  teachingLanguages: readonly string[]
  /** Nombre de places offertes pour la campagne en cours. */
  seats: number
  description: string
  /** `true` pour un établissement inventé : aucune information ne doit être présentée comme réelle. */
  isFictional: boolean
  /** Source obligatoire pour toute donnée réelle ; `null` pour un établissement fictif. */
  sourceUrl: string | null
}>

export type Student = Readonly<{
  id: Id
  studentNumber: string
  firstName: string
  lastName: string
  email: string
  program: string
  /** Année d'études (ex. 3 pour la 3ᵉ année). */
  year: number
}>

export type Wish = Readonly<{
  id: Id
  studentId: Id
  universityId: Id
  /** Rang de préférence, 1 = premier choix. Maximum fixé par la règle active. */
  rank: number
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}>

export type AssignmentStatus = 'provisional' | 'published' | 'unassigned'

export type Assignment = Readonly<{
  id: Id
  studentId: Id
  simulationId: Id
  /** `null` si l'étudiant n'a obtenu aucune destination. */
  universityId: Id | null
  /** Rang du vœu satisfait, `null` si non affecté. */
  wishRank: number | null
  status: AssignmentStatus
  /** Explication lisible du résultat. */
  explanation: string
}>

export type RulesetCriterion = Readonly<{
  key: string
  label: string
  /** Pondération relative, entre 0 et 1. */
  weight: number
}>

export type Ruleset = Readonly<{
  id: Id
  name: string
  version: number
  maxWishes: number
  criteria: readonly RulesetCriterion[]
  isActive: boolean
  updatedAt: IsoDateTime
}>

export type SimulationStatus = 'pending' | 'running' | 'completed' | 'failed'

export type SimulationSummary = Readonly<{
  assignedCount: number
  unassignedCount: number
  /** Part des étudiants ayant obtenu leur premier vœu, entre 0 et 1. */
  firstChoiceRate: number
}>

export type Simulation = Readonly<{
  id: Id
  rulesetId: Id
  status: SimulationStatus
  createdAt: IsoDateTime
  completedAt: IsoDateTime | null
  summary: SimulationSummary | null
}>

/** Enveloppe de liste paginée (À valider : pagination par page ou par curseur). */
export type Page<T> = Readonly<{
  items: readonly T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}>

export type PageParams = Readonly<{
  page?: number
  pageSize?: number
}>
