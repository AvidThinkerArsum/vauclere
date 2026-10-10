"use client";

/**
 * The car, drawn from straight above as layered SVG (like a product render), in a 1000 × 600 box.
 *
 *  - `explode` 0 → 1: panels leave the car radially. Bonnet forward, rear deck back, wings out,
 *    doors unfold up and out like wings (their side skins appear), screen and lamps lift toward
 *    the camera (perspective makes them larger) and cast soft shadows. The interior stays put.
 *  - `morph` 0 → 1: every panel swaps from car A to car B, staggered panel by panel, so it reads
 *    best while exploded (explode 0 → 1 at morph 0, morph 0 → 1, then explode 1 → 0).
 *  - Both cars are drawn NOSE LEFT. To show car B nose-right, the page rotates the wrapper
 *    180° (e.g. rotate = morph × 180 on the element around <Car/>). Nothing in here rotates.
 *    Mid-turn (90°) the exploded car stands about 1.6× the box height, so give the wrapper
 *    room or scale it down a little while it turns.
 *  - The drawing letterboxes (contain) inside whatever box the className gives it; without a
 *    height it takes a 5:3 aspect ratio. Exploded panels (and their shadows) reach past the
 *    box edges, so the section around it should clip (overflow: hidden / clip).
 *  - `still` renders one assembled car with no motion (reduced motion); `paint` recolours
 *    body / body2 / interior per car. Named export `Car` and default export are the same.
 *  - CAR_ANCHORS (fractions of the box) mark nose / door / cockpit / tail / wheel on the
 *    exploded car A, for callouts.
 *
 * Per frame only CSS transforms and opacity change. Each panel is its own composited layer;
 * blurs (shadows, cockpit shading) are static SVG filters rasterised once.
 */

import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useId, type CSSProperties, type ReactNode } from "react";
import type { CarId, CarProps } from "./types";
import { PANELS, VB, type Art, type PanelDef } from "./geometry";
import { paintFor } from "./palette";
import { CarDefs, SharedDefs, type Ctx } from "./parts";
import { A, OUTLINE_A } from "./artA";
import { B, OUTLINE_B } from "./artB";

export { CAR_ASPECT, CAR_VIEWBOX, CAR_ANCHORS } from "./geometry";

const ART: Record<CarId, Art> = { a: A, b: B };
const SHADOW_PAD = 36;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const n2 = (v: number) => (Math.round(v * 100) / 100).toString();
const n3 = (v: number) => (Math.round(v * 1000) / 1000).toString();
/** viewBox units → CSS length (the stage defines --u as the size of one unit) */
const U = (v: number) => `calc(var(--u) * ${n2(v)})`;

type Side = 1 | -1; // -1 = right side (y < 0), 1 = left side (y > 0) or centred

function boxFor(def: PanelDef, side: Side, pad = 0): [number, number, number, number] {
  const [x0, y0, x1, y1] = def.box;
  const b: [number, number, number, number] = side === 1 && def.sided ? [x0, -y1, x1, -y0] : [x0, y0, x1, y1];
  return [b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad];
}

function boxStyle([x0, y0, x1, y1]: [number, number, number, number]): CSSProperties {
  return {
    position: "absolute",
    left: `${n2(((x0 - VB.x) / VB.w) * 100)}%`,
    top: `${n2(((y0 - VB.y) / VB.h) * 100)}%`,
    width: `${n2(((x1 - x0) / VB.w) * 100)}%`,
    height: `${n2(((y1 - y0) / VB.h) * 100)}%`,
  };
}

/** progress of one panel inside the explode timeline */
function prog(def: PanelDef, e: number) {
  return easeInOut(clamp01((e - def.t[0]) / (def.t[1] - def.t[0])));
}

function panelTransform(def: PanelDef, side: Side, box: number[], e: number, m: number, shadow: boolean) {
  if (!def.ex) return "none";
  const k = prog(def, e);
  const a = def.ex.a;
  const b = def.ex.b;
  const f = def.sided && side === 1 ? -1 : 1; // right-side values are authored; mirror for the left
  const dx = lerp(a.dx, b.dx, m) * k;
  const dy = lerp(a.dy, b.dy, m) * k * f;
  const rot = lerp(a.rot, b.rot, m) * k * f;
  const lift = lerp(a.lift, b.lift, m) * k;
  const tiltX = lerp(a.tiltX ?? 0, b.tiltX ?? 0, m) * k * f;
  const tiltY = lerp(a.tiltY ?? 0, b.tiltY ?? 0, m) * k;
  const px = lerp(a.pivot[0], b.pivot[0], m) - box[0];
  const py = lerp(a.pivot[1], b.pivot[1], m) * f - box[1];
  if (shadow) {
    // the shadow stays on the ground: no lift, offset away from the light, spreads a little
    const s = n3(1 + lift * 0.0008);
    return `translate(${U(dx + lift * 0.12)}, ${U(dy + lift * 0.22)}) translate(${U(px)}, ${U(py)}) rotate(${n2(rot)}deg) scale(${s}) translate(${U(-px)}, ${U(-py)})`;
  }
  return `translate3d(${U(dx)}, ${U(dy)}, ${U(lift)}) translate(${U(px)}, ${U(py)}) rotate(${n2(rot)}deg) rotateX(${n2(tiltX)}deg) rotateY(${n2(tiltY)}deg) translate(${U(-px)}, ${U(-py)})`;
}

/** cap / skin transforms of a door-style wing, for one car */
function wingTransforms(def: PanelDef, car: CarId, side: Side, box: number[], e: number) {
  const w = def.wing![car];
  const k = prog(def, e);
  const phi = ((w.phi * k) / 180) * Math.PI;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const sgn = side === 1 ? 1 : -1; // outward direction in y
  const hinge = w.hinge * (side === 1 ? -1 : 1) - box[1];
  const out = w.out * (side === 1 ? -1 : 1) - box[1];
  const capW = Math.abs(w.out - w.hinge);
  const cap = `translate(0, ${U(hinge)}) scaleY(${n3(Math.max(cos, 0.001))}) translate(0, ${U(-hinge)})`;
  const skin = `translate(0, ${U(-sgn * capW * (1 - cos))}) translate(0, ${U(out)}) scaleY(${n3(Math.max(sin, 0.001))}) translate(0, ${U(-out)})`;
  return { cap, skin, skinOpacity: clamp01(sin * 6) };
}

/** opacity of car A / car B artwork for a panel during the morph: B fades in on top, then A fades out under it */
function swapOpacity(def: PanelDef, m: number, car: CarId) {
  const w = 0.08;
  if (car === "b") return easeInOut(clamp01((m - (def.swap - w)) / w));
  return 1 - easeInOut(clamp01((m - def.swap) / w));
}

function Svg({ box, side, sided, children }: { box: number[]; side: Side; sided: boolean; children: ReactNode }) {
  const [x0, y0, x1, y1] = box;
  return (
    <svg
      viewBox={`${n2(x0)} ${n2(y0)} ${n2(x1 - x0)} ${n2(y1 - y0)}`}
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
      aria-hidden
    >
      {sided && side === 1 ? <g transform="scale(1 -1)">{children}</g> : children}
    </svg>
  );
}

function CarLayer({
  def,
  side,
  box,
  car,
  ctx,
  explode,
  morph,
  mode,
  uid,
}: {
  def: PanelDef;
  side: Side;
  box: number[];
  car: CarId;
  ctx: Ctx;
  explode: MotionValue<number>;
  morph: MotionValue<number>;
  mode: "art" | "shadow";
  uid: string;
}) {
  const art = ART[car][def.base];
  const c2 = def.sided && side === 1 ? { ...ctx, flip: true } : ctx;
  const opacity = useTransform(morph, (m) => swapOpacity(def, m, car));
  const capT = useTransform(explode, (e) => (def.wing ? wingTransforms(def, car, side, box, e).cap : "none"));
  const skinT = useTransform(explode, (e) => (def.wing ? wingTransforms(def, car, side, box, e).skin : "none"));
  const skinO = useTransform(explode, (e) => (def.wing ? wingTransforms(def, car, side, box, e).skinOpacity : 0));
  const content = (shape: string, draw: () => ReactNode) =>
    mode === "shadow" ? <path d={shape} fill="#1d1612" filter={`url(#${uid}-blur8)`} /> : draw();

  const layer: CSSProperties = { position: "absolute", inset: 0, willChange: "transform, opacity", transformOrigin: "0 0" };
  return (
    <motion.div style={{ position: "absolute", inset: 0, opacity, willChange: "opacity" }}>
      {art.skin ? (
        <>
          <motion.div style={{ ...layer, transform: skinT, opacity: skinO }}>
            <Svg box={box} side={side} sided={def.sided}>
              {content(art.skin.shape, () => art.skin!.draw(c2))}
            </Svg>
          </motion.div>
          <motion.div style={{ ...layer, transform: capT }}>
            <Svg box={box} side={side} sided={def.sided}>
              {content(art.shape, () => art.draw(c2))}
            </Svg>
          </motion.div>
        </>
      ) : (
        <Svg box={box} side={side} sided={def.sided}>
          {content(art.shape, () => art.draw(c2))}
        </Svg>
      )}
    </motion.div>
  );
}

function Panel({
  def,
  side,
  mode,
  cars,
  ctx,
  explode,
  morph,
  uid,
}: {
  def: PanelDef;
  side: Side;
  mode: "art" | "shadow";
  cars: CarId[];
  ctx: Record<CarId, Ctx>;
  explode: MotionValue<number>;
  morph: MotionValue<number>;
  uid: string;
}) {
  const box = boxFor(def, side, mode === "shadow" ? SHADOW_PAD : 0);
  const transform = useTransform([explode, morph], ([e, m]) => panelTransform(def, side, box, e as number, m as number, mode === "shadow"));
  const shadowOpacity = useTransform(explode, (e) => (mode === "shadow" ? Math.round(prog(def, e) * 0.34 * 1000) / 1000 : 1));
  return (
    <motion.div
      style={{
        ...boxStyle(box as [number, number, number, number]),
        transform,
        transformOrigin: "0 0",
        opacity: mode === "shadow" ? shadowOpacity : 1,
        willChange: def.ex ? "transform" : undefined,
      }}
    >
      {cars.map((car) => (
        <CarLayer key={car} def={def} side={side} box={box} car={car} ctx={ctx[car]} explode={explode} morph={morph} mode={mode} uid={uid} />
      ))}
    </motion.div>
  );
}

/** Contact shadow: two baked blurs (wide ambient + tight contact), one per car, crossfaded. */
function ContactShadow({ cars, morph, explode, uid }: { cars: CarId[]; morph: MotionValue<number>; explode: MotionValue<number>; uid: string }) {
  const box: [number, number, number, number] = [-470, -240, 470, 240];
  const oA = useTransform(morph, (m) => 1 - easeInOut(clamp01((m - 0.35) / 0.3)));
  const oB = useTransform(morph, (m) => easeInOut(clamp01((m - 0.35) / 0.3)));
  const whole = useTransform(explode, (e) => 1 - 0.25 * easeInOut(clamp01(e)));
  return (
    <motion.div style={{ ...boxStyle(box), opacity: whole }}>
      {cars.map((car) => (
        <motion.div key={car} style={{ position: "absolute", inset: 0, opacity: car === "a" ? oA : oB, willChange: "opacity" }}>
          <Svg box={box} side={-1} sided={false}>
            <path d={ART[car].shadow.shape} fill="#2a1d14" fillOpacity="0.42" filter={`url(#${uid}-blur24)`} transform="translate(10 16) scale(1.04 1.12)" />
            <path d={ART[car].shadow.shape} fill="#140d08" fillOpacity="0.6" filter={`url(#${uid}-blur8)`} transform="translate(3 6) scale(0.99 1.02)" />
          </Svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Car({ morph, explode, paint, className, still }: CarProps) {
  const uid = "c" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const frozenE = useMotionValue(0);
  const frozenM = useMotionValue(still === "b" ? 1 : 0);
  useEffect(() => frozenM.set(still === "b" ? 1 : 0), [still, frozenM]);
  const e = still ? frozenE : explode;
  const m = still ? frozenM : morph;
  const cars: CarId[] = still ? [still] : ["a", "b"];
  const ctx: Record<CarId, Ctx> = {
    a: { uid, car: "a", p: paintFor("a", paint), outline: OUTLINE_A },
    b: { uid, car: "b", p: paintFor("b", paint), outline: OUTLINE_B },
  };

  const layers = (mode: "art" | "shadow") =>
    PANELS.filter((d) => (mode === "shadow" ? d.casts : true)).flatMap((def) =>
      (def.sided ? ([-1, 1] as Side[]) : ([1] as Side[])).map((side) => (
        <Panel key={`${mode}-${def.base}-${side}`} def={def} side={side} mode={mode} cars={cars} ctx={ctx} explode={e} morph={m} uid={uid} />
      )),
    );

  const art = layers("art");
  // floor, wheels and interior sit under the lifted panels' shadows
  const groundCount = PANELS.filter((d) => d.base === "floor" || d.base === "interior" || d.base.startsWith("wheel")).reduce(
    (n, d) => n + (d.sided ? 2 : 1),
    0,
  );

  return (
    <div
      className={className}
      role="img"
      aria-label={still === "b" ? "Car B seen from above" : "A two-seat open sports car seen from above"}
      style={{ position: "relative", containerType: "size", aspectRatio: `${VB.w} / ${VB.h}` }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <SharedDefs uid={uid} />
          <filter id={`${uid}-blur8`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id={`${uid}-blur24`} x="-30%" y="-40%" width="160%" height="180%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          {cars.map((car) => (
            <CarDefs key={car} c={ctx[car]} />
          ))}
        </defs>
      </svg>
      <div
        style={
          {
            "--u": `min(0.1cqw, calc(100cqh / ${VB.h}))`,
            position: "absolute",
            left: "50%",
            top: "50%",
            width: U(VB.w),
            height: U(VB.h),
            transform: "translate(-50%, -50%)",
            perspective: U(1500),
          } as CSSProperties
        }
      >
        <ContactShadow cars={cars} morph={m} explode={e} uid={uid} />
        {art.slice(0, groundCount)}
        {layers("shadow")}
        {art.slice(groundCount)}
      </div>
    </div>
  );
}

export default Car;
