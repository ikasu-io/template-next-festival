// Reads everything in content/ and checks it. A file with a missing or
// wrong field, two acts on the same stage at the same time, or an act
// outside the gate times stops `npm run build` with the file and the
// field named, so a bad edit never goes live half-broken.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import YAML from 'yaml'
import { z } from 'zod'

const root = path.join(process.cwd(), 'content')

// ---------------------------------------------------------------- schemas

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date like 2027-07-09')
const time = z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'must be a time like 21:30 (in quotes)')
const colour = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a colour like #FF6B57')
const key = z.string().regex(/^[a-z0-9-]+$/, 'must be lower case letters, digits and dashes')

const schemas = {
  festival: z.object({
    name: z.string(),
    tagline: z.string(),
    url: z.url(),
    email: z.email(),
    organiser: z.string(),
    founded: z.number().int(),
    visitors_per_day: z.number().int(),
    place: z.object({ name: z.string(), street: z.string(), town: z.string(), country: z.string().length(2) }),
    tickets_url: z.string(),
    days: z.array(z.object({ key, date: day, gates: time, close: time })).min(1),
  }),
  stages: z.array(z.object({ key, name: z.string(), about: z.string(), colour })).min(1),
  tickets: z.array(
    z.object({
      key,
      name: z.string(),
      days: z.string(),
      price: z.number().min(0),
      status: z.enum(['on-sale', 'few-left', 'sold-out']),
      includes: z.string(),
    }),
  ),
  info: z.object({
    sections: z.array(z.object({ key, title: z.string(), text: z.string() })),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
  }),
  images: z.record(z.string(), z.string()),
  act: z.object({
    name: z.string(),
    origin: z.string(),
    genre: z.string(),
    day: key,
    stage: key,
    start: time,
    end: time,
    billing: z.union([z.literal(1), z.literal(2), z.literal(3)], { error: 'must be 1 (headliner), 2 or 3' }),
    colours: z.tuple([colour, colour], { error: 'must be two colours, like ["#FF6B57", "#2A2150"]' }),
  }),
  news: z.object({ title: z.string(), date: day, description: z.string(), image: key }),
}

// ---------------------------------------------------------------- helpers

export class ContentError extends Error {
  constructor(file, problems) {
    super(`\n\nThe build stopped because a content file is wrong:\ncontent/${file}\n  ${problems.join('\n  ')}\n`)
    this.name = 'ContentError'
  }
}

function check(schema, data, file) {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ContentError(
      file,
      result.error.issues.map((i) => `${i.path.join('.') || '(file)'}: ${i.message}`),
    )
  }
  return result.data
}

// YAML 1.2: dates and times stay text, so 2027-07-09 is not turned into a
// Date and 21:30 is not turned into a number.
const yaml = (text) => YAML.parse(text)
const readYaml = (file) => yaml(fs.readFileSync(path.join(root, file), 'utf8'))
const readMarkdown = (file) => matter(fs.readFileSync(path.join(root, file), 'utf8'), { engines: { yaml } })
const markdown = (text) => marked.parse(text.trim())
const once = (fn) => {
  let value
  return () => (value ??= fn())
}

// Times after midnight belong to the evening before: 01:30 on Friday's
// timetable is Saturday night, 25:30 in minutes from Friday 00:00.
export const minutes = (t) => {
  const [h, m] = t.split(':').map(Number)
  return (h < 6 ? h + 24 : h) * 60 + m
}

const weekday = (date, style = 'long') =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: style, timeZone: 'UTC' })
export const dayMonth = (date) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })
export const longDate = (date) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

// ---------------------------------------------------------------- loaders

export const getImages = once(() => {
  const alt = check(schemas.images, readYaml('images.yaml'), 'images.yaml')
  const files = fs.readdirSync(path.join(root, 'images')).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  const names = files.map((f) => path.parse(f).name)
  const missing = names.filter((n) => !alt[n])
  if (missing.length) {
    throw new ContentError('images.yaml', missing.map((n) => `${n}: the photo content/images/${n} has no description`))
  }
  return { names: new Set(names), alt }
})

export const getFestival = once(() => {
  const festival = check(schemas.festival, readYaml('festival.yaml'), 'festival.yaml')
  festival.days = festival.days.map((d, index) => ({
    ...d,
    index,
    name: weekday(d.date),
    short: weekday(d.date, 'short'),
    label: `${weekday(d.date)} ${dayMonth(d.date)}`,
  }))
  festival.start = festival.days[0].date
  festival.end = festival.days.at(-1).date
  festival.year = Number(festival.start.slice(0, 4))
  return festival
})

export const getStages = once(() => check(schemas.stages, readYaml('stages.yaml'), 'stages.yaml'))
export const getTickets = once(() => check(schemas.tickets, readYaml('tickets.yaml'), 'tickets.yaml'))

export const getInfo = once(() => {
  const info = check(schemas.info, readYaml('info.yaml'), 'info.yaml')
  return {
    sections: info.sections.map((s) => ({ ...s, html: markdown(s.text) })),
    faq: info.faq.map((f) => ({ ...f, html: markdown(f.a) })),
  }
})

export const getActs = once(() => {
  const festival = getFestival()
  const stages = getStages()
  const days = new Map(festival.days.map((d) => [d.key, d]))
  const stageKeys = new Map(stages.map((s, i) => [s.key, i]))

  const acts = fs
    .readdirSync(path.join(root, 'acts'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const file = `acts/${f}`
      const { data, content } = readMarkdown(file)
      const act = check(schemas.act, data, file)
      const day = days.get(act.day)
      const problems = []
      if (!day) problems.push(`day: "${act.day}" is not a festival day (${[...days.keys()].join(', ')})`)
      if (!stageKeys.has(act.stage)) problems.push(`stage: "${act.stage}" is not a stage (${[...stageKeys.keys()].join(', ')})`)
      if (minutes(act.end) <= minutes(act.start)) problems.push(`end: ${act.end} is not after start ${act.start}`)
      if (day && minutes(act.start) < minutes(day.gates)) problems.push(`start: ${act.start} is before the gates open (${day.gates})`)
      if (day && minutes(act.end) > minutes(day.close)) problems.push(`end: ${act.end} is after the festival closes (${day.close})`)
      if (!content.trim()) problems.push('the text below the --- lines is empty')
      if (problems.length) throw new ContentError(file, problems)
      return { ...act, slug: path.parse(f).name, file, html: markdown(content), dayInfo: day }
    })
    .sort(
      (a, b) =>
        a.dayInfo.index - b.dayInfo.index ||
        minutes(a.start) - minutes(b.start) ||
        stageKeys.get(a.stage) - stageKeys.get(b.stage),
    )

  // Two acts on the same stage cannot overlap.
  for (const a of acts) {
    for (const b of acts) {
      if (a === b || a.day !== b.day || a.stage !== b.stage || a.file > b.file) continue
      if (minutes(a.start) < minutes(b.end) && minutes(b.start) < minutes(a.end)) {
        throw new ContentError(a.file, [
          `start/end: ${a.start}–${a.end} on the ${a.stage} stage clashes with ${b.name} (${b.start}–${b.end}, content/${b.file})`,
        ])
      }
    }
  }
  return acts
})

export const getAct = (slug) => getActs().find((a) => a.slug === slug)

export const getNews = once(() => {
  const { names } = getImages()
  return fs
    .readdirSync(path.join(root, 'news'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const file = `news/${f}`
      const { data, content } = readMarkdown(file)
      const post = check(schemas.news, data, file)
      if (!names.has(post.image)) throw new ContentError(file, [`image: no photo named "${post.image}" in content/images/`])
      return { ...post, slug: path.parse(f).name, html: markdown(content) }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
})

export const getPost = (slug) => getNews().find((p) => p.slug === slug)

// ---------------------------------------------------------------- the day

// The day the site was built, in the festival's time zone. The status line
// ("In 277 days" / "Today: day 2" / "See you in 2028") is worked out from
// it; Ikasu rebuilds the site after every edit.
export const buildDay = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam' })

export function festivalStatus() {
  const festival = getFestival()
  const today = buildDay()
  const between = (a, b) => Math.round((new Date(`${b}T12:00:00Z`) - new Date(`${a}T12:00:00Z`)) / 86400000)
  if (today < festival.start) {
    const days = between(today, festival.start)
    return { phase: 'before', text: days === 1 ? 'Tomorrow' : `In ${days} days` }
  }
  const current = festival.days.find((d) => d.date === today)
  if (current) return { phase: 'during', text: `Today: day ${current.index + 1}` }
  if (today > festival.end) return { phase: 'after', text: `That was ${festival.year}. See you in ${festival.year + 1}` }
  return { phase: 'during', text: 'Festival weekend' }
}
