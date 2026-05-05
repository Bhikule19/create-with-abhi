"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import SplitType from "split-type";

const STORAGE_KEY = "preloaded-2026-05-04";

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) !== "1";
};

export function Preloader() {
  const reduced = useReducedMotion();
  const lineARef = useRef<HTMLSpanElement>(null);
  const lineBRef = useRef<HTMLSpanElement>(null);

  // Whether the current session has not yet seen the preloader. Computed
  // synchronously from sessionStorage on the client, false on the server —
  // avoids the SSR/CSR setState-in-effect bridge.
  const shouldShow = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [done, setDone] = useState(false);
  const visible = shouldShow && !done;

  useEffect(() => {
    if (!visible) return;

    sessionStorage.setItem(STORAGE_KEY, "1");

    if (reduced) {
      const t = window.setTimeout(() => setDone(true), 600);
      return () => window.clearTimeout(t);
    }

    const a = lineARef.current;
    const b = lineBRef.current;
    if (!a || !b) return;

    document.body.style.overflow = "hidden";

    const splitA = new SplitType(a, { types: "chars" });
    const splitB = new SplitType(b, { types: "chars" });

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        document.body.style.overflow = "";
      },
    });

    tl.set([splitA.chars, splitB.chars], { yPercent: 105, opacity: 0 })
      .to(splitA.chars, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.022,
        duration: 0.7,
        ease: "power3.out",
      })
      .to(
        splitB.chars,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.018,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.35",
      )
      .to({}, { duration: 0.55 })
      .to([splitA.chars, splitB.chars], {
        yPercent: -105,
        opacity: 0,
        stagger: 0.012,
        duration: 0.45,
        ease: "power3.in",
      });

    return () => {
      tl.kill();
      splitA.revert();
      splitB.revert();
      document.body.style.overflow = "";
    };
  }, [visible, reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[14000] flex flex-col items-center justify-center gap-5 bg-bg text-ink"
        >
          <span
            ref={lineARef}
            className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight overflow-hidden"
          >
            CREATE · WITH · ABHI
          </span>
          <span
            ref={lineBRef}
            className="font-mono text-xs uppercase tracking-[0.3em] text-ink-dim overflow-hidden"
          >
            BUILDING FOR THE WEB · [ SCROLL ]
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
