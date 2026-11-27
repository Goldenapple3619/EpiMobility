import { useContext } from 'react'
import { ToastContext, type ToastContextValue } from './toastContext'

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast doit être utilisé dans un ToastProvider.')
  return value
}
