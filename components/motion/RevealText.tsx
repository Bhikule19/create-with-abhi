"use client";

import { useEffect, useRef, type ReactNode, type RefCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { GSAP_EASE, DUR } from "@/lib/tokens";

type RevealTextTag = "h1" | "h2" | "h3" | "p" | "div" | "span";

interface RevealTextProps {
  as?: RevealTextTag;
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
  const setRef: RefCallback<HTMLElement> = (node) => {
    ref.current = node;
  };
  const delayRef = useRef(delay);

  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);

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
    const wraps: HTMLDivElement[] = [];
    lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.style.overflow = "hidden";
      wrap.style.display = "block";
      line.parentNode?.insertBefore(wrap, line);
      wrap.appendChild(line);
      wraps.push(wrap);
    });

    const tween = gsap.fromTo(
      lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: DUR.base,
        ease: GSAP_EASE.outExpo,
        stagger: 0.1,
        delay: delayRef.current,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      wraps.forEach((wrap) => {
        wrap.replaceWith(...wrap.childNodes);
      });
      split.revert();
    };
  }, []);

  return (
    <Tag ref={setRef} className={className} style={{ opacity: 1 }}>
      {children}
    </Tag>
  );
}
