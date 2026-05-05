"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Brand mark — a hard hash glyph that ticks (1-frame scale-and-fade pulse)
 * every few seconds. Replaces the rotating-asterisk mark.
 *
 * Component name kept for import-site stability.
 */
export function RotatingMark({
  className = "",
  duration = 6,
}: {
  className?: string;
  /** Seconds between ticks. */
  duration?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`inline-block leading-none ${className}`}
      animate={
        reduced
          ? undefined
          : {
              opacity: [1, 0.35, 1, 1, 1],
              scale: [1, 1.18, 1, 1, 1],
            }
      }
      transition={
        reduced
          ? undefined
          : {
              duration,
              ease: [0.65, 0, 0.35, 1],
              repeat: Infinity,
              times: [0, 0.06, 0.12, 0.5, 1],
            }
      }
    >
      ⌗
    </motion.span>
  );
}
