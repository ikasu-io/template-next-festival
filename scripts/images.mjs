// Turns the photos in content/images/ into WebP files at 480, 800, 1200 and
// 1600 px in public/img/ (Next's static export has no image optimisation),
// plus the 1200×630 share image public/og.jpg. Runs before every build and
// dev start; photos that haven't changed are skipped.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const src = 'content/images'
const out = 'public/img'
const widths = [480, 800, 1200, 1600]
fs.mkdirSync(out, { recursive: true })

const sources = fs.readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
let made = 0
for (const file of sources) {
  const name = path.parse(file).name
  const input = path.join(src, file)
  const changed = fs.statSync(input).mtimeMs
  for (const width of widths) {
    const target = path.join(out, `${name}-${width}.webp`)
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= changed) continue
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 74 }).toFile(target)
    made++
  }
}
// Remove files of photos that are gone.
const names = new Set(sources.map((f) => path.parse(f).name))
for (const file of fs.readdirSync(out)) {
  if (!names.has(file.replace(/-\d+\.webp$/, ''))) fs.rmSync(path.join(out, file))
}

const hero = sources.find((f) => f.startsWith('hero-dyke.')) ?? sources[0]
if (hero) await sharp(path.join(src, hero)).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile('public/og.jpg')
console.log(`images: ${sources.length} photos, ${made} files written`)
