'use client'
import { usePlan } from './plan'

export default function PlanButton({ slug, name, compact = false }) {
  const { plan, toggle } = usePlan()
  const on = plan.has(slug)
  return (
    <button
      type="button"
      className={`plan-button${on ? ' on' : ''}${compact ? ' compact' : ''}`}
      aria-pressed={on}
      aria-label={compact ? `${on ? 'Remove' : 'Add'} ${name} ${on ? 'from' : 'to'} my plan` : undefined}
      onClick={() => toggle(slug)}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z" />
      </svg>
      {!compact && <span>{on ? 'In my plan' : 'Add to my plan'}</span>}
    </button>
  )
}
