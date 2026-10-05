import Link from 'next/link'
import { notFound } from 'next/navigation'
import Cover from '@/components/Cover'
import PlanButton from '@/components/PlanButton'
import { getAct, getActs, getFestival, getStages } from '@/lib/content'

export const dynamicParams = false

export function generateStaticParams() {
  return getActs().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const act = getAct((await params).slug)
  if (!act) return {}
  return {
    title: act.name,
    description: `${act.name} (${act.genre}, ${act.origin}) at Brakwater Festival: ${act.dayInfo.name} ${act.start} on the ${act.stage} stage.`,
    alternates: { canonical: `/line-up/${act.slug}/` },
  }
}

export default async function ActPage({ params }) {
  const act = getAct((await params).slug)
  if (!act) notFound()
  const festival = getFestival()
  const stage = getStages().find((s) => s.key === act.stage)
  const sameDay = getActs().filter((a) => a.day === act.day && a.slug !== act.slug)
  const stageName = Object.fromEntries(getStages().map((s) => [s.key, s.name]))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `${act.name} at ${festival.name}`,
    startDate: `${act.dayInfo.date}T${act.start}`,
    location: { '@type': 'Place', name: `${stage.name} stage, ${festival.place.name}`, address: `${festival.place.street}, ${festival.place.town}` },
    performer: { '@type': 'MusicGroup', name: act.name, genre: act.genre },
    superEvent: { '@type': 'MusicEvent', name: `${festival.name} ${festival.year}`, url: festival.url },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  }

  return (
    <article className="wrap section act" style={{ '--stage': stage.colour }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="act-cover">
        <Cover act={act} grain />
      </div>
      <div className="act-text">
        <Link href="/line-up/" className="back">
          Line-up
        </Link>
        <p className="act-when">
          <span>{act.dayInfo.label}</span>
          <span>
            {act.start}–{act.end}
          </span>
          <span className="act-stage">{stage.name} stage</span>
        </p>
        <h1 className="act-name">{act.name}</h1>
        <p className="act-origin">
          {act.genre} · {act.origin}
        </p>
        <div className="act-body" dangerouslySetInnerHTML={{ __html: act.html }} />
        <PlanButton slug={act.slug} name={act.name} />

        <section className="same-day" aria-labelledby="same-day">
          <h2 id="same-day">Also on {act.dayInfo.name}</h2>
          <ul>
            {sameDay.map((a) => (
              <li key={a.slug}>
                <span className="same-time">{a.start}</span>
                <Link href={`/line-up/${a.slug}/`}>{a.name}</Link>
                <span className="muted">{stageName[a.stage]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
