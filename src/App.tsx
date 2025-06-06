import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { SchengenFileProcessor, type ProcessingResult } from "@/lib/schengen/processor"
import { useCallback, useRef, useState, useEffect } from "react"
import { SchengenCalendar } from "@/components/SchengenCalendar"
import { sampleDaysSet, sampleStats } from "@/fixtures/sampleData"
import { Input } from "@/components/ui/input"
import { Story } from "@/components/Story"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSmoothScrollTo } from "@/hooks/useSmoothScrollTo"


function App() {
  const [data, setData] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importButtonRef = useRef<HTMLButtonElement>(null)
  const [hideSkip, setHideSkip] = useState(false)
  const [stats] = useState(sampleStats)
  const [daysSet] = useState(sampleDaysSet)
  const [showEmoji, setShowEmoji] = useState(false)

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
      
      <Button className="mt-10" onClick={handleUploadClick}>
        Import location-history.json
      </Button>

      <Input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onChange}
        className="hidden"
      />
      
      <Toggle
        pressed={showEmoji}
        onPressedChange={setShowEmoji}
        className="mx-auto"
      >
        Show emoji
      </Toggle>
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="animate-in fade-in space-y-2 text-center">
          <p className="text-balance font-serif text-7xl font-semibold">
            {data.stats.left > 0
              ? `${String(data.stats.left)} days left`
              : 'No days left'}
          </p>
          <p className="text-sm">Days used: {data.stats.used}</p>
          {data.stats.left <= 0 && (
            <p className="text-red-600 text-lg">You have overstayed!</p>
          )}
        </div>
      )}

      <SchengenCalendar stats={stats} daysSet={daysSet} showEmoji={showEmoji} />

      <footer className="mt-auto text-center text-xs opacity-60">
        Made in exile by Richard MacCaw
      </footer>
    </div>
  )
}

export default App
