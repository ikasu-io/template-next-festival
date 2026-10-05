# Images

The photos in `content/images/` were generated with AI for this fictional
site. They do not show real places, people, bands or brands.

- **Model:** Google Gemini (image generation), October 2026
- **Prompts:** one shared style description plus one prompt per image,
  kept in the maintainer's brief for this template
- **Processing:** cropped to their aspect ratio and scaled to at most
  1600 px wide; `scripts/images.mjs` converts them to WebP before every
  build. Gemini wrote a made-up festival name on the stage banner in
  `hero-dyke`, `crowd-hands` and `rain-ponchos`; the lettering was
  blurred out
- **Licence:** like the rest of this repository, the images are under the
  [MIT licence](LICENSE). You may use, change and redistribute them,
  including in your own site.

Images from Gemini carry Google's invisible SynthID watermark, which marks
them as AI-generated.

The acts have no photos: their cover art is drawn from each act's two
colours and name by `lib/cover.js`. The favicon is an SVG drawing made
for this site. All are under the same licence. The fonts Unbounded and
Manrope are under the SIL Open Font License (`app/fonts/OFL-*.txt`).
