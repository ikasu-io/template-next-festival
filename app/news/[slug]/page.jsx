import Link from 'next/link'
import { notFound } from 'next/navigation'
import Photo from '@/components/Photo'
import { getFestival, getNews, getPost, longDate } from '@/lib/content'

export const dynamicParams = false

export function generateStaticParams() {
  return getNews().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const post = getPost((await params).slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/news/${post.slug}/` },
    openGraph: { type: 'article', images: [`/img/${post.image}-1200.webp`] },
  }
}

export default async function Post({ params }) {
  const post = getPost((await params).slug)
  if (!post) notFound()
  const festival = getFestival()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: `${festival.url}/img/${post.image}-1200.webp`,
    publisher: { '@type': 'Organization', name: festival.organiser, url: festival.url },
  }
  return (
    <article className="post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="wrap post-head">
        <Link href="/news/" className="back">
          News
        </Link>
        <p className="kicker">{longDate(post.date)}</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
      </header>
      <Photo name={post.image} eager className="post-photo" />
      <div className="wrap">
        <div className="prose post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </article>
  )
}
