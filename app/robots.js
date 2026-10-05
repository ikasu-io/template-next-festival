import { getFestival } from '@/lib/content'

export const dynamic = 'force-static'

export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${getFestival().url}/sitemap.xml` }
}
