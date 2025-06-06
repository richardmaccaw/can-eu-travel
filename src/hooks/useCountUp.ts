import { useEffect, useState } from 'react'

export function useCountUp(target: number | null, duration = 1000) {
  const [value, setValue] = useState<number | null>(null)

  useEffect(() => {
    if (target === null || target <= 0) {
      setValue(target)
      return
    }

    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    setValue(null)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [target, duration])

  return value
}
