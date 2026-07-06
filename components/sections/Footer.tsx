"use client";

import { useSyncExternalStore } from "react";
import { formatMumbaiTime } from "@/lib/motion-utils";
import { RESUME_FILENAME, RESUME_HREF, socials } from "@/lib/socials";

const EMAIL = "hello@createwithabhi.in";
const CLOCK_TICK_MS = 30_000;

// Live IST clock via useSyncExternalStore (mirrors Cursor.tsx / Preloader.tsx):
// this repo's `react-hooks/set-state-in-effect` lint rule forbids calling a
// setState-triggering function synchronously inside useEffect (the brief's
// `tick(); setInterval(tick, ...)` pattern). useSyncExternalStore sidesteps
// that entirely — the snapshot is a string primitive, so re-render only
// happens when the formatted time actually changes, and the interval is the
// subscription's own concern rather than an effect-body setState call.
const subscribe = (notify: () => void) => {
  const id = setInterval(notify, CLOCK_TICK_MS);
  return () => clearInterval(id);
};
const getSnapshot = () => formatMumbaiTime(new Date());
const getServerSnapshot = () => "";

export function Footer() {
  const clock = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="transition-colors hover:text-brass"
            >
              {s.label}
            </a>
          ))}
          <a
            href={RESUME_HREF}
            download={RESUME_FILENAME}
            className="transition-colors hover:text-brass"
          >
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
