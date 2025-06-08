import { type ProcessingResult } from '@/lib/schengen/processor'
import { sampleStats } from '@/fixtures/sampleData'
import { useCountDown } from '@/hooks/useCountUp'

interface StatsSummaryProps {
  stats?: ProcessingResult['stats'] | null
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const statsToDisplay = stats ?? sampleStats
  const animatedLeft = useCountDown(90, statsToDisplay.left, 1000)
  return (
    <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
      <p className="text-balance font-serif text-7xl font-semibold">
        {statsToDisplay.left > 0
          ? `${animatedLeft ?? ''} days left`
          : 'No days left'}
      </p>
      {statsToDisplay.left <= 0 && (
        <p className="text-red-600 text-lg">You have overstayed!</p>
      )}
    </div>
  )
}
