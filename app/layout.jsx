import localFont from 'next/font/local'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getFestival } from '@/lib/content'
import './globals.css'

const display = localFont({
  src: './fonts/unbounded-latin-wght-normal.woff2',
  weight: '200 900',
  variable: '--font-display',
  display: 'swap',
})
const body = localFont({
  src: './fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-body',
  display: 'swap',
})

export function generateMetadata() {
  const festival = getFestival()
  return {
    metadataBase: new URL(festival.url),
    title: { default: `${festival.name} ${festival.year}`, template: `%s · ${festival.name} ${festival.year}` },
    description: `${festival.tagline} ${festival.days[0].label} – ${festival.days.at(-1).label} ${festival.year}, ${festival.place.town}.`,
    openGraph: { type: 'website', siteName: festival.name, images: ['/og.jpg'] },
    twitter: { card: 'summary_large_image' },
    icons: { icon: '/favicon.svg' },
  }
}

export const viewport = { themeColor: '#0F0D1C' }

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
