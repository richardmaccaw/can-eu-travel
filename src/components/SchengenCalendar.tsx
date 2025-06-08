import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { sampleDaysSet, sampleStats } from "@/fixtures/sampleData"
import { msToUTCmidnight } from "@/lib/schengen/dateUtils"
import { Switch } from "@/components/ui/switch"
import type { ProcessingResult } from "@/lib/schengen/processor"
import type { CountryInfo } from "@/lib/schengen/calculator"

export interface SchengenCalendarProps {
  stats?: ProcessingResult['stats'] | null
  daysSet?: Map<number, CountryInfo> | null
}

interface DayInfo {
  date: Date
  country?: CountryInfo
}

export function SchengenCalendar({
  stats,
  daysSet,
}: SchengenCalendarProps) {
  const statsToDisplay = stats ?? sampleStats
  const daysSetToDisplay = daysSet ?? sampleDaysSet
  const [showEmoji, setShowEmoji] = useState(true)

  const startMs = useMemo(
    () => msToUTCmidnight(statsToDisplay.windowStart),
    [statsToDisplay.windowStart]
  )

  const dayList: DayInfo[] = useMemo(() => {
    const arr: DayInfo[] = []
    for (let i = 0; i < 180; i++) {
      const ms = startMs + i * 86_400_000
      const date = new Date(ms)
      arr.push({ date, country: daysSetToDisplay.get(ms) })
    }
    return arr
  }, [startMs, daysSetToDisplay])

  const weeks = useMemo(() => {
    const w: DayInfo[][] = []
    for (let i = 0; i < dayList.length; i += 7) {
      w.push(dayList.slice(i, i + 7))
    }
    return w
  }, [dayList])

  const monthLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("en", { month: "short" })
    return weeks.map((week, idx) => {
      const month = fmt.format(week[0].date)
      const prevWeek = weeks[idx - 1]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const prevDate = prevWeek ? prevWeek[0].date : undefined
      return !prevDate || prevDate.getUTCMonth() !== week[0].date.getUTCMonth()
        ? month
        : ""
    })
  }, [weeks])

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-end mb-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch
            defaultChecked
            checked={showEmoji}
            onCheckedChange={setShowEmoji}
            id="toggle-flags"
          />
          <span className="text-sm">Show flags</span>
        </label>
      </div>
      <div className="flex gap-0.5 text-xs mb-1">
        {monthLabels.map((label, idx) => (
          <div key={idx} className="flex-1 h-5 flex items-center justify-center">
            {label}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-1 flex-col gap-2">
            {week.map((day, dIdx) => (
              <div
                key={dIdx}
                title={
                  day.country
                    ? `${day.date.toISOString().split("T")[0]} - ${day.country.name}`
                    : day.date.toISOString().split("T")[0]
                }
                className={cn(
                  "aspect-square w-full rounded-sm flex items-center justify-center overflow-hidden",
                  !day.country && "bg-muted",
                  day.country && !showEmoji && "bg-foreground"
                )}
              >
                {day.country && showEmoji && (
                  <span className="mask-circle text-2xl leading-none">
                    {day.country.emoji}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
