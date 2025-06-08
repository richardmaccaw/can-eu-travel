import { useEffect, useState } from 'react'

/**
 * useCountDown
 * Animates a countdown from a starting number to a target number over a specified duration.
 * @param from The number to start counting down from (or null to skip)
 * @param to The number to count down to (default 0)
 * @param duration The duration of the countdown in milliseconds (default 1000)
 * @returns The current value of the countdown (number or null)
 */
export function useCountDown(from: number | null, to: number | null = 0, duration = 1000) {
  const [value, setValue] = useState<number | null>(from)

  useEffect(() => {
    if (from === null || to === null || from <= to) {
      setValue(to)
      return
    }

    let frame: number
    const start = performance.now()
    const diff = from - to
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(from - progress * diff))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    setValue(from)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [from, to, duration])

  return value
}
