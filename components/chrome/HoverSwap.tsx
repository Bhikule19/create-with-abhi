"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

/**
 * Two-stack label flip primitive.
 * On hover, the primary span slides up and the alt slides in from below.
 */
export function HoverSwap({
  primary,
  alt,
  className = "",
  as = "span",
}: {
  primary: ReactNode;
  alt: ReactNode;
  className?: string;
  as?: "span" | "div";
}) {
  const Wrapper = motion[as];
  return (
    <Wrapper
      initial="rest"
      whileHover="alt"
      animate="rest"
      className={`relative inline-block overflow-hidden align-baseline ${className}`}
    >
      <motion.span
        className="block"
        variants={{
          rest: { y: "0%" },
          alt: { y: "-110%" },
        }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
      >
        {primary}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 block"
        variants={{
          rest: { y: "110%" },
          alt: { y: "0%" },
        }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
      >
        {alt}
      </motion.span>
    </Wrapper>
  );
}
