import LineupPoster from '@/components/LineupPoster'
import { dayMonth, getActs, getFestival, getStages } from '@/lib/content'

export const metadata = {
  title: 'Line-up',
  description: 'Every act at Brakwater Festival, by day and stage.',
  alternates: { canonical: '/line-up/' },
}

export default function LineUp() {
  const festival = getFestival()
  const stages = getStages()
  const colour = Object.fromEntries(stages.map((s) => [s.key, s.colour]))
  const stageName = Object.fromEntries(stages.map((s) => [s.key, s.name]))
  const acts = getActs().map((a) => ({
    slug: a.slug,
    name: a.name,
    day: a.day,
    stage: a.stage,
    start: a.start,
    billing: a.billing,
    colour: colour[a.stage],
    stageName: stageName[a.stage],
  }))
  const days = festival.days.map((d) => ({ key: d.key, name: d.name, dayMonth: dayMonth(d.date) }))
  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">{festival.year} line-up</p>
        <h1>{acts.length} acts, three stages, one dyke</h1>
      </header>
      <LineupPoster days={days} stages={stages.map((s) => ({ key: s.key, name: s.name, colour: s.colour }))} acts={acts} />
    </div>
  )
}
