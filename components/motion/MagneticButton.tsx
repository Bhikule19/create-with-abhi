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
