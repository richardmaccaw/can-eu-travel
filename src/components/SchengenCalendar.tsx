import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { sampleDaysSet, sampleStats, type Stats } from "@/fixtures/sampleData"
import { msToUTCmidnight } from "@/lib/schengen/dateUtils"
import { Toggle } from "@/components/ui/toggle"

export interface SchengenCalendarProps {
  stats?: Stats
  daysSet?: Map<number, { name: string; emoji: string }>
}

interface DayInfo {
  date: Date
  country?: { name: string; emoji: string }
}

export function SchengenCalendar({
  stats = sampleStats,
  daysSet = sampleDaysSet,
}: SchengenCalendarProps) {
  const [showEmoji, setShowEmoji] = useState(false)

  const startMs = useMemo(
    () => msToUTCmidnight(stats.windowStart),
    [stats.windowStart]
  )

  const dayList: DayInfo[] = useMemo(() => {
    const arr: DayInfo[] = []
    for (let i = 0; i < 180; i++) {
      const ms = startMs + i * 86_400_000
      const date = new Date(ms)
      arr.push({ date, country: daysSet.get(ms) })
    }
    return arr
  }, [startMs, daysSet])

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
        <Toggle
          pressed={showEmoji}
          onPressedChange={setShowEmoji}
          className="pointer-events-auto"
        >
          Toggle flags
        </Toggle>
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
