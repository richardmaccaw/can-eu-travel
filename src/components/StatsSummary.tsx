import { type ProcessingResult } from '@/lib/schengen/processor'
import { useCountDown } from '@/hooks/useCountUp'

interface StatsSummaryProps {
  stats?: ProcessingResult['stats'] | null
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const left = stats?.left ?? 0
  const animatedLeft = useCountDown(90, left, 1000)

  if (!stats) {
    return (
      <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
        <p className="text-balance font-serif text-7xl font-semibold">? days left</p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
      <p className="text-balance font-serif text-7xl font-semibold">
        {left > 0
          ? String(animatedLeft) + ' days left'
          : 'No days left'}
      </p>
      {left <= 0 && (
        <p className="text-red-600 text-lg">You have overstayed!</p>
      )}
    </div>
  )
}
