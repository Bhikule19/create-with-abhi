"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * 2px Volt line that fills left-to-right as the page scrolls.
 * Sits above the TopBar so it remains visible behind the glass panel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 36,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[150] h-[2px] origin-left bg-accent shadow-[0_0_12px_var(--accent-glow)]"
    />
  );
}
