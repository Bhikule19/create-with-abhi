"use client";

import { useEffect, useRef, useState } from "react";
import { RotatingMark } from "@/components/chrome/RotatingMark";
import { socials } from "@/lib/socials";

const WORDS = ["CREATE", "WITH", "ABHI"];

/**
 * Measures viewport width and computes per-word font-size so each glyph row
 * spans 100vw exactly. Re-runs on resize.
 */
export function Footer() {
  const measureRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<number[]>([240, 240, 240]);

  useEffect(() => {
    const compute = () => {
      const probe = measureRef.current;
      if (!probe) return;
      const baseSize = 200;
      const vw = window.innerWidth;
      const next = WORDS.map((word) => {
        probe.textContent = word;
        const w = probe.getBoundingClientRect().width;
        if (w === 0) return baseSize;
        return Math.floor((vw / w) * baseSize);
      });
      setSizes(next);
    };
    compute();
    window.addEventListener("resize", compute);
    const t = setTimeout(compute, 200);
    return () => {
      window.removeEventListener("resize", compute);
      clearTimeout(t);
    };
  }, []);

  return (
    <footer className="mt-24 lg:mt-40">
      {/* Top half */}
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center lg:px-20">
          <div className="flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.25em] text-ink-dim">
            <RotatingMark className="text-accent text-base" />
            <span>Abhishek Bhikule · MMXXVI</span>
            <span className="ml-2 hidden items-center gap-2 sm:inline-flex">
              <span className="h-px w-6 bg-rule" />
              <span className="text-ink-dim">v1.0</span>
            </span>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-xs font-semibold uppercase tracking-[0.25em]">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-ink-dim transition-colors hover:text-accent"
                >
                  {s.label} <span className="text-ink-dim">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom half — giant stacked wordmark */}
      <div className="overflow-hidden">
        <div
          ref={measureRef}
          aria-hidden
          className="absolute -top-[9999px] left-0 font-display font-bold tracking-[-0.06em]"
          style={{ fontSize: 200 }}
        />
        {WORDS.map((word, i) => (
          <div
            key={word}
            className={`font-display font-bold leading-[0.84] tracking-[-0.06em] ${
              word === "ABHI" ? "text-accent" : "text-ink"
            }`}
            style={{ fontSize: sizes[i] }}
          >
            {word}
          </div>
        ))}
      </div>
    </footer>
  );
}
