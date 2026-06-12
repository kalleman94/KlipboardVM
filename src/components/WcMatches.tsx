'use client'
import { useEffect, useState } from 'react'

interface WcMatch {
  team1: string
  team2: string
  score?: { ft: [number, number] }
  group?: string
  round: string
  utcTime: string
}

interface WcData {
  finished: WcMatch[]
  upcoming: WcMatch[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', {
    weekday: 'short', month: 'short', day: 'numeric',
    timeZone: 'Europe/Stockholm',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sv-SE', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Stockholm',
  })
}

export default function WcMatches() {
  const [data, setData] = useState<WcData | null>(null)

  useEffect(() => {
    fetch('/api/wc-matches')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data) return null

  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
        ⚽ VM 2026 – Matcher
      </h2>
      <div className="grid md:grid-cols-2 gap-6">

        {/* Senaste resultat */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Senaste resultat
          </h3>
          <div className="space-y-2">
            {data.finished.length === 0 && (
              <p className="text-gray-400 text-sm">Inga matcher spelade ännu.</p>
            )}
            {data.finished.map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <div className="flex-1 text-right font-medium truncate">{m.team1}</div>
                <div className="mx-3 font-bold text-base tabular-nums" style={{ color: 'var(--color-primary)', minWidth: 48, textAlign: 'center' }}>
                  {m.score!.ft[0]} – {m.score!.ft[1]}
                </div>
                <div className="flex-1 font-medium truncate">{m.team2}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Kommande matcher */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Kommande matcher
          </h3>
          <div className="space-y-2">
            {data.upcoming.length === 0 && (
              <p className="text-gray-400 text-sm">Inga fler matcher planerade.</p>
            )}
            {data.upcoming.map((m, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <div className="flex-1 text-right font-medium truncate">{m.team1}</div>
                <div className="mx-3 text-center text-gray-500 tabular-nums" style={{ minWidth: 80 }}>
                  <div className="text-xs">{formatDate(m.utcTime)}</div>
                  <div className="font-semibold">{formatTime(m.utcTime)}</div>
                </div>
                <div className="flex-1 font-medium truncate">{m.team2}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
