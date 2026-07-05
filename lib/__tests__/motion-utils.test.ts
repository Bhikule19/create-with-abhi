import { describe, it, expect } from "vitest";
import {
  computeMagnetOffset,
  formatMumbaiTime,
  mulberry32,
  generateStars,
} from "@/lib/motion-utils";

describe("computeMagnetOffset", () => {
  const rect = { left: 100, top: 100, width: 200, height: 60 };

  it("returns zero offset at element centre", () => {
    expect(computeMagnetOffset(200, 130, rect)).toEqual({ x: 0, y: 0 });
  });

  it("pulls toward the cursor scaled by strength", () => {
    // cursor 50px right of centre, default strength 0.3
    const { x, y } = computeMagnetOffset(250, 130, rect);
    expect(x).toBeCloseTo(15);
    expect(y).toBeCloseTo(0);
  });

  it("respects custom strength", () => {
    const { x } = computeMagnetOffset(250, 130, rect, 0.5);
    expect(x).toBeCloseTo(25);
  });
});

describe("formatMumbaiTime", () => {
  it("formats a UTC date as IST (UTC+5:30)", () => {
    // 09:02 UTC === 14:32 IST
    const d = new Date(Date.UTC(2026, 6, 5, 9, 2));
    expect(formatMumbaiTime(d)).toBe("MUMBAI, 14:32 IST");
  });

  it("pads minutes and hours", () => {
    // 18:35 UTC === 00:05 IST next day
    const d = new Date(Date.UTC(2026, 6, 5, 18, 35));
    expect(formatMumbaiTime(d)).toBe("MUMBAI, 00:05 IST");
  });
});

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces values in [0, 1)", () => {
    const rnd = mulberry32(7);
    const first100 = Array.from({ length: 100 }, () => rnd());
    expect(first100.every((v) => v >= 0 && v < 1)).toBe(true);
  });
});

describe("generateStars", () => {
  it("returns typed arrays sized to count", () => {
    const { positions, sizes, violetMask } = generateStars(100, 1);
    expect(positions).toHaveLength(300); // xyz per star
    expect(sizes).toHaveLength(100);
    expect(violetMask).toHaveLength(100);
  });

  it("is deterministic for the same seed", () => {
    const a = generateStars(50, 9);
    const b = generateStars(50, 9);
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
  });

  it("marks roughly a quarter of stars violet", () => {
    const { violetMask } = generateStars(1000, 3);
    const violets = Array.from(violetMask).filter((v) => v === 1).length;
    expect(violets).toBeGreaterThan(150);
    expect(violets).toBeLessThan(350);
  });

  it("keeps positions inside the unit box", () => {
    const { positions } = generateStars(200, 5);
    expect(Array.from(positions).every((p) => p >= -1 && p <= 1)).toBe(true);
  });
});
