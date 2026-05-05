# create-with-abhi

Personal portfolio of [Abhishek Bhikule](mailto:abhishekb@bsf.io). A single-page,
five-section site with rich motion chrome — preloader, custom cursor,
hover-swap nav, fullscreen menu, image-trail hero, giant stacked footer
wordmark.

## Stack

- **Framework** — Next.js 16 (App Router) + React 19 + TypeScript
- **Styling** — Tailwind CSS v4 (CSS variables for theme tokens)
- **Smooth scroll** — Lenis
- **Scroll motion** — GSAP + ScrollTrigger
- **Component motion** — Motion (`motion/react`)
- **Theme** — `next-themes` (light cream / warm dark, persisted)
- **Text splitting** — `split-type` (preloader char reveal)
- **Fonts** — Bricolage Grotesque (display, variable), Geist (body), JetBrains Mono (labels) — all via `next/font/google`

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint
```

## Project shape

```
app/
  layout.tsx               providers, fonts, persistent chrome
  page.tsx                 single-page composition
  globals.css              Tailwind v4 @theme + CSS variables
  opengraph-image.tsx      OG image generator (1200×630)
components/
  chrome/                  Preloader, TopBar, HoverSwap, MenuOverlay, ThemeToggle, Cursor, RotatingMark
  sections/                Hero, SelectedWork, ProjectRow, About, Contact, Footer
  motion/                  SmoothScroll, FadeUp, ThumbnailFollow, ImageTrail
  ui/                      HoverLink
lib/                       projects, currently, trail, nav, socials
public/images/             projects/ + trail/ assets
```

## Theming

Two themes via `next-themes` writing `data-theme="light|dark"` on `<html>`.
Tokens live in `app/globals.css` as CSS variables and are mapped to Tailwind
utilities through `@theme` (e.g. `bg-bg`, `text-ink`, `text-ochre`).

| Token | Light | Dark |
|---|---|---|
| `--bg`     | `#fafafa` | `#0a0a0a` |
| `--ink`    | `#0a0a0a` | `#fafafa` |
| `--paper`  | `#f1f1f1` | `#161616` |
| `--accent` | `#ff2e35` | `#ff453a` |

## Motion

- Preloader runs once per browser session (gated by `sessionStorage`)
- Custom cursor disabled on `(hover: none)` and `prefers-reduced-motion: reduce`
- Hero image trail and scroll-tied reveals also gated on reduced motion
- Lenis smooth scroll synced with ScrollTrigger via `lenis.on("scroll", ScrollTrigger.update)`

## Content

Editable in `lib/`:

- `projects.ts` — featured project list (title, blurb, stack, year, url, image)
- `currently.ts` — "currently" status block in About
- `trail.ts` — image pool for hero cursor trail
- `nav.ts` — top-bar hover-swap labels
- `socials.ts` — GitHub / LinkedIn / mailto

Project thumbnails live in `public/images/projects/`. Trail thumbnails in
`public/images/trail/` (currently re-uses project tiles via `lib/trail.ts`).

## Deploy

Built for Vercel. The OG image is generated at the edge from
`app/opengraph-image.tsx`.

## License

Personal site. Code MIT-style for reference; brand wordmark and copy are
mine. Don't ship a copy with my name on it.
