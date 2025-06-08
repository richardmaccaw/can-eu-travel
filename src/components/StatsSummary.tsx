import { type ProcessingResult } from '@/lib/schengen/processor'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ShowMeHowDialog } from './ShowMeHowDialog'

interface StatsSummaryProps {
  stats?: ProcessingResult['stats'] | null
  onFile: (file: File) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function StatsSummary({ stats, onFile, fileInputRef }: StatsSummaryProps) {
  const left = stats?.left ?? 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  return (
    <div className="animate-in fade-in space-y-2 text-center pt-50 pb-10 flex flex-col items-center">
      <p className="text-balance font-serif text-7xl">
        {!stats ? (
          <>
            <Button
              onClick={handleImportClick}
              variant="link"
              className="p-0 text-7xl align-baseline underline hover:opacity-80  "
            >
              Import data
            </Button>{' '} days left
          </>
        ) : left > 0 ? (
          <>
            <Button
              onClick={handleImportClick}
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
              onClick={handleImportClick}
              variant="link"
              className="p-0 text-7xl align-baseline"
            >
              No
            </Button>{' '}
            days left
          </>
        )}
      </p>
      {left <= 0 && stats && (
        <p className="text-red-600 text-lg">You have overstayed!</p>
      )}

      <div className="flex flex-col items-center mt-6">
        <ShowMeHowDialog disabled={!!stats} />
        <Input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
