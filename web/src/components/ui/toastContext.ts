import { createContext } from 'react'
import type { AlertTone } from './Alert'

export type ToastInput = Readonly<{
  tone?: AlertTone
  title?: string
  message: string
}>

export type Toast = ToastInput & Readonly<{ id: number }>

export type ToastContextValue = Readonly<{
  notify: (toast: ToastInput) => number
  dismiss: (id: number) => void
}>

export const ToastContext = createContext<ToastContextValue | null>(null)
