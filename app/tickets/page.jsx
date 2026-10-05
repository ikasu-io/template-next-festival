import { getFestival, getTickets } from '@/lib/content'

export const metadata = {
  title: 'Tickets',
  description: 'Weekend, day and camping tickets for Kweldertij Festival. Children under 12 free.',
  alternates: { canonical: '/tickets/' },
}

const label = { 'on-sale': 'On sale', 'few-left': 'Few left', 'sold-out': 'Sold out' }

export default function Tickets() {
  const festival = getFestival()
  const tickets = getTickets()
  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">Tickets {festival.year}</p>
        <h1>Pick your days</h1>
        <p className="lead">Prices include the shuttle bus from Vlietsluis station and free water refills. Children under 12 come in free with an adult.</p>
      </header>
      <ul className="tickets">
        {tickets.map((t) => (
          <li key={t.key} className={`ticket ${t.status}`}>
            <div className="ticket-main">
              <h2>{t.name}</h2>
              <p className="ticket-when">{t.days}</p>
              <p className="muted">{t.includes}</p>
            </div>
            <div className="ticket-buy">
              <span className={`badge ${t.status}`}>{label[t.status]}</span>
              <span className="ticket-price">€{t.price}</span>
              {t.status === 'sold-out' ? (
                <span className="button disabled" aria-disabled="true">
                  Sold out
                </span>
              ) : (
                <a className="button" href={`${festival.tickets_url}?ticket=${t.key}`}>
                  Buy<span className="visually-hidden"> {t.name} ticket</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="ticket-notes">
        <p>
          <strong>Tickets are personal.</strong> If you can't come, sell yours at the price you paid through the ticket shop's resale page;
          the buyer gets a new ticket in their own name.
        </p>
        <p>
          <strong>Need a companion?</strong> Their ticket is free. Write to <a href={`mailto:${festival.email}`}>{festival.email}</a> before you buy.
        </p>
      </div>
    </div>
  )
}
