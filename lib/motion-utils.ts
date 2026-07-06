/** Offset pulling an element toward the cursor. Pure — used by MagneticButton. */
export function computeMagnetOffset(
  mouseX: number,
  mouseY: number,
  rect: { left: number; top: number; width: number; height: number },
  strength = 0.3,
): { x: number; y: number } {
  const dx = mouseX - (rect.left + rect.width / 2);
  const dy = mouseY - (rect.top + rect.height / 2);
  return { x: dx * strength, y: dy * strength };
}

const IST_OFFSET_MINUTES = 5.5 * 60;

/** Live footer clock — always IST regardless of visitor timezone. */
export function formatMumbaiTime(date: Date): string {
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const istMinutes = (utcMinutes + IST_OFFSET_MINUTES) % (24 * 60);
  const hh = String(Math.floor(istMinutes / 60)).padStart(2, "0");
  const mm = String(istMinutes % 60).padStart(2, "0");
  return `MUMBAI, ${hh}:${mm} IST`;
}

/** Deterministic PRNG — stable star fields across renders and tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface StarField {
  positions: Float32Array;
  sizes: Float32Array;
  violetMask: Float32Array;
}

/**
 * Star attribute buffers for the hero scene.
 * positions: xyz in [-1,1] (scene scales up), sizes in [0.3,1.9],
 * violetMask: 1.0 for the ~25% deepest stars (tinted violet in shader).
 */
export function generateStars(count: number, seed = 2026): StarField {
  const rnd = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const violetMask = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const z = rnd() * 2 - 1;
    positions[i * 3] = rnd() * 2 - 1;
    positions[i * 3 + 1] = rnd() * 2 - 1;
    positions[i * 3 + 2] = z;
    sizes[i] = 0.3 + rnd() * 1.6;
    violetMask[i] = z < -0.5 ? 1 : 0; // deepest quarter of the box
  }

  return { positions, sizes, violetMask };
}
