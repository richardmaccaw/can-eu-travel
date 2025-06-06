import { useEffect, useState } from 'react'

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
