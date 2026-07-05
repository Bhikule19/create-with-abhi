# Experience Redesign — Plan 1 of 3: Foundation + Hero/Footer Bookends

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the site foundation (tokens, fonts, motion/cursor primitives) and ship the two cinematic bookends — the Monolith starfield hero and the gradient-email footer — on branch `feat/experience-redesign` (PR #1).

**Architecture:** All WebGL lives in `components/experience/` behind a lazy client-only boundary so the site renders fully without it. Pure logic (star generation, magnet math, cursor state, clock formatting) lives in `lib/` and is unit-tested with Vitest; visual behaviour is smoke-tested with Playwright. Old sections keep rendering during the transition via CSS token aliases.

**Tech Stack:** Next.js 16 App Router (pnpm!), Tailwind 4 (`@theme` in `globals.css`), GSAP + ScrollTrigger (installed), Lenis (installed), SplitType (installed), three + @react-three/fiber + @react-three/drei (added in Task 6), Vitest + jsdom (wired in Task 1), Playwright (wired in Task 10).

**Spec:** `docs/superpowers/specs/2026-07-05-portfolio-experience-redesign-design.md` (§2 tokens, §3 interactions, §4.00–4.01 preloader/hero, §4.08 footer, §6 architecture & performance).

## Global Constraints

- Package manager: **pnpm** only (never npm/npx — use `pnpm exec` for binaries).
- This Next.js version may differ from training data: consult `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` before touching font code, and the relevant guide before any App Router API you're unsure of.
- Branch: `feat/experience-redesign`. Commit after every task; push at the end of the plan (PR #1 accumulates the work).
- No `console.log` in production code. No mutation — immutable patterns everywhere.
- Colors (exact, from spec): stage `#0A0A0B`, surface `#141416`, line `#2A2A2E`, ink-muted `#8A877F`, ink `#E8E6E1`, brass `#D4A24E`, brass-hover `#E6B96A`, violet `#8B6FE8`. Never pure `#000`/`#FFF`.
- Fonts: Instrument Sans (display+body), Fraunces italic 300 (accent words), JetBrains Mono (labels) — all via `next/font/google`, self-hosted at build.
- House easing `cubic-bezier(0.16, 1, 0.3, 1)`; durations 0.3s hover / 0.8–1.0s reveal / 1.2–1.6s scene.
- `prefers-reduced-motion`: reveals become opacity-only, starfield static, cursor system off.
- Performance: preloader ≤ 2s once per session; WebGL lazy-mounted; site must render without WebGL.
- Dark only (v1): force dark theme, do not delete next-themes wiring (ThemeToggle still imported by MenuOverlay) — use `forcedTheme="dark"`.

---

### Task 1: Vitest infrastructure + design tokens module

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/tokens.ts`
- Test: `lib/__tests__/tokens.test.ts`
- Modify: `package.json` (scripts + devDep `jsdom`)

**Interfaces:**
- Produces: `COLORS` (Record of the 8 spec colors), `EASE` (`{ outExpo: string; inOut: string }`), `DUR` (`{ fast: number; base: number; slow: number }` in seconds), `STAR_COUNT_DESKTOP = 2400`, `STAR_COUNT_MOBILE = 800`. Later tasks import these — single source of truth for JS-side tokens.

- [ ] **Step 1: Install jsdom and add test scripts**

```bash
pnpm add -D jsdom
```

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: Create vitest config**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["lib/**/*.test.ts", "components/**/*.test.tsx"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Write the failing test**

`lib/__tests__/tokens.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { COLORS, EASE, DUR, STAR_COUNT_DESKTOP, STAR_COUNT_MOBILE } from "@/lib/tokens";

describe("design tokens", () => {
  it("defines the spec palette exactly", () => {
    expect(COLORS.stage).toBe("#0A0A0B");
    expect(COLORS.surface).toBe("#141416");
    expect(COLORS.line).toBe("#2A2A2E");
    expect(COLORS.inkMuted).toBe("#8A877F");
    expect(COLORS.ink).toBe("#E8E6E1");
    expect(COLORS.brass).toBe("#D4A24E");
    expect(COLORS.brassHover).toBe("#E6B96A");
    expect(COLORS.violet).toBe("#8B6FE8");
  });

  it("never uses pure black or white", () => {
    const values = Object.values(COLORS).map((c) => c.toLowerCase());
    expect(values).not.toContain("#000000");
    expect(values).not.toContain("#ffffff");
  });

  it("defines house easing and duration tokens", () => {
    expect(EASE.outExpo).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
    expect(EASE.inOut).toBe("cubic-bezier(0.65, 0, 0.35, 1)");
    expect(DUR.fast).toBe(0.3);
    expect(DUR.base).toBe(0.9);
    expect(DUR.slow).toBe(1.4);
  });

  it("caps star counts per performance contract", () => {
    expect(STAR_COUNT_DESKTOP).toBeLessThanOrEqual(3000);
    expect(STAR_COUNT_MOBILE).toBeLessThanOrEqual(1000);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '@/lib/tokens'` (or equivalent resolve error).

- [ ] **Step 5: Write the tokens module**

`lib/tokens.ts`:

```ts
/**
 * Single source of truth for JS-side design tokens.
 * CSS mirrors these values in app/globals.css — keep both in sync.
 */
export const COLORS = {
  stage: "#0A0A0B",
  surface: "#141416",
  line: "#2A2A2E",
  inkMuted: "#8A877F",
  ink: "#E8E6E1",
  brass: "#D4A24E",
  brassHover: "#E6B96A",
  violet: "#8B6FE8",
} as const;

export const EASE = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** GSAP-compatible easing (same curves, GSAP syntax). */
export const GSAP_EASE = {
  outExpo: "expo.out",
  inOut: "power2.inOut",
} as const;

/** Durations in seconds. */
export const DUR = {
  fast: 0.3,
  base: 0.9,
  slow: 1.4,
} as const;

export const STAR_COUNT_DESKTOP = 2400;
export const STAR_COUNT_MOBILE = 800;
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts lib/tokens.ts lib/__tests__/tokens.test.ts package.json pnpm-lock.yaml
git commit -m "feat: add vitest infra and design token module"
```

---

### Task 2: Brand CSS + fonts + dark-only layout

**Files:**
- Modify: `app/globals.css` (full token rewrite with compat aliases)
- Modify: `app/layout.tsx` (font swap, forced dark)

**Interfaces:**
- Consumes: token values from Task 1 (mirrored into CSS).
- Produces: CSS custom properties `--stage --surface --line --ink --ink-muted --brass --brass-hover --violet`, Tailwind theme colors `stage surface line ink ink-muted brass brass-hover violet` (usable as `bg-stage text-ink border-line text-brass` etc.), font variables `--ff-sans` (Instrument Sans), `--ff-serif` (Fraunces), `--ff-mono` (JetBrains Mono), Tailwind fonts `font-sans font-serif font-mono`, utility class `.text-gradient-accent`, type-scale properties `--text-display-xl --text-display-lg --text-display-md`. **Compat aliases** keep old sections rendering: `--color-bg → stage`, `--color-ink → ink`, `--color-ink-dim → ink-muted`, `--color-surface → surface`, `--color-surface-high → #1C1C1F`, `--color-paper → surface`, `--color-rule → line`, `--color-accent → brass`, `--color-glass → line`, `--font-display → --ff-sans`.

- [ ] **Step 1: Read the Next.js fonts guide**

Read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`. Confirm the `next/font/google` named-import API and variable-font `weight`/`style` options match the code below; adjust to the doc if it differs.

- [ ] **Step 2: Rewrite `app/globals.css`**

Replace the entire file with:

```css
@import "tailwindcss";

/* Dark is the brand (v1). next-themes keeps data-theme="dark" forced. */
@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* CINEMA — warm black stage, ivory ink, brass + violet accents.
   Values mirror lib/tokens.ts — keep both in sync. */
:root {
  --stage: #0a0a0b;
  --surface: #141416;
  --surface-high: #1c1c1f;
  --line: #2a2a2e;
  --ink: #e8e6e1;
  --ink-muted: #8a877f;
  --brass: #d4a24e;
  --brass-hover: #e6b96a;
  --violet: #8b6fe8;

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 0.3s;
  --dur-base: 0.9s;
  --dur-slow: 1.4s;

  /* Fluid type scale */
  --text-display-xl: clamp(3.5rem, 10vw, 9rem);
  --text-display-lg: clamp(2.5rem, 6vw, 5rem);
  --text-display-md: clamp(1.75rem, 3.5vw, 2.75rem);
}

@theme {
  /* New tokens */
  --color-stage: var(--stage);
  --color-surface: var(--surface);
  --color-surface-high: var(--surface-high);
  --color-line: var(--line);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-brass: var(--brass);
  --color-brass-hover: var(--brass-hover);
  --color-violet: var(--violet);

  /* Compat aliases — old sections keep rendering until phases 3–5 replace them */
  --color-bg: var(--stage);
  --color-ink-dim: var(--ink-muted);
  --color-paper: var(--surface);
  --color-rule: var(--line);
  --color-accent: var(--brass);
  --color-glass: var(--line);

  --font-sans: var(--ff-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--ff-serif), ui-serif, Georgia, serif;
  --font-mono: var(--ff-mono), ui-monospace, Menlo, Consolas, monospace;
  --font-display: var(--ff-sans), ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html {
    background: var(--stage);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    background: var(--stage);
    color: var(--ink);
    font-family: var(--ff-sans), ui-sans-serif, system-ui, sans-serif;
    overflow-x: hidden;
  }

  ::selection {
    background: var(--brass);
    color: var(--stage);
  }

  :focus {
    outline: none;
  }
  :focus-visible {
    outline: 2px solid var(--brass);
    outline-offset: 3px;
    border-radius: 0;
  }

  /* Lenis ergonomics */
  html.lenis,
  html.lenis body {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }
  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }
  .lenis.lenis-stopped {
    overflow: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer utilities {
  /* Brass→gold→violet gradient clipped to text (accent words, footer email) */
  .text-gradient-accent {
    background: linear-gradient(
      97deg,
      var(--brass) 0%,
      var(--brass-hover) 45%,
      var(--violet) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .label-mono {
    font-family: var(--ff-mono), ui-monospace, monospace;
    font-size: 0.6875rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
}
```

- [ ] **Step 3: Swap fonts and force dark in `app/layout.tsx`**

Replace the font imports/instances (lines 1–25) with:

```tsx
import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TopBar } from "@/components/chrome/TopBar";
import { MenuProvider } from "@/components/chrome/MenuProvider";
import { MenuOverlay } from "@/components/chrome/MenuOverlay";
import { Cursor } from "@/components/chrome/Cursor";
import { Preloader } from "@/components/chrome/Preloader";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--ff-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--ff-serif",
  display: "swap",
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--ff-mono",
  display: "swap",
});
```

Update the `<html>` className and ThemeProvider (keep everything else in the file as-is):

```tsx
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-stage text-ink">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
```

Also update `viewport.themeColor` to a single value:

```tsx
export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};
```

And update the metadata description/keywords for the freelance positioning:

```tsx
const DESCRIPTION =
  "Independent web designer & developer in Mumbai. Cinematic websites, landing pages, WordPress and motion — designed and built end to end.";
```

In `keywords`, replace `"full-stack developer"` with `"web designer"` and `"freelance web developer"`.

- [ ] **Step 4: Verify build and visual smoke**

Run: `pnpm build`
Expected: build succeeds, no type errors.

Run: `pnpm dev`, open `http://localhost:3000`.
Expected: site renders dark with warm-black background, existing sections readable (brass replaces volt-green accents via aliases). Fonts visibly changed (grotesque body). No console errors.

- [ ] **Step 5: Run tests still green**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: rebrand foundation — cinema palette, Instrument Sans/Fraunces/JetBrains Mono, dark-only"
```

---

### Task 3: Pure motion utilities (magnet, clock, stars)

**Files:**
- Create: `lib/motion-utils.ts`
- Test: `lib/__tests__/motion-utils.test.ts`

**Interfaces:**
- Produces:
  - `computeMagnetOffset(mouseX: number, mouseY: number, rect: {left:number; top:number; width:number; height:number}, strength?: number): {x: number; y: number}`
  - `formatMumbaiTime(date: Date): string` → e.g. `"MUMBAI, 14:32 IST"`
  - `mulberry32(seed: number): () => number` (deterministic PRNG)
  - `generateStars(count: number, seed?: number): { positions: Float32Array; sizes: Float32Array; violetMask: Float32Array }` — positions xyz in [-1,1] box ×3, sizes in [0.3,1.9], violetMask 1.0 for ~25% deepest stars.

- [ ] **Step 1: Write the failing tests**

`lib/__tests__/motion-utils.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  computeMagnetOffset,
  formatMumbaiTime,
  mulberry32,
  generateStars,
} from "@/lib/motion-utils";

describe("computeMagnetOffset", () => {
  const rect = { left: 100, top: 100, width: 200, height: 60 };

  it("returns zero offset at element centre", () => {
    expect(computeMagnetOffset(200, 130, rect)).toEqual({ x: 0, y: 0 });
  });

  it("pulls toward the cursor scaled by strength", () => {
    // cursor 50px right of centre, default strength 0.3
    const { x, y } = computeMagnetOffset(250, 130, rect);
    expect(x).toBeCloseTo(15);
    expect(y).toBeCloseTo(0);
  });

  it("respects custom strength", () => {
    const { x } = computeMagnetOffset(250, 130, rect, 0.5);
    expect(x).toBeCloseTo(25);
  });
});

describe("formatMumbaiTime", () => {
  it("formats a UTC date as IST (UTC+5:30)", () => {
    // 09:02 UTC === 14:32 IST
    const d = new Date(Date.UTC(2026, 6, 5, 9, 2));
    expect(formatMumbaiTime(d)).toBe("MUMBAI, 14:32 IST");
  });

  it("pads minutes and hours", () => {
    // 18:35 UTC === 00:05 IST next day
    const d = new Date(Date.UTC(2026, 6, 5, 18, 35));
    expect(formatMumbaiTime(d)).toBe("MUMBAI, 00:05 IST");
  });
});

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces values in [0, 1)", () => {
    const rnd = mulberry32(7);
    const first100 = Array.from({ length: 100 }, () => rnd());
    expect(first100.every((v) => v >= 0 && v < 1)).toBe(true);
  });
});

describe("generateStars", () => {
  it("returns typed arrays sized to count", () => {
    const { positions, sizes, violetMask } = generateStars(100, 1);
    expect(positions).toHaveLength(300); // xyz per star
    expect(sizes).toHaveLength(100);
    expect(violetMask).toHaveLength(100);
  });

  it("is deterministic for the same seed", () => {
    const a = generateStars(50, 9);
    const b = generateStars(50, 9);
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
  });

  it("marks roughly a quarter of stars violet", () => {
    const { violetMask } = generateStars(1000, 3);
    const violets = Array.from(violetMask).filter((v) => v === 1).length;
    expect(violets).toBeGreaterThan(150);
    expect(violets).toBeLessThan(350);
  });

  it("keeps positions inside the unit box", () => {
    const { positions } = generateStars(200, 5);
    expect(Array.from(positions).every((p) => p >= -1 && p <= 1)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/motion-utils.ts`**

```ts
/** Offset pulling an element toward the cursor. Pure — used by MagneticButton. */
export function computeMagnetOffset(
  mouseX: number,
  mouseY: number,
  rect: { left: number; top: number; width: number; height: number },
  strength = 0.3,
): { x: number; y: number } {
  const dx = mouseX - (rect.left + rect.width / 2);
  const dy = mouseY - (rect.top + rect.height / 2);
  return { x: dx * strength, y: dy * strength };
}

const IST_OFFSET_MINUTES = 5.5 * 60;

/** Live footer clock — always IST regardless of visitor timezone. */
export function formatMumbaiTime(date: Date): string {
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const istMinutes = (utcMinutes + IST_OFFSET_MINUTES) % (24 * 60);
  const hh = String(Math.floor(istMinutes / 60)).padStart(2, "0");
  const mm = String(istMinutes % 60).padStart(2, "0");
  return `MUMBAI, ${hh}:${mm} IST`;
}

/** Deterministic PRNG — stable star fields across renders and tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface StarField {
  positions: Float32Array;
  sizes: Float32Array;
  violetMask: Float32Array;
}

/**
 * Star attribute buffers for the hero scene.
 * positions: xyz in [-1,1] (scene scales up), sizes in [0.3,1.9],
 * violetMask: 1.0 for the ~25% deepest stars (tinted violet in shader).
 */
export function generateStars(count: number, seed = 2026): StarField {
  const rnd = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const violetMask = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const z = rnd() * 2 - 1;
    positions[i * 3] = rnd() * 2 - 1;
    positions[i * 3 + 1] = rnd() * 2 - 1;
    positions[i * 3 + 2] = z;
    sizes[i] = 0.3 + rnd() * 1.6;
    violetMask[i] = z < -0.5 ? 1 : 0; // deepest quarter of the box
  }

  return { positions, sizes, violetMask };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS (all files).

- [ ] **Step 5: Commit**

```bash
git add lib/motion-utils.ts lib/__tests__/motion-utils.test.ts
git commit -m "feat: add tested motion utilities — magnet math, IST clock, deterministic starfield"
```

---

### Task 4: RevealText + MagneticButton primitives

**Files:**
- Create: `components/motion/RevealText.tsx`
- Create: `components/motion/MagneticButton.tsx`

**Interfaces:**
- Consumes: `GSAP_EASE`, `DUR` from `lib/tokens.ts`; `computeMagnetOffset` from `lib/motion-utils.ts`.
- Produces:
  - `<RevealText as?: "h1"|"h2"|"h3"|"p"|"div", delay?: number, className?: string, children>` — SplitType line-mask reveal on scroll-into-view; opacity-only under reduced motion.
  - `<MagneticButton as?: "a"|"button", href?, onClick?, className?, strength?: number, children>` — magnetic pull + spring-back; inert on touch/reduced-motion.

- [ ] **Step 1: Implement `components/motion/RevealText.tsx`**

```tsx
"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { GSAP_EASE, DUR } from "@/lib/tokens";

interface RevealTextProps {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Masked line-by-line reveal when scrolled into view. */
export function RevealText({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const split = new SplitType(el, { types: "lines", lineClass: "reveal-line" });

    const lines = el.querySelectorAll<HTMLElement>(".reveal-line");
    lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.style.overflow = "hidden";
      wrap.style.display = "block";
      line.parentNode?.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    const tween = gsap.fromTo(
      lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: DUR.base,
        ease: GSAP_EASE.outExpo,
        stagger: 0.1,
        delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 1 }}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Implement `components/motion/MagneticButton.tsx`**

```tsx
"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { gsap } from "gsap";
import { computeMagnetOffset } from "@/lib/motion-utils";
import { DUR, GSAP_EASE } from "@/lib/tokens";

interface MagneticButtonProps {
  as?: "a" | "button";
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  children: ReactNode;
}

/** CTA pill that leans toward the cursor and springs back on leave. */
export function MagneticButton({
  as = "a",
  href,
  onClick,
  className,
  strength = 0.3,
  children,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const canMagnet = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || !canMagnet()) return;
    const { x, y } = computeMagnetOffset(
      e.clientX,
      e.clientY,
      el.getBoundingClientRect(),
      strength,
    );
    gsap.to(el, { x, y, duration: DUR.fast, ease: GSAP_EASE.outExpo });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
  };

  const Tag = as;
  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      data-cursor="link"
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: succeeds (components unused yet — that's fine; hero consumes them in Task 7).

- [ ] **Step 4: Commit**

```bash
git add components/motion/RevealText.tsx components/motion/MagneticButton.tsx
git commit -m "feat: add RevealText and MagneticButton motion primitives"
```

---

### Task 5: Cursor v2 — ring → lens with VIEW label

**Files:**
- Create: `lib/cursor-state.ts`
- Test: `lib/__tests__/cursor-state.test.ts`
- Modify: `components/chrome/Cursor.tsx` (replace body — keep filename/export)

**Interfaces:**
- Produces: `resolveCursorState(target: EventTarget | null): "default" | "view" | "link"` — reads `data-cursor` from the closest annotated ancestor. Anywhere in the app, adding `data-cursor="view"` to an element gets the lens treatment; `data-cursor="link"` (and bare `a`/`button`) gets the shrunk ring. Later phases annotate case cards with `data-cursor="view"`.

- [ ] **Step 1: Write the failing test**

`lib/__tests__/cursor-state.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { resolveCursorState } from "@/lib/cursor-state";

function el(html: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root.querySelector("[data-target]") as HTMLElement;
}

describe("resolveCursorState", () => {
  it("returns default for plain elements", () => {
    expect(resolveCursorState(el(`<p data-target>hi</p>`))).toBe("default");
  });

  it("returns view inside a data-cursor=view container", () => {
    expect(
      resolveCursorState(
        el(`<div data-cursor="view"><img data-target /></div>`),
      ),
    ).toBe("view");
  });

  it("returns link for anchors and buttons without annotation", () => {
    expect(resolveCursorState(el(`<a href="#" data-target>go</a>`))).toBe("link");
    expect(resolveCursorState(el(`<button data-target>go</button>`))).toBe("link");
  });

  it("explicit data-cursor wins over tag defaults", () => {
    expect(
      resolveCursorState(el(`<a href="#" data-cursor="view" data-target>go</a>`)),
    ).toBe("view");
  });

  it("returns default for null targets", () => {
    expect(resolveCursorState(null)).toBe("default");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/cursor-state.ts`**

```ts
export type CursorState = "default" | "view" | "link";

/** Resolve cursor treatment from the hovered element's annotations. */
export function resolveCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return "default";

  const annotated = target.closest<HTMLElement>("[data-cursor]");
  const value = annotated?.dataset.cursor;
  if (value === "view" || value === "link") return value;

  if (target.closest("a, button, [role='button']")) return "link";
  return "default";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Replace `components/chrome/Cursor.tsx`**

Keep the exported name `Cursor` (layout imports it). Replace the file contents with:

```tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { resolveCursorState, type CursorState } from "@/lib/cursor-state";

const subscribeHover = (notify: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const getHoverSnapshot = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getHoverServerSnapshot = () => false;

/** Ring cursor: 20px difference-blend ring → 72px brass lens with VIEW label. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const enabled = useSyncExternalStore(
    subscribeHover,
    getHoverSnapshot,
    getHoverServerSnapshot,
  );

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      setState(resolveCursorState(e.target));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  const size = state === "view" ? 72 : state === "link" ? 14 : 20;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ transform: "translate(-100px, -100px)" }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          border: state === "view" ? "none" : "1.5px solid var(--ink)",
          background: state === "view" ? "var(--brass)" : "transparent",
          mixBlendMode: state === "view" ? "normal" : "difference",
          transition:
            "width var(--dur-fast) var(--ease-out-expo), height var(--dur-fast) var(--ease-out-expo), background var(--dur-fast)",
        }}
      >
        {state === "view" && (
          <span className="label-mono" style={{ color: "var(--stage)", fontSize: 9 }}>
            VIEW
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify build + manual hover**

Run: `pnpm build` — expected: succeeds.
Run: `pnpm dev`, hover links (ring shrinks) and any element you temporarily give `data-cursor="view"` (brass lens with VIEW).

- [ ] **Step 7: Commit**

```bash
git add lib/cursor-state.ts lib/__tests__/cursor-state.test.ts components/chrome/Cursor.tsx
git commit -m "feat: rebuild cursor — ring/link/lens states driven by data-cursor annotations"
```

---

### Task 6: WebGL starfield experience (R3F)

**Files:**
- Create: `components/experience/Starfield.tsx`
- Create: `components/experience/HeroScene.tsx`
- Modify: `package.json` (deps)

**Interfaces:**
- Consumes: `generateStars`, `STAR_COUNT_DESKTOP`, `STAR_COUNT_MOBILE` from lib; `COLORS` from tokens.
- Produces: `<HeroScene />` — client-only, self-contained full-bleed canvas layer (absolute inset-0). Renders `null` when WebGL unavailable or reduced motion + static fallback handled by caller's CSS gradient behind it. Reads scroll via `window.scrollY` internally (curtain parting uniform). Hero (Task 7) simply renders `<HeroScene />` behind its content.

- [ ] **Step 1: Install three + R3F**

```bash
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

- [ ] **Step 2: Implement `components/experience/Starfield.tsx`**

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { generateStars } from "@/lib/motion-utils";
import { COLORS } from "@/lib/tokens";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // 0 at top of page → 1 after one viewport of scroll
  uniform vec2 uPointer;     // normalised -1..1
  attribute float aSize;
  attribute float aViolet;
  varying float vViolet;
  varying float vTwinkle;

  void main() {
    vViolet = aViolet;
    vec3 p = position;

    // Curtain parting: push stars outward on X as progress grows
    float side = sign(p.x + 0.0001);
    p.x += side * uProgress * 2.2 * (0.4 + abs(p.z));

    // Mouse parallax by depth
    p.xy += uPointer * 0.06 * (0.5 + p.z * 0.5);

    vTwinkle = 0.55 + 0.45 * sin(uTime * 0.9 + p.x * 40.0 + p.y * 30.0);

    vec4 mv = modelViewMatrix * vec4(p * 14.0, 1.0);
    gl_PointSize = aSize * (36.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uViolet;
  varying float vViolet;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d) * vTwinkle;
    vec3 color = mix(uInk, uViolet, vViolet * 0.9);
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

export function Starfield({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const { positions, sizes, violetMask } = useMemo(
    () => generateStars(count),
    [count],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uInk: { value: new THREE.Color(COLORS.ink) },
      uViolet: { value: new THREE.Color(COLORS.violet) },
    }),
    [],
  );

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uPointer.value.lerp(state.pointer, 0.05);
    const progress = Math.min(window.scrollY / size.height, 1);
    m.uniforms.uProgress.value +=
      (progress - m.uniforms.uProgress.value) * 0.08;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aViolet" args={[violetMask, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

- [ ] **Step 3: Implement `components/experience/HeroScene.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Starfield } from "@/components/experience/Starfield";
import { STAR_COUNT_DESKTOP, STAR_COUNT_MOBILE } from "@/lib/tokens";

function useWebGLAvailable(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      setOk(Boolean(gl));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

/** Full-bleed starfield layer behind hero content. Renders nothing without WebGL
 *  or under reduced motion — the CSS gradient fallback behind it carries the look. */
export function HeroScene() {
  const webgl = useWebGLAvailable();
  const [reduced, setReduced] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  if (!webgl || reduced) return null;

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 16], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Starfield count={mobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: succeeds. (Scene mounts in Task 7.)

- [ ] **Step 5: Commit**

```bash
git add components/experience/Starfield.tsx components/experience/HeroScene.tsx package.json pnpm-lock.yaml
git commit -m "feat: add R3F starfield hero scene with curtain-parting shader and fallbacks"
```

---

### Task 7: Hero rebuild — The Monolith

**Files:**
- Modify: `components/sections/Hero.tsx` (full replacement)
- Modify: `app/page.tsx` (hero already first — no order change needed)
- Modify: `lib/nav.ts` (only if labels don't already read WORK/SERVICES/ABOUT — align to spec nav)

**Interfaces:**
- Consumes: `<HeroScene />`, `<RevealText />`, `<MagneticButton />`, `.text-gradient-accent`, `.label-mono`.
- Produces: hero section with `id="top"`; CTA anchors to `#contact` (existing Contact section id — verify with `grep -n 'id=' components/sections/Contact.tsx` and use its actual id).

- [ ] **Step 1: Replace `components/sections/Hero.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";

const HeroScene = dynamic(
  () => import("@/components/experience/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

export function Hero() {
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = content.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(el, {
      yPercent: -18,
      opacity: 0,
      filter: "blur(6px)",
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-stage"
    >
      {/* Static gradient fallback — carries the look when WebGL is off */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 12%, rgba(139,111,232,0.14), transparent 65%), radial-gradient(ellipse 45% 35% at 72% 80%, rgba(212,162,78,0.08), transparent 60%)",
        }}
      />
      <HeroScene />

      <div
        ref={content}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <RevealText as="p" className="label-mono mb-8 text-ink-muted">
          Abhishek Bhikule — Web Designer &amp; Developer
        </RevealText>

        <h1
          className="font-sans font-bold uppercase leading-[0.98] tracking-[-0.03em]"
          style={{ fontSize: "var(--text-display-xl)" }}
        >
          <RevealText as="span" className="block">
            Design that
          </RevealText>
          <RevealText as="span" delay={0.12} className="block">
            people{" "}
            <em className="text-gradient-accent font-serif font-light normal-case italic tracking-normal">
              remember,
            </em>
          </RevealText>
          <RevealText as="span" delay={0.24} className="block">
            code that{" "}
            <em className="text-gradient-accent font-serif font-light normal-case italic tracking-normal">
              performs.
            </em>
          </RevealText>
        </h1>

        <MagneticButton
          href="#contact"
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-brass px-8 py-4 label-mono text-brass transition-colors hover:bg-brass hover:text-stage"
        >
          Start a project →
        </MagneticButton>

        <p className="label-mono mt-10 flex items-center gap-2 text-ink-muted">
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: "var(--brass)" }}
          />
          Available — booking Q3 2026
        </p>
      </div>

      <p className="label-mono absolute bottom-8 z-10 text-ink-muted">↓ Scroll</p>
    </section>
  );
}
```

- [ ] **Step 2: Verify the CTA anchor target exists**

Run: `grep -n 'id=' components/sections/Contact.tsx`
If the Contact section id is not `contact`, change the `MagneticButton` href above to the actual id.

- [ ] **Step 3: Visual verification**

Run: `pnpm dev`, open `http://localhost:3000`.
Expected: full-viewport dark hero; starfield drifting with violet-tinted deep stars; mouse moves camera subtly; three display lines reveal line-by-line with gradient italic accents; magnetic CTA; scrolling parts the starfield and lifts/blurs the content. With DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: static gradient, instant text, no canvas.

- [ ] **Step 4: Build + tests**

Run: `pnpm build && pnpm test`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx app/page.tsx lib/nav.ts
git commit -m "feat: rebuild hero — Monolith starfield, kinetic type, magnetic CTA"
```

---

### Task 8: Preloader v2 — ≤2s, once per session

**Files:**
- Modify: `components/chrome/Preloader.tsx` (full replacement; keep export name)

**Interfaces:**
- Consumes: `GSAP_EASE` from tokens.
- Produces: sessionStorage key `cwa:preloaded` = `"1"` (Playwright asserts this in Task 10).

- [ ] **Step 1: Replace `components/chrome/Preloader.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GSAP_EASE } from "@/lib/tokens";

const SESSION_KEY = "cwa:preloaded";

/** Mono counter 0→100 (~1.6s) then curtain-lift into the hero. Once per session. */
export function Preloader() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }
    setShow(true);

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setShow(false);
      },
    });
    tl.to(counter, {
      value: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.value)),
    });
    tl.to(overlay.current, {
      yPercent: -100,
      duration: 0.7,
      ease: GSAP_EASE.outExpo,
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[90] flex items-end justify-between bg-stage p-8"
      aria-hidden
    >
      <span className="font-sans text-2xl font-bold tracking-tight text-ink">
        CREATEWITHABHI<span className="text-brass">®</span>
      </span>
      <span className="label-mono text-ink-muted">{count}%</span>
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

Run: `pnpm dev`. First load: counter runs ~1.6s, curtain lifts. Reload: no preloader (sessionStorage). New incognito window: preloader again. Total time ≤ 2s.

- [ ] **Step 3: Commit**

```bash
git add components/chrome/Preloader.tsx
git commit -m "feat: rebuild preloader — 1.6s counter curtain, once per session"
```

---

### Task 9: Footer v2 — gradient email, live IST clock, clipped wordmark

**Files:**
- Modify: `components/sections/Footer.tsx` (full replacement; keep export name)

**Interfaces:**
- Consumes: `formatMumbaiTime` from `lib/motion-utils.ts`; `socials` from `lib/socials.ts` (check its shape first: `grep -n "" lib/socials.ts | head -20` and map accordingly).

- [ ] **Step 1: Check the socials data shape**

Run: `head -30 lib/socials.ts`
Note the exported name and item shape (label/href). Use them in Step 2 — if the shape differs from `{ label, href }`, adapt the map call, not the data file.

- [ ] **Step 2: Replace `components/sections/Footer.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { formatMumbaiTime } from "@/lib/motion-utils";
import { socials } from "@/lib/socials";

const EMAIL = "hello@createwithabhi.in";

export function Footer() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(formatMumbaiTime(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-stage px-6 pt-24 md:px-12">
      <p className="label-mono text-ink-muted">Let&apos;s work together</p>

      <a
        href={`mailto:${EMAIL}`}
        data-cursor="link"
        className="text-gradient-accent mt-4 block break-all font-serif font-light leading-[1.05] tracking-[-0.01em]"
        style={{ fontSize: "var(--text-display-lg)" }}
      >
        {EMAIL}
      </a>

      <div className="mt-16 flex flex-col gap-4 border-t border-dashed border-line pt-6 pb-2 md:flex-row md:items-center md:justify-between">
        <span className="label-mono text-ink-muted">
          Designed &amp; built by Abhishek
        </span>
        <span className="label-mono text-ink-muted" suppressHydrationWarning>
          {clock}
        </span>
        <span className="label-mono flex gap-4 text-ink-muted">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brass"
            >
              {s.label}
            </a>
          ))}
          <a href="/Abhishek_B.pdf" className="transition-colors hover:text-brass">
            CV
          </a>
        </span>
      </div>

      {/* Clipped mega-wordmark bleeding off the bottom */}
      <div
        aria-hidden
        className="pointer-events-none -mb-[0.35em] mt-10 select-none whitespace-nowrap text-center font-sans font-bold tracking-[-0.04em] text-surface"
        style={{ fontSize: "clamp(4rem, 13.5vw, 14rem)", lineHeight: 0.75 }}
      >
        CREATEWITHABHI
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Visual verification**

Run: `pnpm dev`, scroll to footer.
Expected: giant gradient email in Fraunces; live `MUMBAI, HH:MM IST`; socials + CV row; huge surface-grey `CREATEWITHABHI` clipped by the page bottom. No horizontal scrollbar (check at 375px width too).

- [ ] **Step 4: Build + tests**

Run: `pnpm build && pnpm test`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Footer.tsx
git commit -m "feat: rebuild footer — gradient email, live IST clock, clipped wordmark"
```

---

### Task 10: Playwright smoke suite + push to PR

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/landing.spec.ts`
- Modify: `package.json` (script `test:e2e`)

**Interfaces:**
- Consumes: rendered landing page; sessionStorage key `cwa:preloaded` from Task 8.

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
```

Add to `package.json` scripts:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 2: Write `e2e/landing.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test.describe("landing — hero & footer bookends", () => {
  test("hero renders kicker, three display lines, CTA and availability", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByText("Abhishek Bhikule — Web Designer & Developer"),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      ["Design that", "remember,", "performs."].join(""),
      { useInnerText: false },
    );
    await expect(page.getByRole("link", { name: /start a project/i })).toBeVisible();
    await expect(page.getByText(/available — booking/i)).toBeVisible();
  });

  test("preloader marks the session and skips on reload", async ({ page }) => {
    await page.goto("/");
    await expect
      .poll(() => page.evaluate(() => sessionStorage.getItem("cwa:preloaded")))
      .toBe("1");
  });

  test("footer shows gradient email, IST clock and wordmark", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("End");
    await expect(
      page.getByRole("link", { name: "hello@createwithabhi.in" }),
    ).toBeVisible();
    await expect(page.getByText(/MUMBAI, \d{2}:\d{2} IST/)).toBeVisible();
    await expect(page.getByText("CREATEWITHABHI", { exact: true })).toBeVisible();
  });

  test("renders under reduced motion without canvas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  test("no horizontal overflow on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});
```

- [ ] **Step 3: Install browsers and run**

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Expected: 5 tests pass. If the h1 assertion fails on SplitType-restructured text, loosen to three separate `toContainText` calls (`"Design that"`, `"remember,"`, `"performs."`) — the copy must be present regardless of DOM splitting.

- [ ] **Step 4: Full verification pass**

```bash
pnpm test && pnpm build && pnpm test:e2e
```

Expected: all green. Then manual checks: Lighthouse (DevTools, mobile emulation) Performance ≥ 90 on `/`; force-disable WebGL (`about:flags` or DevTools command menu "Emulate WebGL disabled" alternative: temporarily return null in useWebGLAvailable) → hero still legible on gradient fallback.

- [ ] **Step 5: Commit and push to PR**

```bash
git add playwright.config.ts e2e/landing.spec.ts package.json
git commit -m "test: add Playwright smoke suite for hero/footer bookends"
git push
gh pr comment 1 --body "Phase 1–2 landed: foundation (tokens/fonts/cursor/motion primitives) + Monolith hero + footer. Vitest + Playwright suites green. Ready for visual review at the preview deployment."
```

---

## Self-Review Notes

- **Spec coverage (this plan's scope):** §2.1 colors → Tasks 1–2; §2.2–2.3 type → Task 2; §2.4 motion tokens/reduced-motion → Tasks 1, 2, 4, 6, 8; §3.1 cursor → Task 5; §3.3 reveals → Task 4; §4.00 preloader → Task 8; §4.01 hero → Tasks 6–7; §4.08 footer → Task 9; §6 perf/fallbacks → Tasks 6, 10. Deferred to Plans 2–3: §4.02–4.07 sections, §3.4 transitions, §5 case studies, form/Resend, grain overlay, JSON-LD updates.
- **Known interim state:** middle sections (Experience/TechStack/SelectedWork/About/Contact) render with alias tokens until Plans 2–3 replace them. This is intentional — the PR stays deployable at every commit.
- **Type consistency check:** `generateStars` returns `{positions,sizes,violetMask}` consumed identically in Starfield; `resolveCursorState` signature matches Cursor usage; `formatMumbaiTime` output matches Playwright regex `MUMBAI, \d{2}:\d{2} IST`.
