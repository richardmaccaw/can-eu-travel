import { useFadeTransition } from "@/hooks/useFadeTransition"
import { cn } from "@/lib/utils"
import type { CountryInfo } from "@/lib/schengen/calculator"

function AnimatedDayCell({ country, date, showEmoji }: { country?: CountryInfo, date: Date, showEmoji: boolean }) {
    const [displayedCountry, fadeState] = useFadeTransition(country, 500)

    return (
        <div
            title={
                displayedCountry
                    ? `${date.toISOString().split("T")[0]} - ${displayedCountry.name}`
                    : date.toISOString().split("T")[0]
            }
            className={cn(
                "aspect-square w-full rounded-sm flex items-center justify-center overflow-hidden relative transition-colors duration-500",
                !displayedCountry && "bg-muted"
            )}
        >
            {/* Emoji */}
            {displayedCountry && (
                <span
                    className={cn(
                        "mask-circle text-2xl leading-none absolute inset-0 flex items-center justify-center transition-opacity duration-250",
                        showEmoji && fadeState === 'in' ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                >
                    {displayedCountry.emoji}
                </span>
            )}
            {/* Color fill */}
            {displayedCountry && (
                <span
                    className={cn(
                        "absolute inset-0 w-full h-full rounded-sm transition-opacity duration-250",
                        !showEmoji && fadeState === 'in' ? "opacity-100 bg-foreground" : "opacity-0 pointer-events-none"
                    )}
                />
            )}
        </div>
    )
}

export { AnimatedDayCell } 