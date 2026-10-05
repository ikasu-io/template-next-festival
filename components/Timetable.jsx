'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PlanButton from './PlanButton'
import { usePlan } from './plan'

// The timetable: one grid per day, stages as columns, 15 minutes per row.
// Times after midnight belong to the evening before. Stars add an act to
// "my plan"; "Only my plan" fades the rest; during the festival a line
// shows the time now. Without JavaScript the grids are all there.
const SLOT = 15
const mins = (t) => {
  const [h, m] = t.split(':').map(Number)
  return (h < 6 ? h + 24 : h) * 60 + m
}
const clock = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

function useNow(days) {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const tick = () => {
      const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
          .formatToParts(new Date())
          .map((p) => [p.type, p.value]),
      )
      const date = `${parts.year}-${parts.month}-${parts.day}`
      const minute = Number(parts.hour) * 60 + Number(parts.minute)
      // Before 06:00 it is still the night before.
      const prev = new Date(`${date}T12:00:00Z`)
      prev.setUTCDate(prev.getUTCDate() - 1)
      const night = minute < 360 ? days.find((d) => d.date === prev.toISOString().slice(0, 10)) : null
      const day = night ?? days.find((d) => d.date === date)
      setNow(day ? { day: day.key, minute: night ? minute + 1440 : minute } : null)
    }
    tick()
    const timer = setInterval(tick, 60000)
    return () => clearInterval(timer)
  }, [days])
  return now
}

export default function Timetable({ days, stages, acts }) {
  const { plan } = usePlan()
  const [onlyPlan, setOnlyPlan] = useState(false)
  const now = useNow(days)

  return (
    <div className={`timetable${onlyPlan ? ' only-plan' : ''}`}>
      <div className="timetable-bar">
        <nav className="day-links" aria-label="Days">
          {days.map((d) => (
            <a key={d.key} href={`#${d.key}`}>
              {d.short}
            </a>
          ))}
        </nav>
        <label className="only-plan-toggle">
          <input type="checkbox" checked={onlyPlan} onChange={(e) => setOnlyPlan(e.target.checked)} />
          Only my plan {plan.size ? `(${plan.size})` : ''}
        </label>
      </div>

      {days.map((day) => {
        const dayActs = acts.filter((a) => a.day === day.key)
        const from = Math.floor(Math.min(...dayActs.map((a) => mins(a.start))) / 60) * 60
        const to = Math.ceil(Math.max(...dayActs.map((a) => mins(a.end))) / 60) * 60
        const rows = (to - from) / SLOT
        const row = (m) => (m - from) / SLOT + 2
        return (
          <section key={day.key} id={day.key} className="tt-day" aria-labelledby={`tt-${day.key}`}>
            <h2 id={`tt-${day.key}`} className="tt-day-name">
              {day.name} <span>{day.dayMonth}</span>
            </h2>
            <div className="tt-scroll">
              <div
                className="tt-grid"
                style={{ '--stages': stages.length, gridTemplateRows: `auto repeat(${rows}, var(--slot))` }}
              >
                {stages.map((s, i) => (
                  <div key={s.key} className="tt-stage" style={{ gridColumn: i + 2, '--stage': s.colour }}>
                    {s.name}
                  </div>
                ))}
                {Array.from({ length: (to - from) / 60 }, (_, h) => (
                  <div key={h} className="tt-hour" style={{ gridRow: `${row(from + h * 60)} / span 4` }}>
                    {clock(from + h * 60)}
                  </div>
                ))}
                {dayActs.map((a) => {
                  const col = stages.findIndex((s) => s.key === a.stage) + 2
                  return (
                    <div
                      key={a.slug}
                      className={`tt-act${plan.has(a.slug) ? ' in-plan' : ''}`}
                      style={{ gridColumn: col, gridRow: `${row(mins(a.start))} / ${row(mins(a.end))}`, '--stage': stages[col - 2].colour }}
                    >
                      <Link href={`/line-up/${a.slug}/`} className="tt-name">
                        {a.name}
                      </Link>
                      <span className="tt-time">
                        {a.start}–{a.end}
                      </span>
                      <PlanButton slug={a.slug} name={a.name} compact />
                    </div>
                  )
                })}
                {now?.day === day.key && now.minute >= from && now.minute <= to && (
                  <div
                    className="tt-now"
                    style={{ gridRow: Math.floor(row(now.minute)), gridColumn: `1 / -1`, '--offset': `${(((now.minute - from) % SLOT) / SLOT) * 100}%` }}
                  >
                    <span>Now {clock(now.minute)}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
