export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function msToUTCmidnight(ms: number): number {
  const d = new Date(ms)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}
