"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const POOL_SIZE = 12;
const DIST_THRESHOLD = 80; // px

type Props = {
  images: string[];
  /** Container ref the trail listens within. */
  containerRef: React.RefObject<HTMLElement | null>;
};

/**
 * Pool of N hidden images. On mousemove inside `containerRef` (throttled by
 * distance), the next image animates from cursor pos with scale/opacity.
 */
export function ImageTrail({ images, containerRef }: Props) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const cursor = useRef({ x: 0, y: 0, last: { x: -9999, y: -9999 } });
  const idx = useRef(0);
  const enabled = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      enabled.current = false;
      return;
    }
    if (window.matchMedia("(hover: none)").matches) {
      enabled.current = false;
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (!enabled.current) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursor.current.x = x;
      cursor.current.y = y;
      const dx = x - cursor.current.last.x;
      const dy = y - cursor.current.last.y;
      if (Math.hypot(dx, dy) < DIST_THRESHOLD) return;
      cursor.current.last = { x, y };
      placeNext(x, y);
    };

    const placeNext = (x: number, y: number) => {
      const node = refs.current[idx.current];
      idx.current = (idx.current + 1) % POOL_SIZE;
      if (!node) return;
      gsap.killTweensOf(node);
      gsap.set(node, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        scale: 0.6,
        opacity: 0,
        rotate: gsap.utils.random(-6, 6),
      });
      gsap
        .timeline()
        .to(node, {
          scale: 1,
          opacity: 0.92,
          duration: 0.45,
          ease: "power3.out",
        })
        .to(node, {
          opacity: 0,
          scale: 0.85,
          duration: 0.7,
          ease: "power2.in",
        }, "+=0.05");
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: POOL_SIZE }).map((_, i) => {
        const src = images[i % images.length];
        return (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="absolute left-0 top-0 opacity-0 will-change-transform"
            style={{ width: 200, height: 260 }}
          >
            <div className="overflow-hidden rounded-md shadow-[0_18px_36px_-18px_rgba(0,0,0,0.45)]">
              <Image
                src={src}
                alt=""
                width={200}
                height={260}
                className="h-[260px] w-[200px] object-cover"
                unoptimized
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
