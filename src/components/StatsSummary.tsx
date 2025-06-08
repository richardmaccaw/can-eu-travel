import { type ProcessingResult } from '@/lib/schengen/processor'
import { useCountDown } from '@/hooks/useCountUp'

interface StatsSummaryProps {
  stats?: ProcessingResult['stats'] | null
  onImportClick: () => void
  importRef?: React.RefObject<HTMLElement>
}

export function StatsSummary({ stats, onImportClick, importRef }: StatsSummaryProps) {
  const left = stats?.left ?? 0
  const animatedLeft = useCountDown(90, left, 1000)

  if (!stats) {
    return (
      <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
        <p className="text-balance font-serif text-7xl font-semibold">
          <button
            ref={importRef as React.RefObject<HTMLButtonElement>}
            onClick={onImportClick}
            className="underline underline-offset-4 hover:opacity-80"
          >
            Import data
          </button>{' '}
          days left
        </p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
      <p className="text-balance font-serif text-7xl font-semibold">
        <button
          ref={importRef as React.RefObject<HTMLButtonElement>}
          onClick={onImportClick}
          className="underline underline-offset-4 hover:opacity-80"
        >
          {left > 0 ? `${animatedLeft} days left` : 'No days left'}
        </button>
      </p>
      {left <= 0 && (
        <p className="text-red-600 text-lg">You have overstayed!</p>
      )}
    </div>
  )
}
