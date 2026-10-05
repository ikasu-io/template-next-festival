import Photo from '@/components/Photo'
import { getFestival, getInfo } from '@/lib/content'

export const metadata = {
  title: 'Info',
  description: 'Getting to Kweldertij Festival, camping, food, accessibility, children, and what happens when it rains.',
  alternates: { canonical: '/info/' },
}

const photos = { 'getting-there': 'shuttle-bikes', camping: 'campsite', food: 'food-trucks', rain: 'rain-ponchos' }

export default function Info() {
  const festival = getFestival()
  const { sections, faq } = getInfo()
  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Info</p>
        <h1>Everything you need to know</h1>
      </header>
      <div className="info">
        <nav className="info-nav" aria-label="On this page">
          <ul>
            {sections.map((s) => (
              <li key={s.key}>
                <a href={`#${s.key}`}>{s.title}</a>
              </li>
            ))}
            <li>
              <a href="#questions">Questions</a>
            </li>
          </ul>
        </nav>
        <div className="info-body">
          {sections.map((s) => (
            <section key={s.key} id={s.key} className="info-section">
              <h2>{s.title}</h2>
              {photos[s.key] && <Photo name={photos[s.key]} desktop="50vw" className="info-photo" />}
              <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}
          <section id="questions" className="info-section">
            <h2>Questions</h2>
            {faq.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <div className="prose" dangerouslySetInnerHTML={{ __html: f.html }} />
              </details>
            ))}
            <p className="muted">
              Anything else? Write to <a href={`mailto:${festival.email}`}>{festival.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
