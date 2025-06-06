import { Button } from "@/components/ui/button"
import { SchengenFileProcessor, type ProcessingResult } from "@/lib/schengen/processor"
import { useCallback, useRef, useState, useEffect } from "react"
import { SchengenCalendar } from "@/components/SchengenCalendar"
import { sampleDaysSet, sampleStats } from "@/fixtures/sampleData"
import { Input } from "@/components/ui/input"
import { Story } from "@/components/Story"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

function smoothScrollTo(element: HTMLElement, duration = 1500) {
  const start = window.scrollY
  const rect = element.getBoundingClientRect()
  const target = rect.top + start - window.innerHeight / 2 + rect.height / 2
  const diff = target - start
  const startTime = performance.now()
  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

  function step(currentTime: number) {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const ease = easeInOut(progress)
    window.scrollTo({ top: start + diff * ease })
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

function App() {
  const [data, setData] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importButtonRef = useRef<HTMLButtonElement>(null)
  const [hideSkip, setHideSkip] = useState(false)
  const [stats] = useState(sampleStats)
  const [daysSet] = useState(sampleDaysSet)

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

  const handleSkipClick = () => {
    if (importButtonRef.current) {
      smoothScrollTo(importButtonRef.current)
    }
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
      <Button ref={importButtonRef} onClick={handleUploadClick}>Import location-history.json </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onChange}
        className="hidden"
      />
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="space-y-1">
          <p>Days used: {data.stats.used}</p>
          <p>Days left: {data.stats.left}</p>
        </div>
      )}

      <SchengenCalendar stats={stats} daysSet={daysSet} />
    </div>
  )
}

export default App
