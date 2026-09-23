# CPR Aqua Farms

Website for CPR Aqua Farms — a 72-acre BAP-certified shrimp farm at Gurajanapalli, Andhra Pradesh.

Everything that gets deployed lives in [`site/`](site/). It is a static site: no build step, no
dependencies. Open `site/index.html` in a browser, or serve the folder:

```sh
cd site && python3 -m http.server 8000
```

## Layout

```
site/
  index.html    single page, sections anchored by id
  styles.css    all styling, including the inline blur-up placeholders
  main.js       sticky nav, image fade-in, reveal-on-scroll
  img/          optimised AVIF + JPEG renditions and logo assets
```

## Images

Photographs are served as AVIF with a JPEG fallback, at several widths, chosen by the browser
through `srcset`/`sizes`. Each figure has a ~700-byte blurred placeholder inlined in `styles.css`,
so a photo fades in over a preview of itself instead of a blank box.

The camera originals are **not** in this repo. To regenerate a rendition from an original:

```sh
sips -s format avif -s formatOptions 72 -Z 1600 original.JPG --out site/img/name-1600.avif
sips -s format jpeg -s formatOptions 78 -Z 1600 original.JPG --out site/img/name-1600.jpg
```

Portrait originals carry an EXIF orientation flag that AVIF does not preserve, so rotate and strip
metadata before encoding (`sips -r 90`, then remove the APPn segments) or they will appear sideways.

## Reserved media slots

Three places are held open for material that is still coming. Each is marked with a `MEDIA SLOT`
comment in `index.html` containing the markup to drop in:

| Slot | Where | For |
|---|---|---|
| A | Hero | Drone video background (poster already wired up) |
| B | Founder card | Portrait of Chakkapalli Venkata Prabhakar Rao |
| C | "From Above" section | Drone film and aerial stills |

## Before going live

- Replace the placeholder email, phone and WhatsApp number in the contact section.
- Confirm the shrimp species if it should be named on the page.
- Point `<link rel="canonical">` and the Open Graph image at the real domain.
