"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RotatingMark } from "@/components/chrome/RotatingMark";
import { ImageTrail } from "@/components/motion/ImageTrail";
import { trailImages } from "@/lib/trail";

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

let registered = false;

export function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const wrap = parallaxRef.current;
    const section = sectionRef.current;
    if (!wrap || !section) return;

    const ctx = gsap.context(() => {
      gsap.to(wrap, {
        y: -60,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100vh] overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32"
    >
      {/* Radial Volt glow behind the name — low-opacity primary per spec */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] top-[40%] h-[60vh] w-[80vw] -translate-y-1/2 rounded-full opacity-[0.18] blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent), transparent 70%)",
        }}
      />

      {/* Subtle grid overlay for engineered feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <ImageTrail images={trailImages} containerRef={sectionRef} />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-10 px-4 lg:px-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          className="flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim"
        >
          <span className="h-px w-8 bg-accent" />
          <span>PORTFOLIO · 2024 — 2026</span>
        </motion.div>

        <div ref={parallaxRef}>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
            className="font-display font-bold leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 9.5rem)" }}
          >
            <span className="inline-flex items-baseline gap-3">
              <RotatingMark className="text-accent text-[0.45em]" />
              <span>Abhishek</span>
            </span>
            <br />
            <span>
              Bhikule<span className="text-accent">.</span>
            </span>
          </motion.h1>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
          className="flex max-w-[640px] flex-col gap-4"
        >
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim">
            FULL-STACK DEVELOPER · MUMBAI
          </p>
          <p className="font-sans text-lg leading-[1.6] text-ink lg:text-xl">
            I build for the web — products, plugins, and the occasional weekend
            experiment that turns into something I ship.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.3em] text-ink-dim"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span>SCROLL TO EXPLORE</span>
        </motion.div>
      </div>
    </section>
  );
}
