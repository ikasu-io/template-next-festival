import Link from 'next/link'
import CheckoutChoice from '@/components/CheckoutChoice'
import { getFestival, getTickets } from '@/lib/content'

export const metadata = { title: 'Checkout', robots: { index: false } }

// Stand-in for the ticket provider's shop. A real festival sets
// tickets_url in content/festival.yaml to its ticket provider instead.
export default function Checkout() {
  const festival = getFestival()
  const tickets = getTickets().map((t) => ({ key: t.key, name: t.name, price: t.price }))
  return (
    <div className="wrap section narrow">
      <p className="kicker">Checkout</p>
      <h1>This is where the ticket shop would open</h1>
      <CheckoutChoice tickets={tickets} />
      <p>
        {festival.name} is fictional, so nothing is sold here. A real festival using this template sets <code>tickets_url</code> in{' '}
        <code>content/festival.yaml</code> to its ticket provider, such as Eventbrite, Ticketmaster, Paylogic or Weeztix. The ticket
        type is passed along in the address.
      </p>
      <Link className="button" href="/tickets/">
        Back to tickets
      </Link>
    </div>
  )
}
