// A static site: `npm run build` writes plain HTML, CSS and JS to out/.
export default {
  output: 'export',
  trailingSlash: true,
  // Photos are resized by scripts/images.mjs before the build.
  images: { unoptimized: true },
  poweredByHeader: false,
  // Two build workers. Next starts one per CPU it sees, and in a container
  // limited to two CPUs (like Ikasu's build sandbox) it still sees the
  // host's: the extra workers made a build take twice as long.
  experimental: { cpus: 2 },
}
