import type { ReactNode } from "react";
import type { CarId } from "./types";
import { MAT, tone, type Paint } from "./palette";

/** Everything a piece of artwork needs: unique id prefix, which car, and its paint. */
/** `flip` is set while drawing a left-side panel (artwork mirrored), so global lighting stays put. */
export type Ctx = { uid: string; car: CarId; p: Paint; outline: string; flip?: boolean };

/** id of a per-car definition (gradient, clip). */
export const gid = (c: Ctx, name: string) => `${c.uid}-${c.car}-${name}`;
export const url = (c: Ctx, name: string) => `url(#${gid(c, name)})`;

/** Lengthwise extent of each car's body, used for the nose/tail fall-off gradient. */
const SPAN: Record<CarId, [number, number]> = { a: [-376, 378], b: [-416, 412] };

/** Lateral lighting for a colour: the body seen from straight above, lit by a large overhead softbox. */
function lateral(col: string) {
  const stops: [number, number][] = [
    [-182, -0.58],
    [-170, -0.42],
    [-160, -0.2],
    [-150, 0.06],
    [-140, 0.26],
    [-128, 0.13],
    [-108, 0.0],
    [-78, -0.08],
    [-44, 0.0],
    [-14, 0.1],
    [0, 0.12],
  ];
  const all = [...stops, ...stops.slice(0, -1).reverse().map(([y, t]) => [-y, t] as [number, number])];
  return all.map(([y, t], i) => <stop key={i} offset={((y + 182) / 364).toFixed(4)} stopColor={tone(col, t)} />);
}

/** Side elevation of a panel (door / quarter skins), laid flat: offset 0 = waist/shoulder, 1 = sill. */
function sideStops(col: string) {
  const s: [number, number][] = [
    [0, 0.36],
    [0.06, 0.16],
    [0.16, -0.06],
    [0.34, 0.06],
    [0.44, 0.3],
    [0.475, 0.42],
    [0.5, -0.24],
    [0.6, -0.12],
    [0.85, -0.28],
    [1, -0.46],
  ];
  return s.map(([o, t], i) => <stop key={i} offset={o} stopColor={tone(col, t)} />);
}

/** Per-car gradients. Rendered once per Car instance inside a zero-size <svg>. */
export function CarDefs({ c }: { c: Ctx }) {
  const { body, body2, interior } = c.p;
  const [x0, x1] = SPAN[c.car];
  const id = (n: string) => gid(c, n);
  return (
    <>
      <linearGradient id={id("lat")} gradientUnits="userSpaceOnUse" x1="0" y1="-182" x2="0" y2="182">
        {lateral(body)}
      </linearGradient>
      <linearGradient id={id("lat2")} gradientUnits="userSpaceOnUse" x1="0" y1="-182" x2="0" y2="182">
        {lateral(body2)}
      </linearGradient>
      <linearGradient id={id("fall")} gradientUnits="userSpaceOnUse" x1={x0} y1="0" x2={x1} y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.5" />
        <stop offset="0.035" stopColor="#000" stopOpacity="0.22" />
        <stop offset="0.1" stopColor="#000" stopOpacity="0" />
        <stop offset="0.9" stopColor="#000" stopOpacity="0" />
        <stop offset="0.965" stopColor="#000" stopOpacity="0.22" />
        <stop offset="1" stopColor="#000" stopOpacity="0.5" />
      </linearGradient>
      {/* skins (door / quarter side elevation laid flat): bounding box y=1 is the shoulder, y=0 the sill */}
      <linearGradient id={id("side")} x1="0" y1="1" x2="0" y2="0">
        {sideStops(body)}
      </linearGradient>
      <linearGradient id={id("side2")} x1="0" y1="1" x2="0" y2="0">
        {sideStops(body2)}
      </linearGradient>
      <radialGradient id={id("blob")} cx="0.38" cy="0.36" r="0.75">
        <stop offset="0" stopColor={tone(body, 0.42)} />
        <stop offset="0.45" stopColor={tone(body, 0.05)} />
        <stop offset="1" stopColor={tone(body, -0.4)} />
      </radialGradient>
      <radialGradient id={id("blob2")} cx="0.38" cy="0.36" r="0.75">
        <stop offset="0" stopColor={tone(body2, 0.42)} />
        <stop offset="0.45" stopColor={tone(body2, 0.05)} />
        <stop offset="1" stopColor={tone(body2, -0.4)} />
      </radialGradient>
      <linearGradient id={id("int")} gradientUnits="userSpaceOnUse" x1="0" y1="-130" x2="0" y2="130">
        <stop offset="0" stopColor={tone(interior, -0.55)} />
        <stop offset="0.5" stopColor={tone(interior, -0.25)} />
        <stop offset="1" stopColor={tone(interior, -0.55)} />
      </linearGradient>
      <radialGradient id={id("seat")} cx="0.45" cy="0.5" r="0.6">
        <stop offset="0" stopColor={tone(interior, 0.18)} />
        <stop offset="0.7" stopColor={tone(interior, 0.02)} />
        <stop offset="1" stopColor={tone(interior, -0.18)} />
      </radialGradient>
      <linearGradient id={id("bolster")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tone(interior, -0.38)} />
        <stop offset="0.5" stopColor={tone(interior, -0.12)} />
        <stop offset="1" stopColor={tone(interior, -0.38)} />
      </linearGradient>
    </>
  );
}

/** Materials shared by both cars (one copy per Car instance). */
export function SharedDefs({ uid }: { uid: string }) {
  const id = (n: string) => `${uid}-${n}`;
  return (
    <>
      <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={MAT.glassMid} />
        <stop offset="0.45" stopColor={MAT.glassDark} />
        <stop offset="1" stopColor="#0d1418" />
      </linearGradient>
      <linearGradient id={id("chrome")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.3" stopColor="#c9ced2" />
        <stop offset="0.5" stopColor="#6f767c" />
        <stop offset="0.7" stopColor="#d9dde0" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id={id("alu")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dfe3e6" />
        <stop offset="0.5" stopColor="#9aa1a7" />
        <stop offset="1" stopColor="#5d646a" />
      </linearGradient>
      <linearGradient id={id("tyre")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#060607" />
        <stop offset="0.16" stopColor="#1d1e20" />
        <stop offset="0.5" stopColor="#2a2b2e" />
        <stop offset="0.84" stopColor="#1d1e20" />
        <stop offset="1" stopColor="#060607" />
      </linearGradient>
      <radialGradient id={id("lens")} cx="0.42" cy="0.4" r="0.62">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.35" stopColor="#eef3f6" />
        <stop offset="0.75" stopColor="#b8c3ca" />
        <stop offset="1" stopColor="#6c7880" />
      </radialGradient>
      <linearGradient id={id("tail")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff7a66" />
        <stop offset="0.4" stopColor={MAT.tail} />
        <stop offset="1" stopColor="#5a0b09" />
      </linearGradient>
      <radialGradient id={id("spec")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={id("streak")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={id("streakX")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.25" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="0.75" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={id("refl")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={id("vignette")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.6" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <pattern id={id("carbon")} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="#1a1b1d" />
        <rect width="3" height="3" fill="#2b2d30" />
        <rect x="3" y="3" width="3" height="3" fill="#2b2d30" />
      </pattern>
      <filter id={id("blur2")} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <filter id={id("blur5")} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id={id("blur10")} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      {/* key light from the upper left, across the whole car; a mirrored copy for left-side panels */}
      <linearGradient id={id("key")} gradientUnits="userSpaceOnUse" x1="-420" y1="-190" x2="420" y2="190">
        <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.6" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.16" />
      </linearGradient>
      <linearGradient id={id("keyF")} gradientUnits="userSpaceOnUse" x1="-420" y1="190" x2="420" y2="-190">
        <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.6" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.16" />
      </linearGradient>
    </>
  );
}

export const sid = (uid: string, name: string) => `url(#${uid}-${name})`;

/**
 * A painted body panel: colour field + nose/tail fall-off + a darker shut-line edge.
 * `children` are highlights, clipped to the panel.
 */
export function Paintwork({
  c,
  d,
  name,
  two = false,
  children,
  edge = 0.55,
  evenodd = false,
  blob = false,
}: {
  c: Ctx;
  d: string;
  name: string;
  two?: boolean;
  children?: ReactNode;
  edge?: number;
  /** cut-outs (e.g. a window) drawn as inner sub-paths */
  evenodd?: boolean;
  /** small detached parts (mirrors): shaded as a rounded blob instead of by the body's lighting field */
  blob?: boolean;
}) {
  const clip = gid(c, `clip-${name}`);
  const col = two ? c.p.body2 : c.p.body;
  const rule = evenodd ? "evenodd" : "nonzero";
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={d} clipRule={rule} />
        </clipPath>
      </defs>
      <path d={d} fill={url(c, blob ? (two ? "blob2" : "blob") : two ? "lat2" : "lat")} fillRule={rule} />
      {!blob && <path d={d} fill={url(c, "fall")} fillRule={rule} />}
      <path d={d} fill={sid(c.uid, c.flip ? "keyF" : "key")} fillRule={rule} />
      <g clipPath={`url(#${clip})`}>
        {/* rolled edge where the body falls away from the camera: dark lip, bright flank, soft shade */}
        <path d={c.outline} fill="none" stroke={tone(col, -0.45)} strokeOpacity="0.42" strokeWidth="38" filter={sid(c.uid, "blur5")} />
        <path d={c.outline} fill="none" stroke={tone(col, 0.62)} strokeOpacity="0.8" strokeWidth="22" filter={sid(c.uid, "blur2")} />
        <path d={c.outline} fill="none" stroke={tone(col, -0.62)} strokeOpacity="0.95" strokeWidth="6" filter={sid(c.uid, "blur2")} />
        {children}
      </g>
      <path d={d} fill="none" stroke={tone(col, -0.62)} strokeOpacity={edge} strokeWidth="1.3" strokeLinejoin="round" />
    </g>
  );
}

/** Soft volume shading: a heavily blurred stroke (valleys, occlusion) or fill (crowns, hot spots). */
export function Soft({
  c,
  d,
  col = "#000",
  o = 0.25,
  w,
  blur = 10,
}: {
  c: Ctx;
  d: string;
  col?: string;
  o?: number;
  /** stroke width; omit to fill the shape instead */
  w?: number;
  blur?: 2 | 5 | 10;
}) {
  const f = sid(c.uid, `blur${blur}`);
  return w ? (
    <path d={d} fill="none" stroke={col} strokeOpacity={o} strokeWidth={w} strokeLinecap="round" filter={f} />
  ) : (
    <path d={d} fill={col} fillOpacity={o} filter={f} />
  );
}

/** A soft white specular streak along a path (stroke-based, so it can follow curves). */
export function Streak({ d, w = 4, o = 0.7 }: { d: string; w?: number; o?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke="#fff" strokeOpacity={o * 0.35} strokeWidth={w * 2.6} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#fff" strokeOpacity={o} strokeWidth={w} strokeLinecap="round" />
    </>
  );
}

/** Dashed stitching line. */
export function Stitch({ d, col, o = 0.8, w = 0.9 }: { d: string; col: string; o?: number; w?: number }) {
  return <path d={d} fill="none" stroke={col} strokeOpacity={o} strokeWidth={w} strokeDasharray="2.4 2" strokeLinecap="round" />;
}
