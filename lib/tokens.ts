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
