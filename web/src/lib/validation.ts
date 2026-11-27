/**
 * Messages de validation standardisés. Ils nomment le champ et indiquent comment corriger,
 * pour être compréhensibles hors contexte (récapitulatif d'erreurs, lecteur d'écran).
 */
export const validationMessages = {
  required: (label: string) => `Renseignez le champ « ${label} ».`,
  requiredChoice: (label: string) => `Sélectionnez une option pour « ${label} ».`,
  email: (label: string) =>
    `Saisissez une adresse e-mail valide dans « ${label} » (ex. nom@domaine.fr).`,
  minLength: (label: string, min: number) =>
    `« ${label} » doit contenir au moins ${min} caractères.`,
  maxLength: (label: string, max: number) =>
    `« ${label} » doit contenir au plus ${max} caractères.`,
  mustAccept: (label: string) => `Cochez « ${label} » pour continuer.`,
} as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0
}

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}
