import Timetable from '@/components/Timetable'
import { dayMonth, getActs, getFestival, getStages } from '@/lib/content'

export const metadata = {
  title: 'Timetable',
  description: 'Who plays when and where at Brakwater Festival. Star the acts you want to see to make your own plan.',
  alternates: { canonical: '/timetable/' },
}

export default function TimetablePage() {
  const festival = getFestival()
  const days = festival.days.map((d) => ({ key: d.key, date: d.date, name: d.name, short: d.short, dayMonth: dayMonth(d.date) }))
  const stages = getStages().map((s) => ({ key: s.key, name: s.name, colour: s.colour }))
  const acts = getActs().map((a) => ({ slug: a.slug, name: a.name, day: a.day, stage: a.stage, start: a.start, end: a.end }))
  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Timetable</p>
        <h1>Who plays when</h1>
        <p className="lead">
          Tap the star next to an act to put it in your plan. Your plan stays on this phone or computer; nobody else sees it.
        </p>
      </header>
      <Timetable days={days} stages={stages} acts={acts} />
    </div>
  )
}
