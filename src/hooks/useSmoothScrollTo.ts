import { useCallback } from 'react'

/**
 * useSmoothScrollTo
 * Returns a callback that smoothly scrolls a given element into view, centered in the viewport.
 * @returns A callback function that accepts an HTMLElement (or null)
 */
export function useSmoothScrollTo() {
  return useCallback((el: HTMLElement | null) => {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])
}
