/** Tiny colour helpers (hex in, hex out, always rounded so SSR and client agree). */

function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

function toHex(r: number, g: number, b: number) {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** amt > 0 mixes toward white, amt < 0 toward black (−1…1). */
export function shade(hex: string, amt: number) {
  const [r, g, b] = parse(hex);
  const t = amt < 0 ? 0 : 255;
  const k = Math.abs(amt);
  return toHex(r + (t - r) * k, g + (t - g) * k, b + (t - b) * k);
}

/** Linear mix between two hex colours. */
export function mix(a: string, b: string, t: number) {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}
