import { useEffect, useState } from 'react'

/**
 * useIsIntersecting
 * Tracks whether a target element is currently intersecting with the viewport or a parent element.
 * @param target A React ref object pointing to the element to observe
 * @param options Optional IntersectionObserver options
 * @returns Boolean indicating if the element is intersecting
 */
export function useIsIntersecting(
  target: React.RefObject<Element | null>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const el = target.current
    if (!el) {
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [target, options])

  return isIntersecting
}
