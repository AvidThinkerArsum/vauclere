import type { CarId, CarProps } from "./types";

/** Hex colour helpers. Outputs are rounded hex so server and client render identical strings. */
function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}
function hex(r: number, g: number, b: number) {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
export function mix(a: string, b: string, t: number) {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return hex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}
/** amt > 0 toward white, amt < 0 toward black. */
export function tone(c: string, amt: number) {
  return amt >= 0 ? mix(c, "#ffffff", amt) : mix(c, "#000000", -amt);
}
/** Perceived lightness 0..1, used to keep highlights believable on very dark or very light paint. */
export function luma(c: string) {
  const [r, g, b] = parse(c);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export type Paint = { body: string; body2: string; interior: string };

/** Factory colours. Car A: sage over cream with an olive cabin. Car B: red over silver with a white cabin. */
export const DEFAULT_PAINT: Record<CarId, Paint> = {
  a: { body: "#A7B39C", body2: "#E7E6DE", interior: "#6F7A4B" },
  b: { body: "#C8462B", body2: "#C9CBCD", interior: "#ECE8E3" },
};

export function paintFor(id: CarId, paint: CarProps["paint"]): Paint {
  const o = paint?.[id];
  const d = DEFAULT_PAINT[id];
  return { body: o?.body ?? d.body, body2: o?.body2 ?? d.body2, interior: o?.interior ?? d.interior };
}

/** Fixed materials shared by both cars. */
export const MAT = {
  tyre: "#17181a",
  tyreHi: "#2c2e31",
  rubber: "#0e0f10",
  chassis: "#2a2c2f",
  chassisDark: "#141517",
  alu: "#b9bdc1",
  chrome: "#e9ecee",
  glassDark: "#18232a",
  glassMid: "#3d4f58",
  glassHi: "#9fb4bd",
  lens: "#f4f6f7",
  tail: "#b01c18",
  tailHi: "#ff6a55",
  amber: "#e59a3a",
} as const;
