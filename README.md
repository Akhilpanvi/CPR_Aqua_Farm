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

## Boot screen

`#boot` is a full-screen overlay defined inline at the top of `<body>`, with its
own `<style>` so it paints before `styles.css` arrives. It holds until the hero
image has decoded, then hands over to the page, which is what lets the hero copy
and the background settle in rather than appearing mid-download.

It is built so it can never trap a visitor:

- a `<noscript>` rule hides it outright when scripts are off
- a CSS `animation` clears it after 6s even if the script never runs
- `markBooted()` is also on a 6.5s timer, since the hero copy starts hidden and
  is only revealed by `html.booted`

Adding `?b=1` style cache-busting is unnecessary — `styles.css` and `main.js`
carry a `?v=N` that must be bumped whenever either changes, or browsers will
keep serving the previous build.

## Icons

`favicon.ico` (16/32/48, PNG-encoded inside an ICO container) and the PNG icons
in `img/` are generated from `Brand/Logo_With_Name.png`: the mark is cropped out,
knocked through to white and set on a rounded brand-teal tile, because the bare
line-art turns to mush at 16px. The scripts that build it live in the commit
history rather than the repo, since they only ever run when the logo changes.

## Reserved media slots

Two places are held open for material that is still coming. Each is marked with a `MEDIA SLOT`
comment in `index.html` containing the markup to drop in:

| Slot | Where | For |
|---|---|---|
| A | Hero | Drone video background (poster already wired up) |
| C | "From Above" section | Drone film and aerial stills |

The founder portrait is cropped to 4:5 from `Brand/CPR.png`:

```sh
sips -s format png -c 1357 1086 --cropOffset 40 0 Brand/CPR.png --out crop.png
```

## Before going live

- Replace the placeholder email, phone and WhatsApp number in the contact section.
- Confirm the shrimp species if it should be named on the page.
- Point `<link rel="canonical">` and the Open Graph image at the real domain.
