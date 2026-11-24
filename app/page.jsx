import Link from 'next/link'
import Cover from '@/components/Cover'
import Photo from '@/components/Photo'
import { festivalStatus, getActs, getFestival, getNews, getStages, getTickets, longDate } from '@/lib/content'

export default function Home() {
  const festival = getFestival()
  const status = festivalStatus()
  const acts = getActs()
  const stages = getStages()
  const tickets = getTickets()
  const news = getNews().slice(0, 2)
  const headliners = acts.filter((a) => a.billing === 1)
  const others = acts.filter((a) => a.billing !== 1)
  const stageName = Object.fromEntries(stages.map((s) => [s.key, s.name]))
  const stagePhotos = { dijk: 'crowd-hands', kas: 'greenhouse-tent', strand: 'beach-stage' }
  const first = festival.days[0]
  const last = festival.days.at(-1)

  // Search-engine data: the festival as one event with an event per act.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `${festival.name} ${festival.year}`,
    description: festival.tagline,
    startDate: `${first.date}T${first.gates}`,
    endDate: `${last.date}T${last.close}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: festival.place.name,
      address: { '@type': 'PostalAddress', streetAddress: festival.place.street, addressLocality: festival.place.town, addressCountry: festival.place.country },
    },
    image: [`${festival.url}/og.jpg`],
    organizer: { '@type': 'Organization', name: festival.organiser, url: festival.url },
    offers: tickets.map((t) => ({
      '@type': 'Offer',
      name: t.name,
      price: t.price,
      priceCurrency: 'EUR',
      availability: t.status === 'sold-out' ? 'https://schema.org/SoldOut' : t.status === 'few-left' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock',
      url: `${festival.url}/tickets/`,
    })),
    performer: acts.map((a) => ({ '@type': 'MusicGroup', name: a.name })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero">
        {/* The hero fills the screen height, so on tall screens the photo is wider than the screen. */}
        <Photo name="hero-dyke" sizes="(max-aspect-ratio: 16/9) 170vh, 100vw" eager className="hero-photo" />
        <div className="wrap hero-text">
          <p className="hero-status">{status.text}</p>
          <h1 className="hero-title">
            <span className="visually-hidden">{festival.name}</span>
            <span aria-hidden="true">Kweldertij</span>
          </h1>
          <div className="hero-row">
            <p className="hero-dates">
              {Number(first.date.slice(8))}—{longDate(last.date)}
            </p>
            <p className="hero-tagline">{festival.tagline}</p>
            <div className="buttons">
              <Link className="button" href="/tickets/">
                Tickets
              </Link>
              <Link className="button ghost" href="/line-up/">
                See the line-up
              </Link>
            </div>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>Where</dt>
              <dd>{festival.place.town}, on the Dutch coast</dd>
            </div>
            <div>
              <dt>Line-up</dt>
              <dd>
                {acts.length} acts on {stages.length} stages
              </dd>
            </div>
            <div>
              <dt>Since</dt>
              <dd>{festival.founded}, run by volunteers</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Every act's name running across the page; the names are all listed below too. */}
      <div className="ticker-clip" aria-hidden="true">
        <div className="ticker">
          {[0, 1].map((copy) => (
            <ul key={copy} className="ticker-track">
              {acts.map((act) => (
                <li key={act.slug}>
                  {act.name}
                  <span className="ticker-star">✺</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section className="wrap section" aria-labelledby="headliners">
        <div className="section-head">
          <h2 id="headliners">Headliners</h2>
          <Link className="more" href="/line-up/">
            Full line-up
          </Link>
        </div>
        <ol className="headliners">
          {headliners.map((act, i) => (
            <li key={act.slug}>
              <Link href={`/line-up/${act.slug}/`} className="headliner">
                <span className="headliner-cover">
                  <Cover act={act} grain />
                  <span className="headliner-num">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="headliner-day">
                  {act.dayInfo.name} · {stageName[act.stage]} · {act.start}
                </span>
                <span className="headliner-name">{act.name}</span>
                <span className="muted">
                  {act.genre}, {act.origin}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="also">
          <span className="also-label">And</span>
          {others.map((act, i) => (
            <span key={act.slug}>
              <Link href={`/line-up/${act.slug}/`}>{act.name}</Link>
              {i < others.length - 1 ? <span className="sep"> / </span> : null}
            </span>
          ))}
        </p>
      </section>

      <section className="stages slant" aria-labelledby="stages">
        <div className="wrap section">
          <div className="section-head">
            <h2 id="stages">Three stages</h2>
            <Link className="more" href="/timetable/">
              Timetable
            </Link>
          </div>
          <div className="stage-list">
            {stages.map((stage, i) => (
              <article key={stage.key} className="stage" style={{ '--stage': stage.colour }}>
                <p className="stage-num">Stage {String(i + 1).padStart(2, '0')}</p>
                <div className="stage-frame">
                  <Photo name={stagePhotos[stage.key] ?? 'hero-dyke'} desktop="33vw" className="stage-photo" />
                </div>
                <h3>{stage.name}</h3>
                <p>{stage.about}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="tickets">
        <div className="section-head">
          <h2 id="tickets">Tickets</h2>
          <Link className="more" href="/tickets/">
            All tickets
          </Link>
        </div>
        <ul className="ticket-stubs">
          {tickets.map((t) => (
            <li key={t.key} className={`stub ${t.status}`}>
              <div className="stub-top">
                <span className={`badge ${t.status}`}>
                  {t.status === 'on-sale' ? 'On sale' : t.status === 'few-left' ? 'Few left' : 'Sold out'}
                </span>
                <h3 className="stub-name">{t.name}</h3>
                <p className="stub-days">{t.days}</p>
              </div>
              <div className="stub-bottom">
                <span className="stub-price">€{t.price}</span>
                {t.status === 'sold-out' ? (
                  <span className="stub-cta muted">Gone</span>
                ) : (
                  <Link className="stub-cta" href="/tickets/">
                    Buy<span className="visually-hidden"> {t.name} ticket</span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="muted">Children under 12 come in free with an adult.</p>
      </section>

      <section className="wrap section" aria-labelledby="news">
        <div className="section-head">
          <h2 id="news">News</h2>
          <Link className="more" href="/news/">
            All news
          </Link>
        </div>
        <div className="news-grid">
          {news.map((post) => (
            <Link key={post.slug} href={`/news/${post.slug}/`} className="news-card">
              <Photo name={post.image} desktop="50vw" />
              <span className="kicker">{longDate(post.date)}</span>
              <span className="news-title">{post.title}</span>
              <span className="muted">{post.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
