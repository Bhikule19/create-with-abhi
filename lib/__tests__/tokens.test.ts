import { describe, it, expect } from "vitest";
import { COLORS, EASE, DUR, STAR_COUNT_DESKTOP, STAR_COUNT_MOBILE } from "@/lib/tokens";

describe("design tokens", () => {
  it("defines the spec palette exactly", () => {
    expect(COLORS.stage).toBe("#0A0A0B");
    expect(COLORS.surface).toBe("#141416");
    expect(COLORS.line).toBe("#2A2A2E");
    expect(COLORS.inkMuted).toBe("#8A877F");
    expect(COLORS.ink).toBe("#E8E6E1");
    expect(COLORS.brass).toBe("#D4A24E");
    expect(COLORS.brassHover).toBe("#E6B96A");
    expect(COLORS.violet).toBe("#8B6FE8");
  });

  it("never uses pure black or white", () => {
    const values = Object.values(COLORS).map((c) => c.toLowerCase());
    expect(values).not.toContain("#000000");
    expect(values).not.toContain("#ffffff");
  });

  it("defines house easing and duration tokens", () => {
    expect(EASE.outExpo).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
    expect(EASE.inOut).toBe("cubic-bezier(0.65, 0, 0.35, 1)");
    expect(DUR.fast).toBe(0.3);
    expect(DUR.base).toBe(0.9);
    expect(DUR.slow).toBe(1.4);
  });

  it("caps star counts per performance contract", () => {
    expect(STAR_COUNT_DESKTOP).toBeLessThanOrEqual(3000);
    expect(STAR_COUNT_MOBILE).toBeLessThanOrEqual(1000);
  });
});
