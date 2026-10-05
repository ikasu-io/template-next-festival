'use client'
// "My plan": the acts a visitor has starred, kept in their browser only.
import { useSyncExternalStore } from 'react'

const KEY = 'kweldertij-plan'
const listeners = new Set()

function read() {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

function subscribe(listener) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export function usePlan() {
  const raw = useSyncExternalStore(subscribe, read, () => '')
  const plan = new Set(raw ? raw.split(',') : [])
  const toggle = (slug) => {
    plan.has(slug) ? plan.delete(slug) : plan.add(slug)
    try {
      localStorage.setItem(KEY, [...plan].join(','))
    } catch {
      // Storage blocked (private mode): the star just doesn't stick.
    }
    listeners.forEach((l) => l())
  }
  return { plan, toggle }
}
