import Link from 'next/link'

export const metadata = { title: 'Page not found', robots: { index: false } }

export default function NotFound() {
  return (
    <div className="wrap section narrow lost">
      <p className="kicker">Error 404</p>
      <h1>Wrong stage.</h1>
      <p className="lead">The page you were looking for isn't here. The music is this way.</p>
      <div className="buttons">
        <Link className="button" href="/line-up/">
          Line-up
        </Link>
        <Link className="button ghost" href="/">
          Home
        </Link>
      </div>
    </div>
  )
}
