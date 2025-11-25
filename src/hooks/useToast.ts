import { useCallback } from 'react'
import { toaster } from '../components/ui/toaster'

export const useToast = () => {
  const showSuccess = useCallback((title: string, description?: string) => {
    toaster.create({
      title,
      description,
      type: 'success',
      duration: 5000,
    })
  }, [])

  const showError = useCallback((title: string, description?: string) => {
    toaster.create({
      title,
      description,
      type: 'error',
      duration: 7000,
    })
  }, [])

  const showInfo = useCallback((title: string, description?: string) => {
    toaster.create({
      title,
      description,
      type: 'info',
      duration: 5000,
    })
  }, [])

  return {
    showSuccess,
    showError,
    showInfo,
  }
}
