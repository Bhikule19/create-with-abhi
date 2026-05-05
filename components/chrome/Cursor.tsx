"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

type CursorState = "default" | "view" | "link";

const subscribeHover = (notify: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const getHoverSnapshot = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const getHoverServerSnapshot = () => false;

export function Cursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 240, damping: 24, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 240, damping: 24, mass: 0.35 });
  const [state, setState] = useState<CursorState>("default");

  const canHover = useSyncExternalStore(
    subscribeHover,
    getHoverSnapshot,
    getHoverServerSnapshot,
  );
  const enabled = canHover && !reduced;

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const cursorAttr = target.closest<HTMLElement>("[data-cursor]");
      const next =
        (cursorAttr?.dataset.cursor as CursorState | undefined) ?? "default";
      setState(next);
    };
    window.addEventListener("mousemove", onMove);
    document.documentElement.classList.add("cursor-none-root");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isView = state === "view";
  const isLink = state === "link";

  return (
    <>
      <style jsx global>{`
        .cursor-none-root,
        .cursor-none-root body,
        .cursor-none-root a,
        .cursor-none-root button {
          cursor: none !important;
        }
        [data-native-cursor],
        [data-native-cursor] * {
          cursor: auto !important;
        }
      `}</style>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-display font-bold uppercase"
          animate={{
            width: isView ? 88 : isLink ? 36 : 14,
            height: isView ? 88 : isLink ? 36 : 14,
            backgroundColor: isView
              ? "var(--accent)"
              : isLink
                ? "rgba(198, 255, 0, 0.18)"
                : "var(--ink)",
            borderColor: isLink ? "var(--accent)" : "rgba(198,255,0,0)",
            borderWidth: isLink ? 1.5 : 0,
            color: "var(--bg)",
            boxShadow: isView
              ? "0 0 40px var(--accent-glow)"
              : "0 0 0px transparent",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.4 }}
          style={{ borderStyle: "solid" }}
        >
          <AnimatePresence>
            {isView && (
              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="text-[10px] tracking-[0.18em]"
              >
                VIEW
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
