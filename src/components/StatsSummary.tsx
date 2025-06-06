import { ProcessingResult } from '@/lib/schengen/processor'

interface StatsSummaryProps {
  data: ProcessingResult | null
}

export function StatsSummary({ data }: StatsSummaryProps) {
  if (!data) return null

  return (
    <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
      <p className="text-balance font-serif text-7xl font-semibold">
        {data.stats.left > 0 ? `${String(data.stats.left)} days left` : 'No days left'}
      </p>
      {data.stats.left <= 0 && (
        <p className="text-red-600 text-lg">You have overstayed!</p>
      )}
    </div>
  )
}
