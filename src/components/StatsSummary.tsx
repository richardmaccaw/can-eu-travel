import { type Stats } from '@/fixtures/sampleData'

interface StatsSummaryProps {
  stats: Stats
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
      <p className="text-balance font-serif text-7xl font-semibold">
        {stats.left > 0 ? `${String(stats.left)} days left` : 'No days left'}
      </p>
      {stats.left <= 0 && (
        <p className="text-red-600 text-lg">You have overstayed!</p>
      )}
    </div>
  )
}
