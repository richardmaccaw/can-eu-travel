import { Button } from "@/components/ui/button"
import { SchengenFileProcessor, type ProcessingResult } from "@/lib/schengen/processor"
import { useCallback, useRef, useState, useEffect } from "react"
import { SchengenCalendar } from "@/components/SchengenCalendar"
import { sampleDaysSet, sampleStats } from "@/fixtures/sampleData"
import { Input } from "@/components/ui/input"
import { Story } from "@/components/Story"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSmoothScrollTo } from "@/hooks/useSmoothScrollTo"
import { useCountUp } from "@/hooks/useCountUp"


function App() {
  const [data, setData] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importButtonRef = useRef<HTMLButtonElement>(null)
  const [hideSkip, setHideSkip] = useState(false)
  const [stats] = useState(sampleStats)
  const [daysSet] = useState(sampleDaysSet)
  const countedLeft = useCountUp(data ? data.stats.left : null)


  useEffect(() => {
    const btn = importButtonRef.current
    if (!btn) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideSkip(entry.isIntersecting)
      },
      { threshold: 0.5 }
    )
    observer.observe(btn)
    return () => {
      observer.disconnect()
    }
  }, [])


  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null);
      const processor = new SchengenFileProcessor();

      // Validate file first
      const isValid = await processor.validateFile(file);
      if (!isValid) {
        throw new Error('Invalid file format');
      }

      // Process file
      const result = await processor.processFile(file);
      setData(result);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to read file');
      }
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const smoothScrollTo = useSmoothScrollTo()
  const handleSkipClick = () => {
    smoothScrollTo(importButtonRef.current)
  }

  return (

    <div className="flex min-h-svh flex-col gap-4 p-4">
      <Button
        variant="ghost"
        className={cn(
          "sticky top-2 self-end group transition-opacity duration-500",
          hideSkip && "opacity-0 pointer-events-none"
        )}
        onClick={handleSkipClick}
      >
        Skip
        <ArrowDown className="ml-1 transition-transform duration-300 group-hover:translate-y-1 group-hover:animate-bounce" />
      </Button>

      <Story />

      <div className="flex flex-col items-center gap-2">
        <Button
          ref={importButtonRef}
          className="mt-10 w-auto pointer-events-auto"
          onClick={handleUploadClick}
        >
          Import
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="text-sm text-muted-foreground underline opacity-70 hover:opacity-100 pointer-events-auto"
            >
              Show me how
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to export your location history</DialogTitle>
              <DialogDescription>
                Open your Google Maps application on your phone. Go to{' '}
                <strong>Settings</strong>, then{' '}
                <strong>Timeline</strong>, then choose{' '}
                <strong>Export location history</strong>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onChange}
        className="hidden"
      />



      {error && <p className="text-red-600">{error}</p>}

      <div className={cn('space-y-2 text-center', data && 'animate-in fade-in')}>
        <p
          className={cn(
            'text-balance font-serif text-7xl font-semibold transition-colors',
            !data && 'text-muted-foreground opacity-30'
          )}
        >
          {data
            ? data.stats.left > 0
              ? `${String(countedLeft ?? '?')} days left`
              : 'No days left'
            : '? days left'}
        </p>
        {data && (
          <>
            {data.stats.left <= 0 && (
              <p className="text-red-600 text-lg">You have overstayed!</p>
            )}
          </>
        )}
      </div>


      <SchengenCalendar stats={stats} daysSet={daysSet} />

      <footer className="mt-8 mb-2 text-center text-xs opacity-60">
        Made in exile by Richard MacCaw
      </footer>
    </div >
  )
}

export default App
