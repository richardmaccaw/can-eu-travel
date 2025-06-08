import { useEffect, useState } from 'react'

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
