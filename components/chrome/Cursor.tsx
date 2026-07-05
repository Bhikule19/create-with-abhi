"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { resolveCursorState, type CursorState } from "@/lib/cursor-state";

const subscribeHover = (notify: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const getHoverSnapshot = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getHoverServerSnapshot = () => false;

/** Ring cursor: 20px difference-blend ring → 72px brass lens with VIEW label. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const enabled = useSyncExternalStore(
    subscribeHover,
    getHoverSnapshot,
    getHoverServerSnapshot,
  );

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      setState(resolveCursorState(e.target));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  const size = state === "view" ? 72 : state === "link" ? 14 : 20;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ transform: "translate(-100px, -100px)" }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          border: state === "view" ? "none" : "1.5px solid var(--ink)",
          background: state === "view" ? "var(--brass)" : "transparent",
          mixBlendMode: state === "view" ? "normal" : "difference",
          transition:
            "width var(--dur-fast) var(--ease-out-expo), height var(--dur-fast) var(--ease-out-expo), background var(--dur-fast)",
        }}
      >
        {state === "view" && (
          <span className="label-mono" style={{ color: "var(--stage)", fontSize: 9 }}>
            VIEW
          </span>
        )}
      </div>
    </div>
  );
}
