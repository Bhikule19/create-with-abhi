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
