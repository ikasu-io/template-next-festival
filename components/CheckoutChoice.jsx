'use client'
import { useEffect, useState } from 'react'

// Shows which ticket was picked, read from the address (?ticket=weekend).
export default function CheckoutChoice({ tickets }) {
  const [ticket, setTicket] = useState(null)
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('ticket')
    setTicket(tickets.find((t) => t.key === key) ?? null)
  }, [tickets])
  if (!ticket) return null
  return (
    <p className="lead">
      You picked: <strong>{ticket.name}</strong>, €{ticket.price}.
    </p>
  )
}
