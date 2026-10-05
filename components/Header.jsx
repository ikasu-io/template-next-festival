import Link from 'next/link'
import { getFestival } from '@/lib/content'

const links = [
  { href: '/line-up/', label: 'Line-up' },
  { href: '/timetable/', label: 'Timetable' },
  { href: '/info/', label: 'Info' },
  { href: '/news/', label: 'News' },
]

export default function Header() {
  const festival = getFestival()
  const first = festival.days[0]
  const last = festival.days.at(-1)
  return (
    <header className="header">
      <div className="wrap header-bar">
        <Link href="/" className="logo" aria-label={`${festival.name}, home`}>
          <span className="logo-name">Brakwater</span>
          <span className="logo-date">
            {Number(first.date.slice(8))}–{Number(last.date.slice(8))}.{first.date.slice(5, 7)}.{String(festival.year).slice(2)}
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/tickets/" className="button header-tickets">
          Tickets
        </Link>
        <button className="menu-button" popoverTarget="menu" aria-label="Menu">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
          </svg>
        </button>
        <div id="menu" popover="auto" className="menu">
          <button className="menu-close" popoverTarget="menu" popoverTargetAction="hide" aria-label="Close menu">
            ×
          </button>
          <nav aria-label="Main, mobile">
            {[...links, { href: '/tickets/', label: 'Tickets' }].map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
