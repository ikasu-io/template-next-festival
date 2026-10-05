# Brakwater Festival — a music festival website built with Next.js

> **Brakwater Festival is fictional.** The village of Oosterzand, the
> bands, the people and the photos are all made up. The site, its content
> and its images were generated with AI, and it is maintained with
> [Ikasu](https://ikasu.io), an AI content copilot for static sites.
> Use it as a starting point for your own festival, conference or event.

A website for an event that happens once a year: a line-up as a poster,
a page per act, a timetable where visitors star the acts they want to see
("my plan", kept in their browser), tickets with what's sold out, practical
info and news. Before the festival the home page counts down; afterwards
it says thank you.

- [Next.js](https://nextjs.org) 16 (App Router) as a static export, plain JavaScript and CSS
- Every act is one Markdown file; everything else is YAML in `content/`
- Cover art for every act drawn from its colours — no band photos needed
- Photos resized and converted to WebP before the build
- No cookies, no external fonts, maps or scripts; every page works without JavaScript except "my plan"
- Search-engine data for the festival, every act and every news post (schema.org), sitemap and `robots.txt`

## Getting started

Needs Node.js 20.9 or newer.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Where to change what

| To change … | Edit |
|---|---|
| An act: time, stage, day, text | its file in `content/acts/` |
| Add an act | a new file in `content/acts/` (copy one) |
| Move an act to another day or time | `day`, `start` and `end` in its file |
| Ticket prices, "sold out" | `content/tickets.yaml` (`status`: on-sale, few-left, sold-out) |
| Dates, gate times, place, email | `content/festival.yaml` |
| Where the ticket buttons go | `tickets_url` in `content/festival.yaml` (your ticket provider) |
| Stages | `content/stages.yaml` |
| Getting there, camping, food, FAQ | `content/info.yaml` |
| A news post, or add one | its file in `content/news/` |
| A photo | drop it into `content/images/` and describe it in `content/images.yaml` |
| Colours, fonts, spacing | `app/globals.css` (tokens at the top) |

The build checks every content file. A missing or wrong field — a time
written as "9.30pm", a stage that doesn't exist, a photo that isn't
there — stops it with the file and the field named. So do two acts on
the same stage at the same time, and an act outside the gate times.
Times after midnight (`01:30`) belong to the evening before.

The countdown on the home page is worked out when the site is built, so
rebuild it now and then (Ikasu does this after every edit).

## Deploying

`npm run build` writes a static site to `out/`. Any static host works:
Netlify, Cloudflare Pages, GitHub Pages, your own server. Set `url` in
`content/festival.yaml` to your domain.

## Licence

MIT, see [LICENSE](LICENSE). Images: see [IMAGES.md](IMAGES.md).
