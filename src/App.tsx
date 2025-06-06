import { useState, useCallback } from 'react'
import { timelineToFixes } from './fileHandler'
import { collectSchengenDays, windowStats } from './schengen'
import { msToUTCmidnight } from './utils'
import type { Stats } from './sampleData'

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Schengen 90/180 Calculator</h1>
      <input type="file" accept=".json" onChange={onChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stats && (
        <div style={{ marginTop: '1rem' }}>
          <p>Days used: {stats.used}</p>
          <p>Days left: {stats.left}</p>
        </div>
      )}
    </div>
  )
}
