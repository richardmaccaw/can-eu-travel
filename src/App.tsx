import { useCallback, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { Story } from '@/components/Story'
import { SchengenCalendar } from '@/components/SchengenCalendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSmoothScrollTo } from '@/hooks/useSmoothScrollTo'
import { SchengenFileProcessor, type ProcessingResult } from '@/lib/schengen/processor'
import { StatsSummary } from '@/components/StatsSummary'
import { useIsIntersecting } from '@/hooks/useIsIntersecting'

function App() {
  const [data, setData] = useState<ProcessingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const uploadLinkRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hideSkip = useIsIntersecting(uploadLinkRef, { threshold: 0.5 })

  const stats = data?.stats
  const daysSet = data?.daysSet

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
    smoothScrollTo(uploadLinkRef.current)
  }

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">


      {/* Story section */}
      <section>

        <div className="flex justify-end sticky top-2">
          <Button
            variant="link"
            className={cn(
              'group transition-opacity duration-500',
              hideSkip && 'opacity-0 pointer-events-none'
            )}
            onClick={handleSkipClick}
          >
            Skip
            <ArrowDown className="pr-1 transition-transform duration-300 group-hover:translate-y-1 group-hover:animate-bounce" />
          </Button>
        </div>
        <Story />
      </section>

      {/* Main content section */}
      <section className="snap-center">
        <div className="flex  flex-col gap-4 p-4" ref={uploadLinkRef}>
          <StatsSummary
            stats={stats}
            onFile={file => { void handleFile(file) }}
            fileInputRef={fileInputRef}
          />

          {error && <p className="text-red-600">{error}</p>}

          <SchengenCalendar stats={stats} daysSet={daysSet} />

          <footer className="mt-8 mb-2 text-center text-xs opacity-60">
            Made in exile by <a href="https://github.com/richardmaccaw/can-eu-travel" target="_blank" rel="noopener noreferrer" className="underline">Richard MacCaw</a>
          </footer>
        </div>
      </section>
    </div>
  )
}

export default App
