import { NextResponse } from 'next/server'

export const revalidate = 300

interface OFMatch {
  round: string
  date: string
  time: string
  team1: string
  team2: string
  score?: { ft: [number, number] }
  group?: string
  ground: string
}

function toUtcDate(date: string, time: string): Date {
  // time format: "13:00 UTC-6" or "20:00 UTC+2"
  const [hhmm, offsetStr] = time.split(' ')
  const [hh, mm] = hhmm.split(':').map(Number)
  const offsetMatch = offsetStr?.match(/UTC([+-]\d+)/)
  const offset = offsetMatch ? parseInt(offsetMatch[1]) : 0
  const utcMs = Date.UTC(
    parseInt(date.slice(0, 4)),
    parseInt(date.slice(5, 7)) - 1,
    parseInt(date.slice(8, 10)),
    hh - offset,
    mm
  )
  return new Date(utcMs)
}

export async function GET() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json',
      { next: { revalidate: 300 } }
    )
    const data = await res.json()
    const matches: OFMatch[] = data.matches

    const withDates = matches.map(m => ({
      ...m,
      utcDate: toUtcDate(m.date, m.time),
    }))

    const now = new Date()

    const finished = withDates
      .filter(m => m.score)
      .sort((a, b) => b.utcDate.getTime() - a.utcDate.getTime())
      .slice(0, 5)
      .map(({ utcDate, ...m }) => ({ ...m, utcTime: utcDate.toISOString() }))

    const upcoming = withDates
      .filter(m => !m.score && m.utcDate > now)
      .sort((a, b) => a.utcDate.getTime() - b.utcDate.getTime())
      .slice(0, 5)
      .map(({ utcDate, ...m }) => ({ ...m, utcTime: utcDate.toISOString() }))

    return NextResponse.json({ finished, upcoming })
  } catch {
    return NextResponse.json({ finished: [], upcoming: [] })
  }
}
