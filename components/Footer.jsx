import Link from 'next/link'
import { getFestival } from '@/lib/content'

export default function Footer() {
  const festival = getFestival()
  const first = festival.days[0]
  const last = festival.days.at(-1)
  return (
    <footer className="footer">
      <p className="footer-dates" aria-hidden="true">
        {first.date.slice(8)}—{last.date.slice(8)}.{first.date.slice(5, 7)}.{String(festival.year).slice(2)}
      </p>
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">{festival.name}</p>
          <p>
            {festival.days[0].label} – {festival.days.at(-1).label} {festival.year}
            <br />
            {festival.place.street}, {festival.place.town}
          </p>
        </div>
        <div>
          <p className="footer-head">Plan your weekend</p>
          <ul>
            <li><Link href="/line-up/">Line-up</Link></li>
            <li><Link href="/timetable/">Timetable</Link></li>
            <li><Link href="/tickets/">Tickets</Link></li>
            <li><Link href="/info/">Getting there</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-head">Questions?</p>
          <p>
            <a href={`mailto:${festival.email}`}>{festival.email}</a>
          </p>
          <p className="muted">
            {festival.name} is organised by {festival.organiser}, run by volunteers since {festival.founded}.
          </p>
        </div>
      </div>
      <p className="wrap footer-fine">
        <strong>Fictional demo site — content and images generated with AI.</strong>
      </p>
    </footer>
  )
}
