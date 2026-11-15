import type { ReactNode } from 'react'

type InfoCardProps = Readonly<{
  title: string
  children: ReactNode
}>

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section aria-labelledby="intro-title">
      <h2 id="intro-title">{title}</h2>
      {children}
    </section>
  )
}
