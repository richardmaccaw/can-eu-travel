const paragraphs = [
  "Why I Built This Calculator (a tragicomedy in 90 Days)",
  "It all began at the Copenhagen border.",
  "My Swedish wife had already glided through passport control, practically applauded through by the border guard. Scandinavian passport. No queue. No fuss. Just a smile and a \u201cV\u00E4lkommen hem.\u201d",
  "I, on the other hand, was banished to the Brexit lane \u2014 a sad, snaking line of weary Brits shamefully clutching new blue passports like stolen museum relics. When I finally reached the front, I handed over my passport with my best \u201csurely-we\u2019re-still-friends?\u201d grin.",
  "The border officer did not smile back.",
  "Instead, she began flipping through my passport like a blackjack dealer, lips moving silently as she counted. Then she did it again. And again. Her brow furrowed deeper with each pass, until I began to worry she was calculating my life expectancy, not my travel history.",
  "After a long pause, she picked up the phone and spoke rapid Danish to someone who sounded very important and very unimpressed. I heard my name. I heard \u201cUnited Kingdom.\u201d I heard \u201cnon-resident overstayer?\u201d followed by the unmistakable European sigh of bureaucratic doom.",
  "My wife was already picking up her luggage.",
  "Eventually, with one final scowl, she handed back my passport and said:",
  "\u201cYou\u2019ve overstayed. But\u2026 we grant you 24 more hours.\u201d",
  "One more day in the EU. Like some kind of Brexit Cinderella, I had until midnight (the next day) before I turned back into a pumpkin and was catapulted across the North Sea.",
  "That\u2019s when I knew: there had to be a better way.",
  "So I built this calculator.",
  "It reads your Google Timeline export and calculates exactly how many Schengen days you\u2019ve used and how many you\u2019ve got left. No guessing. No calendar spreadsheets. No awkward standoffs in Copenhagen while your wife is halfway to the rental car.",
]

export function Story() {
  return (
    <div className="h-full snap-y snap-mandatory">
      {paragraphs.map((p, i) => (
        <section
          key={i}
          className="h-screen flex items-center justify-center px-6 snap-center"
        >
          <p className="text-balance text-center font-serif text-2xl md:text-4xl">
            {p}
          </p>
        </section>
      ))}
    </div>
  )
}
