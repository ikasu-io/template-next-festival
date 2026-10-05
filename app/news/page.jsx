import Link from 'next/link'
import Photo from '@/components/Photo'
import { getNews, longDate } from '@/lib/content'

export const metadata = {
  title: 'News',
  description: 'News from Brakwater Festival: line-up, tickets, the site.',
  alternates: { canonical: '/news/' },
}

export default function News() {
  const news = getNews()
  return (
    <div className="wrap section">
      <header className="page-head">
        <p className="kicker">News</p>
        <h1>From the dyke</h1>
      </header>
      <div className="news-grid">
        {news.map((post, i) => (
          <Link key={post.slug} href={`/news/${post.slug}/`} className={`news-card${i === 0 ? ' first' : ''}`}>
            <Photo name={post.image} desktop={i === 0 ? '100vw' : '50vw'} eager={i === 0} />
            <span className="kicker">{longDate(post.date)}</span>
            <span className="news-title">{post.title}</span>
            <span className="muted">{post.description}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
