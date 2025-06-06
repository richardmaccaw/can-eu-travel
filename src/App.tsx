import { Button } from "@/components/ui/button"
import { SchengenFileProcessor, type ProcessingResult } from "@/lib/schengen/processor"
import { useCallback, useRef, useState } from "react"
import { SchengenCalendar } from "@/components/SchengenCalendar"
import { sampleDaysSet, sampleStats } from "@/fixtures/sampleData"
import { Input } from "./components/ui/input";

function App() {
  const [data, setData] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stats] = useState(sampleStats)
  const [daysSet] = useState(sampleDaysSet)


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
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <Button onClick={handleUploadClick}>Click me</Button>
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
