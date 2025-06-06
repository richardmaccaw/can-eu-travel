import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { SchengenFileProcessor, type ProcessingResult } from "@/lib/schengen/processor"
import { useCallback, useRef, useState } from "react"
import { SchengenCalendar } from "@/components/SchengenCalendar"
import { sampleDaysSet, sampleStats } from "@/fixtures/sampleData"
import { Input } from "./components/ui/input"
import { Story } from "@/components/Story"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"

function App() {
  const [data, setData] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stats] = useState(sampleStats)
  const [daysSet] = useState(sampleDaysSet)
  const [showEmoji, setShowEmoji] = useState(false)


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

  return (
    <div className="flex min-h-svh flex-col items-center gap-6 p-4">
      <Story />
      <Button className="mt-10" onClick={handleUploadClick}>
        Import
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <button className="text-sm text-muted-foreground underline opacity-70 hover:opacity-100">
            Show me how
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to export your location history</DialogTitle>
            <DialogDescription>
              Open your Google Maps application on your phone. Go to
              <strong className="mx-1">Settings</strong>, then
              <strong className="mx-1">Timeline</strong>, then choose
              <strong className="mx-1">Export location history</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        <div className="space-y-1">
          <p>Days used: {data.stats.used}</p>
          <p>Days left: {data.stats.left}</p>
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
