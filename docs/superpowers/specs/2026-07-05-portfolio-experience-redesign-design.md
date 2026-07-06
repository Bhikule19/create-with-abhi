# Portfolio Experience Redesign — Design Spec

**Date:** 2026-07-05
**Site:** createwithabhi.in
**Status:** Approved direction from brainstorm (hero concept, sitemap, brand foundation, experience blueprint v2)

---

## 1. Goal & Positioning

Transform the current resume-shaped portfolio into a **freelance lead-generation site** for Abhishek Bhikule — independent web designer & developer. The site itself is the primary proof of craft: an awwwards-calibre cinematic experience that makes any visitor (founder, agency, brand owner) think *"I want my site to feel like this."*

- **Audience:** mixed — startups/SaaS founders, agencies (white-label), premium brands/creators.
- **Services sold:** ① Signature sites (design + build end-to-end) ② Landing pages that convert ③ WordPress, done properly ④ Motion & 3D experiences.
- **Primary conversion:** "Start a project" → short qualification form → thank-you screen offers a Cal.com call slot (hybrid lead path). Email always visible as fallback.
- **Case-study strategy:** 2–3 self-initiated concept redesigns (fully documented process) + real shipped projects, clearly labelled `CONCEPT REDESIGN` vs `SHIPPED PRODUCT`.

### Reference DNA (verified in-browser 2026-07-05)

| Reference | What we take |
|---|---|
| ulrychkristian.cz | Starfield-behind-massive-type hero proof; lens cursor over work; giant gradient email footer + live local time |
| aboutluca.com | Tech stack (Three.js + GSAP + Lenis + custom GLSL, ~1.1MB bundle); shader-distortion as signature feel |
| upsunday.co | Cursor paint-trail concept; inline media chips in headlines (About section) |
| neuemontreal.com | Typographic voice: massive staggered grotesque, per-word accents, scale jumps |
| majd-portfolio.framer.website | Clipped mega-wordmark footer close |
| showcase.noomoagency.com | Ambition ceiling — and the anti-lesson: their preloader ran 40s+; ours caps at ~2.5s |

---

## 2. Brand Foundation

### 2.1 Color tokens

Warm values only — never pure `#000`/`#FFF`.

| Token | Value | Use |
|---|---|---|
| `--stage` | `#0A0A0B` | Page background |
| `--surface` | `#141416` | Cards, panels |
| `--line` | `#2A2A2E` | Borders, dividers |
| `--ink-muted` | `#8A877F` | Secondary text, labels |
| `--ink` | `#E8E6E1` | Primary text |
| `--brass` | `#D4A24E` | Accent: CTAs, accent words (base of gradient) |
| `--brass-hover` | `#E6B96A` | Hover states |
| `--violet` | `#8B6FE8` | WebGL atmosphere: starfield glow, particle depth, gradient tail |

**Three color layers** (the fix for "no colors"):
1. Brass→gold gradient (`#D4A24E → #E6B96A`) on accent words and CTAs.
2. Ultraviolet (`#8B6FE8`) as the WebGL atmosphere color.
3. Per-project gradient worlds — each case study owns a distinct full-color gradient family; the Work section is the most colorful place on the site.

Gradient recipe for accent words / footer email: `linear-gradient(95–100deg, ink/brass → brass-hover → violet)` clipped to text.

Dark is the brand. No light mode in v1.

### 2.2 Type system

| Role | Face | Notes |
|---|---|---|
| Display / kinetic | **PP Neue Montreal** (name-your-price license from Pangram Pangram). Free stand-in during build: **Instrument Sans** (Google Fonts) | Weights 400–700, tight tracking (−0.02 to −0.04em), uppercase for hero lines |
| Accent words | **Fraunces** Italic 300 (variable, opsz 144) | Serif italic inside grotesque headlines; always gets the gradient treatment |
| Labels / meta / UI | **JetBrains Mono** 400 | Kickers, section numbers, coordinates, footer meta; letter-spacing 0.15–0.22em, uppercase |
| Body | Instrument Sans 400 | One family with display = fewer font files |

All fonts self-hosted via `next/font` (no external font CDN at runtime).

### 2.3 Type scale (fluid, clamp-based)

| Token | Size | Use |
|---|---|---|
| `display-xl` | `clamp(3.5rem, 10vw, 9rem)` | Hero lines, footer email |
| `display-lg` | `clamp(2.5rem, 6vw, 5rem)` | Section headlines |
| `display-md` | `clamp(1.75rem, 3.5vw, 2.75rem)` | Case card titles, About statement |
| `body-lg` | `clamp(1.05rem, 1.4vw, 1.25rem)` | Intro paragraphs |
| `body` | `1rem` | Default |
| `label` | `0.625–0.6875rem` | Mono kickers/meta |

Line-height: 0.95–1.05 display, 1.6–1.7 body. Spacing rhythm: 8px base; section padding `clamp(5rem, 12vh, 10rem)` vertical.

### 2.4 Motion language

| Token | Value | Use |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals, masks — the house easing |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Position/layout moves |
| `--dur-fast` | `0.3s` | Hovers, cursor states |
| `--dur-base` | `0.8–1.0s` | Text reveals |
| `--dur-slow` | `1.2–1.6s` | Scene/section transitions |
| Stagger | 0.08–0.12s per line/word | SplitType reveals |

Rules: slow and deliberate over snappy; nothing bounces; opacity+transform only (no layout thrash); every scroll animation driven by ScrollTrigger with scrub where cinematic, toggle where punctual. Film-grain overlay (SVG turbulence or shader pass) sits above everything at low opacity.

`prefers-reduced-motion`: all reveals become opacity-only, starfield becomes static, Lenis disabled, cursor system disabled.

---

## 3. Interaction Systems (site-wide)

### 3.1 Cursor system
- Default: 20px ring (`--ink`, `mix-blend-mode: difference`), lerped follow (~0.18 factor).
- Over case-study media: grows to ~70px filled lens with `VIEW` label (Kristián pattern). v1 ships CSS/transform lens; WebGL magnification is a v2 enhancement.
- Over links/buttons: ring shrinks and thickens; magnetic pull on CTA pills (translate toward cursor ×0.3, spring back on leave).
- Hidden on touch devices; native cursor restored. Never break accessibility — the real cursor stays functional (`cursor: none` only inside experience surfaces).

### 3.2 Smooth scroll
Lenis (already installed), lerp ~0.1, synced to GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.

### 3.3 Text reveals
SplitType line masks: lines wrapped in `overflow:hidden`, translateY(110%) → 0, house easing, staggered. Word-level gradient accent words render in Fraunces italic.

### 3.4 Page transitions
Case card → case study page: shared-element feel — card image expands toward viewport while route changes (View Transitions API with graceful fallback to fade+lift). Back navigation reverses.

---

## 4. Landing Page — Section Choreography

Single page, five acts. Section order: Preloader → Hero → Selected Work → Services → Process → About → Signals → Contact → Footer.

### 00 · Preloader (Act I)
- ≤ 2s, plays once per session (sessionStorage flag; skipped on repeat visits).
- Mono counter 0→100 + name mark; curtain lifts directly into the hero starfield — one continuous move, no hard cut.
- Asset budget enforced: preloader covers font + hero scene warm-up only, not a 40s asset gate.

### 01 · Hero — "The Monolith"
- Full-viewport Three.js (R3F) starfield/particle field: ~2–3k points, violet-tinted depth layer, brass highlight particles; mouse = subtle camera drift (parallax by depth); slow constant drift when idle.
- Type stack (kinetic, Neue Montreal voice):
  - Mono kicker: `ABHISHEK BHIKULE — WEB DESIGNER & DEVELOPER`
  - Three staggered display-xl lines, uppercase grotesque with Fraunces-italic gradient accent words. v1 copy: `DESIGN THAT / PEOPLE remember, / CODE THAT performs.` (copy may be tuned during build; structure is fixed)
  - Availability line: `● AVAILABLE — BOOKING Q3 2026` (mono, brass dot pulse).
- Persistent top bar: wordmark left; nav (WORK · SERVICES · ABOUT) + brass `START A PROJECT` pill right.
- Scroll: particles part like a curtain (positions animated along scroll progress), type lifts and blurs out; hands off to Work.

### 02 · Selected Work (Act II — Proof)
- 3–4 featured case studies. Large cinematic cards (full-bleed gradient artwork per project), title in display-md, one-line outcome metric in mono.
- Labels: `CONCEPT REDESIGN` / `SHIPPED PRODUCT` (mono, brass).
- Cards emerge as particles part; subtle parallax inside card media; lens cursor active over cards.
- Click → `/work/[slug]` with shared-element transition.
- `VIEW ALL WORK →` link if more than 4 exist.

### 03 · Services (Act III — Offer)
- Section headline: display-lg with accent word.
- Four numbered editorial rows (①–④): Signature sites · Landing pages that convert · WordPress, done properly · Motion & 3D experiences.
- Each row: hover/tap expands to show "good for / typical timeline" (Signature 4–8 wks; Landing 1–2 wks; WordPress scoped; Motion = the secret weapon).
- Row hover: background surface fill sweeps in, row text shifts weight; slow stagger on first reveal.

### 04 · Process
- Headline: `No chaos. A process.`
- Scroll-pinned horizontal sequence, four beats: Discover → Design → Build → Launch. Progress line draws itself.
- Each step states what the client gets: fixed-scope proposal · weekly progress · staging link from day one · 2 weeks post-launch fixes included.

### 05 · About (Act IV — Human)
- Portrait revealed via clip-path scroll reveal.
- Statement (display-md): `Designer who codes, developer who designs.` with gradient accent.
- 3–4 sentences: BSF production-engineering background = discipline; UpSunday-style inline media chips inside the statement (small images embedded in the headline) as the warmth moment.
- `Currently:` ticker line (mono).

### 06 · Signals
- Lightweight quote marquee (slow auto-scroll, pauses on hover): colleague/collaborator quotes now, client quotes as they accumulate. A strip, not a wall.

### 07 · Contact / CTA (Act V — Ask)
- Particle field returns behind the section — the curtain closes where it opened.
- Headline display-xl: `Let's make something worth remembering.` (accent gradient on `worth remembering`).
- Lead path (hybrid):
  1. Short form: name · email · project type (select) · budget range (select) · message. Client + server validation (Zod), honeypot anti-spam.
  2. Success screen: thank-you + embedded Cal.com booking link ("grab a slot now if you'd rather talk").
  3. Fallback always visible: `hello@createwithabhi.in` pill.
- Form submission: Next.js route handler → email notification via **Resend** (free tier covers portfolio volume); API key via env var, validated at startup.

### 08 · Footer
- Eyebrow: `LET'S WORK TOGETHER`.
- Email as giant gradient display headline (Kristián pattern).
- Meta row: `DESIGNED & BUILT BY ABHISHEK` · live `MUMBAI, HH:MM IST` clock · socials (X · LINKEDIN · GITHUB) · quiet CV link.
- Below: clipped mega-wordmark `CREATEWITHABHI` bleeding off the bottom (Majd pattern), surface-dark fill.

### Cut from current site
Experience timeline, Tech Stack section, dual "Selected Work" tracks, resume-download as primary CTA (demoted to footer link). Stack info moves inside each case study.

---

## 5. Case Study Template — `/work/[slug]`

Designed once, reused for every study. Structure:

1. **Case hero:** full-bleed project gradient world + title (display-xl) + label (`CONCEPT REDESIGN`/`SHIPPED PRODUCT`) + meta row (year · role · stack · timeline).
2. **Context:** the problem / the brief (concept studies state the self-set brief honestly).
3. **Approach:** design decisions, type/color exploration, motion prototypes (video/GIF embeds).
4. **The build:** technical highlights, performance numbers where real.
5. **Outcome:** metrics if shipped; before/after and rationale if concept.
6. **Next project** link (footer-level, keeps the loop going).

Content stored as typed data/MDX in-repo (no CMS in v1). Case studies are also the social-content flywheel: each one exports shareable crops.

### Launch content set
- 2 concept redesigns (subjects chosen during content production — documented process is the point).
- 1–2 shipped projects reframed (e.g. Medical Report Companion, DESIGN.md Extractor) with process narrative.

---

## 6. Technical Architecture

### Stack
- **Next.js 16 App Router** (existing repo — heed `node_modules/next/dist/docs/` for breaking changes), TypeScript, Tailwind 4.
- **Three.js + @react-three/fiber + @react-three/drei** (add) — hero/contact particle scenes, shader materials.
- **Custom GLSL** (add) — particle curtain, velocity-reactive distortion; postprocessing grain (or SVG-overlay fallback).
- **GSAP + ScrollTrigger** (have) — all scroll choreography.
- **Lenis** (have) — smooth scroll.
- **SplitType** (have) — text reveals.
- **Zod** (add) — form validation.
- Remove/retire: `motion` package if redundant after GSAP consolidation (decide at implementation; avoid two animation systems fighting).

### Component architecture (target)
```
components/
  experience/      # all WebGL: Scene, Starfield, ParticleCurtain, Grain
  chrome/          # Cursor (rebuilt), TopBar, MenuOverlay, Preloader (rebuilt)
  motion/          # SmoothScroll, RevealText, MagneticButton, ClipReveal
  sections/        # Hero, Work, Services, Process, About, Signals, Contact, Footer
  work/            # CaseCard, CaseHero, CaseSection, CaseMeta
lib/
  projects.ts      # extended: caseStudy content refs, gradient world tokens
  tokens.ts        # color/motion/type tokens (single source of truth)
app/
  page.tsx         # landing
  work/[slug]/     # case study route
  api/lead/        # form handler
```
Files stay focused (<300 lines); WebGL isolated behind `experience/` so everything else renders without it.

### Performance contract (hard requirements)
- **< 2.5s to interactive** on 4G mid-tier hardware; preloader ≤ 2s and only once per session.
- 60fps target; particle counts and DPR capped adaptively (`dpr={[1, 1.5]}`, reduce points on low `deviceMemory`/mobile).
- WebGL lazy-mounted; landing works (static gradients, opacity reveals) if WebGL fails or is unavailable — graceful degradation, not a blank stage.
- Mobile: starfield simplified or static gradient + grain; cursor system off; horizontal Process pin becomes vertical steps.
- Fonts subset + self-hosted; hero LCP element is text, not canvas.
- Lighthouse: Performance ≥ 90 mobile, Accessibility ≥ 95, SEO ≥ 95.

### Accessibility
- Full keyboard navigation; visible focus states (brass outline).
- `prefers-reduced-motion` honored globally (see §2.4).
- Semantic landmarks per section; real text everywhere (no text-in-canvas for content).
- Contrast: `--ink` on `--stage` = 15.8:1; `--ink-muted` on `--stage` ≥ 4.6:1; brass used at ≥ 3:1 for interactive elements.

### SEO / analytics
- Per-page metadata + OG images (existing `opengraph-image.tsx` pattern extended to case studies).
- JSON-LD: `Person` + `Service` on landing, `CreativeWork` per case study.
- Keep Vercel Analytics + Speed Insights; add form-conversion event tracking.

---

## 7. Testing

- **Unit (Vitest, existing):** token utilities, form validation schema, lead route handler logic.
- **E2E (Playwright, existing):** landing renders all sections; nav + anchor scroll; lead form happy path + validation errors + success screen with booking link; case study routing; reduced-motion smoke run.
- **Manual/visual:** cursor states, WebGL fallback (force-disable WebGL), mobile degradation, 4G throttled load time.
- WebGL scenes themselves are excluded from automated coverage targets (visual/manual QA); business logic (forms, data, routes) meets the standard bar.

## 8. Rollout Phases

1. **Foundation:** tokens, fonts, Lenis+GSAP consolidation, cursor system, reveal primitives, new layout shell.
2. **Hero + Footer:** starfield scene, kinetic type, preloader, footer (the two "wow" bookends).
3. **Landing middle:** Work cards, Services, Process, About, Signals.
4. **Lead flow:** Contact form + route handler + Cal.com success screen.
5. **Case studies:** template + first 3–4 studies (content production runs parallel).
6. **Polish pass:** grain, transitions, performance audit, a11y audit, cross-device QA.

Out of scope v1: light mode, blog, CMS, WebGL lens magnification (CSS lens ships v1), i18n.
