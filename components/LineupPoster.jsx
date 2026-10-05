'use client'
import Link from 'next/link'
import { useState } from 'react'

// The line-up as a poster: one block per day, names sized by billing.
// The stage filter fades out the other stages; without JavaScript every
// act is shown.
export default function LineupPoster({ days, stages, acts }) {
  const [stage, setStage] = useState('all')
  return (
    <>
      <div className="filters" role="group" aria-label="Show acts on">
        {[{ key: 'all', name: 'All stages' }, ...stages].map((s) => (
          <button
            key={s.key}
            type="button"
            className={`chip${stage === s.key ? ' on' : ''}`}
            aria-pressed={stage === s.key}
            style={s.colour ? { '--stage': s.colour } : undefined}
            onClick={() => setStage(s.key)}
          >
            {s.name}
          </button>
        ))}
      </div>
      {days.map((day) => (
        <section key={day.key} className="poster-day" aria-labelledby={`day-${day.key}`}>
          <h2 id={`day-${day.key}`} className="poster-day-name">
            {day.name} <span>{day.dayMonth}</span>
          </h2>
          <ul className="poster-acts">
            {acts
              .filter((a) => a.day === day.key)
              .sort((a, b) => a.billing - b.billing)
              .map((a) => (
                <li
                  key={a.slug}
                  className={`poster-act b${a.billing}${stage !== 'all' && a.stage !== stage ? ' faded' : ''}`}
                  style={{ '--stage': a.colour }}
                >
                  <Link href={`/line-up/${a.slug}/`}>{a.name}</Link>
                  <span className="poster-meta">
                    {a.stageName} {a.start}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  )
}
