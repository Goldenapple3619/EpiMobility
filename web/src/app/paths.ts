/**
 * Routes nommées de l'application. Toute navigation interne doit passer par ces constantes
 * afin qu'un renommage d'URL ne se fasse qu'à un seul endroit.
 */
export const paths = {
  home: '/',
  about: '/presentation',
  help: '/aide',
  login: '/connexion',
  forbidden: '/acces-interdit',
  /** Catalogue interne des composants UI, volontairement absent des menus. */
  componentCatalog: '/composants',
  student: {
    root: '/etudiant',
    catalogue: '/etudiant/catalogue',
    wishes: '/etudiant/voeux',
    assignment: '/etudiant/affectation',
  },
  admin: {
    root: '/admin',
    universities: '/admin/universites',
    students: '/admin/etudiants',
    rulesets: '/admin/regles',
    simulations: '/admin/simulations',
  },
} as const
