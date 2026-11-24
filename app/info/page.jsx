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
          {sections.map((s, i) => (
            <section key={s.key} id={s.key} className={`info-section${photos[s.key] ? ' with-photo' : ''}`}>
              <div className="info-text">
                <p className="info-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2>{s.title}</h2>
                <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
              </div>
              {photos[s.key] && <Photo name={photos[s.key]} desktop="30vw" className="info-photo" />}
            </section>
          ))}
          <section id="questions" className="info-section">
            <p className="info-num" aria-hidden="true">
              {String(sections.length + 1).padStart(2, '0')}
            </p>
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
