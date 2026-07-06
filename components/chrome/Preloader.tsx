"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { GSAP_EASE } from "@/lib/tokens";

const SESSION_KEY = "cwa:preloaded";

const subscribe = () => () => {};
const getServerSnapshot = () => false;
/**
 * Whether the preloader should run: sessionStorage lacks the key AND
 * reduced-motion is off. Computed synchronously on the client via
 * useSyncExternalStore (mirrors the pattern in Cursor.tsx / HeroScene.tsx)
 * instead of a synchronous `setShow(true)` inside useEffect, which trips
 * this repo's `react-hooks/set-state-in-effect` lint rule.
 */
const getClientSnapshot = () => {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/** Mono counter 0→100 (~1.6s) then curtain-lift into the hero. Once per session. */
export function Preloader() {
  const shouldShow = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const overlay = useRef<HTMLDivElement>(null);
  const show = shouldShow && !done;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced motion (or a second mount after already shown): mark the
    // session as preloaded without ever rendering the overlay.
    if (!shouldShow) {
      if (sessionStorage.getItem(SESSION_KEY) !== "1") {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
      return;
    }

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setDone(true);
      },
    });
    tl.to(counter, {
      value: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.value)),
    });
    tl.to(
      overlay.current,
      {
        yPercent: -100,
        duration: 0.7,
        ease: GSAP_EASE.outExpo,
      },
      "-=0.4",
    );

    return () => {
      tl.kill();
    };
  }, [shouldShow]);

  // Lock scroll behind the preloader while it's showing.
  useEffect(() => {
    if (!show) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[300] flex items-end justify-between bg-stage p-8"
      aria-hidden
    >
      <span className="font-sans text-2xl font-bold tracking-tight text-ink">
        CREATEWITHABHI<span className="text-brass">®</span>
      </span>
      <span className="label-mono text-ink-muted">{count}%</span>
    </div>
  );
}
