import type { Assignment, Ruleset, Simulation, Student, Wish } from '@/types/domain'

/** Données de démonstration fictives (personnes inventées, adresses en example.org). */
export const MOCK_CURRENT_STUDENT_ID = 'stu-demo-01'

export const mockStudents: readonly Student[] = [
  {
    id: MOCK_CURRENT_STUDENT_ID,
    studentNumber: 'ORV-2026-0001',
    firstName: 'Camille',
    lastName: 'Exemple',
    email: 'camille.exemple@example.org',
    program: 'Cycle ingénieur (fictif)',
    year: 3,
  },
  {
    id: 'stu-demo-02',
    studentNumber: 'ORV-2026-0002',
    firstName: 'Sacha',
    lastName: 'Démonstration',
    email: 'sacha.demonstration@example.org',
    program: 'Cycle ingénieur (fictif)',
    year: 3,
  },
  {
    id: 'stu-demo-03',
    studentNumber: 'ORV-2026-0003',
    firstName: 'Noa',
    lastName: 'Fictif',
    email: 'noa.fictif@example.org',
    program: 'Cycle ingénieur (fictif)',
    year: 4,
  },
]

export const mockWishes: readonly Wish[] = [
  {
    id: 'wish-demo-01',
    studentId: MOCK_CURRENT_STUDENT_ID,
    universityId: 'uni-fictive-01',
    rank: 1,
    createdAt: '2026-11-02T09:00:00Z',
    updatedAt: '2026-11-02T09:00:00Z',
  },
  {
    id: 'wish-demo-02',
    studentId: MOCK_CURRENT_STUDENT_ID,
    universityId: 'uni-fictive-03',
    rank: 2,
    createdAt: '2026-11-02T09:00:00Z',
    updatedAt: '2026-11-02T09:00:00Z',
  },
]

export const mockRulesets: readonly Ruleset[] = [
  {
    id: 'rules-demo-01',
    name: 'Règles de démonstration',
    version: 1,
    maxWishes: 5,
    criteria: [
      { key: 'wishRank', label: 'Rang du vœu', weight: 0.6 },
      { key: 'academicResults', label: 'Résultats académiques', weight: 0.4 },
    ],
    isActive: true,
    updatedAt: '2026-11-01T08:00:00Z',
  },
]

export const mockSimulations: readonly Simulation[] = [
  {
    id: 'sim-demo-01',
    rulesetId: 'rules-demo-01',
    status: 'completed',
    createdAt: '2026-11-20T14:00:00Z',
    completedAt: '2026-11-20T14:00:05Z',
    summary: { assignedCount: 2, unassignedCount: 1, firstChoiceRate: 0.5 },
  },
]

export const mockAssignment: Assignment | null = null
