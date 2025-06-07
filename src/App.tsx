import { useCallback, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { Story } from '@/components/Story'
import { SchengenCalendar } from '@/components/SchengenCalendar'
import { sampleDaysSet, sampleStats } from '@/fixtures/sampleData'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSmoothScrollTo } from '@/hooks/useSmoothScrollTo'
import { SchengenFileProcessor, type ProcessingResult } from '@/lib/schengen/processor'
import { UploadControls } from '@/components/UploadControls'
import { StatsSummary } from '@/components/StatsSummary'
import { useIsIntersecting } from '@/hooks/useIsIntersecting'

function App() {
  const [data, setData] = useState<ProcessingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const importButtonRef = useRef<HTMLButtonElement>(null)
  const hideSkip = useIsIntersecting(importButtonRef, { threshold: 0.5 })

  const stats = data?.stats ?? sampleStats
  const daysSet = data?.daysSet ?? sampleDaysSet

  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null)
      const processor = new SchengenFileProcessor()
      const isValid = await processor.validateFile(file)
      if (!isValid) throw new Error('Invalid file format')
      const result = await processor.processFile(file)
      setData(result)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Failed to read file')
    }
  }, [])

  const smoothScrollTo = useSmoothScrollTo()
  const handleSkipClick = () => {
    smoothScrollTo(importButtonRef.current)
  }

  return (
    <div className="flex min-h-svh flex-col gap-4 p-4 snap-y snap-mandatory">
      <Button
        variant="ghost"
        className={cn(
          'sticky top-2 self-end group transition-opacity duration-500',
          hideSkip && 'opacity-0 pointer-events-none'
        )}
        onClick={handleSkipClick}
      >
        Skip
        <ArrowDown className="ml-1 transition-transform duration-300 group-hover:translate-y-1 group-hover:animate-bounce" />
      </Button>

      <Story />

      <UploadControls
        onFile={(file) => {
          void handleFile(file)
        }}
        importButtonRef={importButtonRef}
      />

      {error && <p className="text-red-600">{error}</p>}

      <StatsSummary data={data} />

      <SchengenCalendar stats={stats} daysSet={daysSet} />

      <footer className="mt-8 mb-2 text-center text-xs opacity-60">Made in exile by Richard MacCaw</footer>
    </div>
  )
}

export default App
