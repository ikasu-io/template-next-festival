import { getImages } from '@/lib/content'

// A photo from content/images/, by name, in the WebP sizes made by
// scripts/images.mjs. `desktop` is how wide it shows on screens wider than
// 860 px; on smaller screens photos are full width. `sizes` replaces both
// when a photo is cropped to fill a box (the home page hero).
const widths = [480, 800, 1200, 1600]

export default function Photo({ name, desktop = '100vw', sizes, eager = false, className }) {
  const { alt } = getImages()
  return (
    <img
      className={className}
      src={`/img/${name}-1200.webp`}
      srcSet={widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes ?? `(max-width: 860px) 100vw, ${desktop}`}
      alt={alt[name] ?? ''}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  )
}
