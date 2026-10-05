import { coverSvg } from '@/lib/cover'

// An act's cover art (see lib/cover.js). Decorative: the act's name is
// always written next to it.
export default function Cover({ act, grain = false, className = '' }) {
  return <div className={`cover ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: coverSvg(act, { grain }) }} />
}
