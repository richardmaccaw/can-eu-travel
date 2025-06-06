import { useCallback } from 'react'

export function useSmoothScrollTo() {
  return useCallback((el: HTMLElement | null) => {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])
}
