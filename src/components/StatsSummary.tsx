import { type ProcessingResult } from '@/lib/schengen/processor'
import { Button } from './ui/button'

interface StatsSummaryProps {
  stats?: ProcessingResult['stats'] | null
  onImportClick: () => void
  importRef?: React.RefObject<HTMLElement>
}

export function StatsSummary({ stats, onImportClick, importRef }: StatsSummaryProps) {
  const left = stats?.left ?? 0

  if (!stats) {
    return (
      <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
        <p className="text-balance font-serif text-7xl">
          <Button
            ref={importRef as React.RefObject<HTMLButtonElement>}
            onClick={onImportClick}
            variant="link"
            className="p-0 text-7xl align-baseline underline hover:opacity-80  "
          >
            Import data
          </Button>{' '} days left
        </p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10">
      <p className="text-balance font-serif text-7xl">
        {left > 0 ? (
          <>
            <Button
              ref={importRef as React.RefObject<HTMLButtonElement>}
              onClick={onImportClick}
              variant="link"
              className="p-0 text-7xl align-baseline underline hover:opacity-80  "
            >
              {left}
            </Button>{' '}
            days left
          </>
        ) : (
          <>
            <Button
              ref={importRef as React.RefObject<HTMLButtonElement>}
              onClick={onImportClick}
              variant="link"
              className="p-0 text-7xl align-baseline"
            >
              No
            </Button>{' '}
            days left
          </>
        )}
      </p>
      {left <= 0 && (
        <p className="text-red-600 text-lg">You have overstayed!</p>
      )}
    </div>
  )
}
