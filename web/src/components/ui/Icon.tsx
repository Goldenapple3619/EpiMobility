export type IconName = 'info' | 'success' | 'warning' | 'error' | 'close' | 'external' | 'empty'

const iconPaths: Readonly<Record<IconName, string>> = {
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
  success:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.5 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z',
  warning: 'M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z',
  error:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.6 12.2-1.4 1.4L12 13.4l-2.2 2.2-1.4-1.4 2.2-2.2-2.2-2.2 1.4-1.4 2.2 2.2 2.2-2.2 1.4 1.4-2.2 2.2 2.2 2.2Z',
  close:
    'M6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6 6.4 5Z',
  external:
    'M14 3v2h3.6l-9.3 9.3 1.4 1.4L19 6.4V10h2V3h-7ZM19 19H5V5h7V3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-7h-2v7Z',
  empty:
    'M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm0 12H4V8h16v10Z',
}

type IconProps = Readonly<{
  name: IconName
  className?: string
}>

/** Icône décorative : toujours accompagnée d'un texte qui porte l'information. */
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={['icon', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={iconPaths[name]} fill="currentColor" />
    </svg>
  )
}
