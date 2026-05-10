"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { useMenu } from "./MenuProvider";
import { RESUME_FILENAME, RESUME_HREF, socials } from "@/lib/socials";

const anchors = [
  { label: "EXPERIENCE", href: "#experience" },
  { label: "STACK", href: "#stack" },
  { label: "WORK", href: "#work-stack" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

const EASE = [0.7, 0, 0.3, 1] as const;

const containerVariants: Variants = {
  closed: {
    clipPath: "inset(0% 0% 100% 100%)",
    transition: { duration: 0.4, ease: EASE },
  },
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.5,
      ease: EASE,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: 30 },
  open: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function MenuOverlay() {
  const { open, close } = useMenu();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstAnchorRef = useRef<HTMLAnchorElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Lock scroll, capture opener for focus restore, ESC + Tab trap.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    // Move focus into the menu on next tick (after animation has begun).
    const focusTimer = window.setTimeout(() => {
      firstAnchorRef.current?.focus();
    }, 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "";
      // Restore focus to the element that opened the menu.
      previouslyFocused.current?.focus();
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          variants={containerVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-bg px-6 pb-12 pt-8 lg:px-12"
        >
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-ink-dim">
            <span>Menu</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="cursor-pointer hover:text-accent transition-colors"
            >
              CLOSE ✕
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-col gap-2 lg:gap-4">
            {anchors.map((a, i) => (
              <motion.a
                key={a.href}
                ref={i === 0 ? firstAnchorRef : undefined}
                href={a.href}
                onClick={close}
                variants={itemVariants}
                className="block font-display text-[clamp(3rem,8vw,7rem)] font-medium leading-none tracking-tight text-ink hover:text-accent transition-colors"
              >
                {a.label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-dim"
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={close}
                className="hover:text-accent transition-colors"
              >
                {s.label}
              </a>
            ))}
            <a
              href={RESUME_HREF}
              download={RESUME_FILENAME}
              onClick={close}
              className="hover:text-accent transition-colors"
            >
              Resume ↓
            </a>
            <span className="ml-auto">ESC TO CLOSE</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
