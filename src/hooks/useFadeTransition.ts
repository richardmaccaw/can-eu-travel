import { useEffect, useState } from "react"

/**
 * useFadeTransition
 * Handles fade-out, value update, and fade-in transitions for a changing value.
 * @param value The value to watch for changes
 * @param duration The total duration of the fade (ms, default 500)
 * @returns [displayedValue, fadeState]
 */
export function useFadeTransition<T>(value: T, duration = 500): [T, 'in' | 'out'] {
  const [displayedValue, setDisplayedValue] = useState<T>(value)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')

  useEffect(() => {
    if (value !== displayedValue) {
      setFadeState('out')
      const timeout = setTimeout(() => {
        setDisplayedValue(value)
        setFadeState('in')
      }, duration / 2)
      return () => { clearTimeout(timeout); }
    }
  }, [value, displayedValue, duration])

  return [displayedValue, fadeState]
} 