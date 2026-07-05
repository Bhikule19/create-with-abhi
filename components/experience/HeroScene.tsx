"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { Starfield } from "@/components/experience/Starfield";
import { STAR_COUNT_DESKTOP, STAR_COUNT_MOBILE } from "@/lib/tokens";

const noopSubscribe = () => () => {};

function getWebGLSnapshot(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

const subscribeReducedMotion = (notify: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const subscribeMobile = (notify: () => void) => {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const getMobileSnapshot = () =>
  window.matchMedia("(max-width: 767px)").matches;

/** Full-bleed starfield layer behind hero content. Renders nothing without WebGL
 *  or under reduced motion — the CSS gradient fallback behind it carries the look. */
export function HeroScene() {
  const webgl = useSyncExternalStore(
    noopSubscribe,
    getWebGLSnapshot,
    () => false,
  );
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => true,
  );
  const mobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    () => false,
  );

  if (!webgl || reduced) return null;

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 16], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Starfield count={mobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP} />
      </Canvas>
    </div>
  );
}
