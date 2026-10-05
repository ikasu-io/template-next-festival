// Cover art for an act, drawn from its two colours and its name, so no act
// needs a photo (and no faces of real-looking musicians are made up). The
// shape is picked from the act's name, so each act keeps its own cover.
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

const light = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5
}

const initial = (name) => name.replace(/^the\s+/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '')[0].toUpperCase()

export function coverSvg({ slug, name, colours }, { grain = false } = {}) {
  const [a, b] = colours
  const h = hash(slug)
  const id = `c-${slug}`
  const angle = (h % 4) * 45
  const ink = light(a) ? '#0F0D1C' : '#F3EADB'
  const shapes = [
    // a sun on the horizon
    `<circle cx="${130 + (h % 140)}" cy="210" r="${90 + (h % 40)}" fill="${b}" opacity=".9"/><rect y="230" width="400" height="170" fill="${a}" opacity=".55"/>`,
    // rings
    [0, 1, 2, 3, 4].map((i) => `<circle cx="300" cy="100" r="${40 + i * 48}" fill="none" stroke="${b}" stroke-width="16" opacity="${0.9 - i * 0.15}"/>`).join(''),
    // waves
    [0, 1, 2, 3].map((i) => `<path d="M-20 ${150 + i * 60} q 55 -45 110 0 t 110 0 t 110 0 t 110 0" fill="none" stroke="${b}" stroke-width="18" opacity="${0.95 - i * 0.18}"/>`).join(''),
    // stripes
    `<g transform="rotate(-30 200 200)">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="-200" y="${i * 80 - 40}" width="800" height="34" fill="${b}" opacity=".75"/>`).join('')}</g>`,
  ]
  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="${id}-g" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}" stop-opacity=".55"/></linearGradient>${
    grain
      ? `<filter id="${id}-n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0"/></filter>`
      : ''
  }</defs>
<rect width="400" height="400" fill="#0F0D1C"/><rect width="400" height="400" fill="url(#${id}-g)"/>
${shapes[h % shapes.length]}
<text x="22" y="378" font-family="Unbounded, sans-serif" font-weight="800" font-size="190" fill="${ink}" opacity=".92">${initial(name)}</text>
${grain ? `<rect width="400" height="400" filter="url(#${id}-n)"/>` : ''}
</svg>`
}
