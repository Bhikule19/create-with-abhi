"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { Starfield } from "@/components/experience/Starfield";
import { STAR_COUNT_DESKTOP, STAR_COUNT_MOBILE } from "@/lib/tokens";

let webglSupport: boolean | null = null;

/** Probes WebGL support at most once per page lifetime and caches the result.
 *  Explicitly releases the probe context so it doesn't leak a GPU resource. */
function probeWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    webglSupport = Boolean(gl);
  } catch {
    webglSupport = false;
  }
  return webglSupport;
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
  const webgl = typeof window === "undefined" ? false : probeWebGL();
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
