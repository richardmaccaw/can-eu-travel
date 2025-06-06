import { useState, useCallback, useRef } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { timelineToFixes } from './fileHandler'
import { collectSchengenDays, windowStats } from './schengen'
import { msToUTCmidnight } from './utils'
import type { Stats } from './sampleData'

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null)
      const text = await file.text()
      const jsonArray = JSON.parse(text)
      const visits = Array.from(timelineToFixes(jsonArray))
      const daysSet = await collectSchengenDays(visits)
      const dayArray = [...daysSet.keys()].sort((a, b) => a - b)
      const todayMidn = msToUTCmidnight(Date.now())
      const s = windowStats(dayArray, todayMidn)
      setStats(s)
    } catch (err: any) {
      setError(err.message || 'Failed to read file')
    }
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="p-4 font-sans space-y-4">
      <h1 className="text-2xl font-bold">Schengen 90/180 Calculator</h1>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onChange}
        className="hidden"
      />
      <Button variant="outline" type="button" onClick={handleUploadClick}>
        Upload JSON
      </Button>
      {error && <p className="text-red-600">{error}</p>}
      {stats && (
        <div className="mt-4 space-y-1">
          <p>Days used: {stats.used}</p>
          <p>Days left: {stats.left}</p>
        </div>
      )}
    </div>
  )
}
