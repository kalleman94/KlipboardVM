/**
 * Returns the "matchday date" string (YYYY-MM-DD) for a given Date.
 *
 * Shifts the time +10 hours before extracting the date so that the
 * Swedish matchday (roughly 18:00–06:00 CEST) groups under one date.
 * Boundary: 14:00 UTC = 16:00 CEST — anything after that belongs to
 * "today's" Swedish matchday.
 */
export function getMatchDayDate(date: Date = new Date()): string {
  const shifted = new Date(date.getTime() + 10 * 60 * 60 * 1000)
  return shifted.toISOString().slice(0, 10)
}
