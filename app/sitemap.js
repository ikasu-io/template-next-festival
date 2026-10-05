import { getActs, getFestival, getNews } from '@/lib/content'

export const dynamic = 'force-static'

// /sitemap.xml: every page, act and news post.
export default function sitemap() {
  const { url } = getFestival()
  const pages = ['/', '/line-up/', '/timetable/', '/tickets/', '/info/', '/news/']
  return [
    ...pages.map((p) => ({ url: `${url}${p}` })),
    ...getActs().map((a) => ({ url: `${url}/line-up/${a.slug}/` })),
    ...getNews().map((p) => ({ url: `${url}/news/${p.slug}/`, lastModified: p.date })),
  ]
}
