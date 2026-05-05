"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

/**
 * A link with a left-to-right underline grow on hover.
 * Optional trailing arrow that translates 4px right on hover.
 */
export function HoverLink({
  href,
  children,
  arrow,
  className = "",
  external = false,
  onClick,
}: {
  href: string;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
      data-cursor="link"
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={`relative inline-flex items-baseline gap-2 ${className}`}
    >
      <span className="relative">
        {children}
        <motion.span
          aria-hidden
          variants={{
            rest: { scaleX: 0 },
            hover: { scaleX: 1 },
          }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left bg-current"
        />
      </span>
      {arrow && (
        <motion.span
          aria-hidden
          variants={{
            rest: { x: 0 },
            hover: { x: 4 },
          }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
        >
          →
        </motion.span>
      )}
    </motion.a>
  );
}
