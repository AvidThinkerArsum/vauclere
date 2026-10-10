"use client";

import { animate, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CarId } from "@/components/car/types";
import { CARS } from "@/lib/site";
import { CarSlot, PART_ANCHORS, type PartKey } from "@/components/hero/CarSlot";
import { Eyebrow, Rise, Words } from "@/components/ui/Reveal";
import { ModelToggle } from "@/components/ui/ModelToggle";

type Key = PartKey;

/*
 * Callout layout. Anchor points come from the car itself (PART_ANCHORS: exploded positions as
 * fractions of its 1000 × 600 box, nose left). Labels sit in a column left or right of the car,
 * at the anchor's height (nudged apart if two collide); the cockpit's label sits underneath.
 */
const ORDER: Key[] = ["nose", "door", "cockpit", "tail", "wheel"];
type Callout = { x: number; y: number; side: "l" | "r" | "b"; ly: number; lx?: number };
const ANCHORS: Record<Key, Callout> = (() => {
  const out = {} as Record<Key, Callout>;
  const cols: Record<"l" | "r", Key[]> = { l: [], r: [] };
  for (const k of ORDER) {
    const x = Math.round(PART_ANCHORS[k].x * 1000);
    const y = Math.round(PART_ANCHORS[k].y * 600);
    const side = k === "cockpit" ? "b" : x < 500 ? "l" : "r";
    out[k] = side === "b" ? { x, y, side, ly: 700, lx: x + 130 } : { x, y, side, ly: Math.min(620, Math.max(-20, y)) };
    if (side !== "b") cols[side].push(k);
  }
  for (const side of ["l", "r"] as const) {
    const ks = cols[side].sort((a, b) => out[a].ly - out[b].ly);
    for (let i = 1; i < ks.length; i++) out[ks[i]].ly = Math.max(out[ks[i]].ly, out[ks[i - 1]].ly + 120);
  }
  return out;
})();

// Stage = car box plus label gutters, in car units.
const PAD_X = 330;
const PAD_T = 60;
const PAD_B = 150;
const SW = 1000 + PAD_X * 2;
const SH = 600 + PAD_T + PAD_B;
// Label columns sit this far outside the car box (car units), clear of the exploded panels.
const OUT_L = -70;
const OUT_R = 1090;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

export function Anatomy() {
  const [car, setCar] = useState<CarId>("a");
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll-linked: the car comes apart as the stage rises into view, holds open (labels in)
  // while it sits mid-screen, and closes again as it leaves. Scrolling back plays it in reverse.
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });
  const opened = useTransform(scrollYProgress, [0.1, 0.36, 0.56, 0.8], [0, 1, 1, 0]);
  const smooth = useSpring(opened, { stiffness: 120, damping: 26, mass: 0.6 });
  const still = useMotionValue(1);
  const explode = reduce ? still : smooth;
  const morph = useMotionValue(0);
  const labels = useTransform(explode, [0, 0.75, 1], [0, 0, 1]);

  useEffect(() => {
    const c = animate(morph, car === "a" ? 0 : 1, { duration: 1.1, ease: [0.65, 0, 0.35, 1] });
    return () => c.stop();
  }, [car, morph]);

  const entry = CARS[car];

  return (
    <section
      id="anatomy"
      className="relative overflow-hidden bg-bone text-ink"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29,33,28,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(29,33,28,0.05) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-10 md:py-40 lg:px-[5.5vw]">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Rise>
              <Eyebrow n="02" className="text-ink-2">
                Anatomy
              </Eyebrow>
            </Rise>
            <h2 className="display mt-10 text-[3.2rem] sm:text-7xl lg:text-[6.6rem]">
              <Words text="Every panel," />
              <br />
              <Words italic="in its place." delay={0.12} />
            </h2>
          </div>
          <Rise delay={0.2} className="md:pb-3">
            <ModelToggle value={car} onChange={setCar} />
          </Rise>
        </div>

        {/* Stage */}
        <div
          ref={stage}
          className="relative -mx-5 mt-14 aspect-[5/3] md:mx-auto md:mt-20 md:aspect-[var(--ar)] md:w-full md:max-w-[1240px]"
          style={{ "--ar": `${SW} / ${SH}` } as CSSProperties}
        >
          <div
            className="absolute inset-0 scale-[0.86] md:inset-auto md:left-[var(--l)] md:scale-100 md:top-[var(--t)] md:h-[var(--h)] md:w-[var(--w)]"
            style={{ "--l": pct(PAD_X, SW), "--t": pct(PAD_T, SH), "--w": pct(1000, SW), "--h": pct(600, SH) } as CSSProperties}
          >
            <CarSlot morph={morph} explode={explode} className="h-full w-full" />
            {/* Numbered pins (mobile) */}
            {ORDER.map((k, i) => {
              const a = ANCHORS[k];
              return (
                <motion.span
                  key={k}
                  style={{ opacity: labels, left: pct(a.x, 1000), top: pct(a.y, 600) }}
                  className="eyebrow absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/50 bg-bone text-[0.55rem] md:hidden"
                  aria-hidden
                >
                  {i + 1}
                </motion.span>
              );
            })}
          </div>

          {/* Leader lines (desktop) */}
          <motion.svg style={{ opacity: labels }} viewBox={`0 0 ${SW} ${SH}`} className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" aria-hidden>
            {ORDER.map((k) => {
              const a = ANCHORS[k];
              const ax = a.x + PAD_X;
              const ay = a.y + PAD_T;
              const ly = a.ly + PAD_T;
              const ex = PAD_X + (a.side === "l" ? OUT_L : OUT_R);
              const kx = a.side === "l" ? ex + 50 : ex - 50;
              const bx = (a.lx ?? a.x) + PAD_X;
              const pts = a.side === "b" ? `${ax},${ay} ${bx},${ly - 60} ${bx},${ly - 34}` : `${ax},${ay} ${kx},${ly} ${ex},${ly}`;
              return (
                <g key={k} stroke="currentColor" fill="none" strokeWidth="1">
                  <polyline points={pts} strokeOpacity="0.55" vectorEffect="non-scaling-stroke" />
                  <circle cx={ax} cy={ay} r="5" fill="#E6E2D6" strokeOpacity="0.9" vectorEffect="non-scaling-stroke" />
                  <circle cx={ax} cy={ay} r="1.8" fill="currentColor" stroke="none" />
                </g>
              );
            })}
          </motion.svg>

          {/* Labels (desktop) */}
          {ORDER.map((k, i) => {
            const a = ANCHORS[k];
            const x = PAD_X + (a.side === "l" ? OUT_L : a.side === "r" ? OUT_R : (a.lx ?? a.x));
            const pos: CSSProperties =
              a.side === "l"
                ? { right: pct(SW - x + 14, SW), top: pct(a.ly + PAD_T, SH) }
                : a.side === "r"
                  ? { left: pct(x + 14, SW), top: pct(a.ly + PAD_T, SH) }
                  : { left: pct(x, SW), top: pct(a.ly + PAD_T - 20, SH) };
            const align = a.side === "l" ? "text-right -translate-y-1/2" : a.side === "r" ? "text-left -translate-y-1/2" : "text-center -translate-x-1/2";
            return (
              <motion.div key={k} style={{ opacity: labels, ...pos }} className={`absolute hidden w-[13vw] max-w-[210px] md:block ${align}`}>
                <p className="eyebrow text-ink">
                  <span className="text-ink-2">0{i + 1}</span> {entry.anatomy[k].title}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-snug text-ink-2">{entry.anatomy[k].detail}</p>
              </motion.div>
            );
          })}
        </div>

        {/* List (mobile) */}
        <ol className="mt-10 grid grid-cols-1 border-t border-ink/15 md:hidden">
          {ORDER.map((k, i) => (
            <li key={k} className="flex gap-4 border-b border-ink/15 py-4">
              <span className="eyebrow pt-0.5 text-ink-2">0{i + 1}</span>
              <span>
                <span className="eyebrow block text-ink">{entry.anatomy[k].title}</span>
                <span className="mt-1 block text-sm text-ink-2">{entry.anatomy[k].detail}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink/15 pt-8 sm:grid-cols-3 md:mt-16 lg:grid-cols-6">
          {entry.specs.map((s) => (
            <div key={s.label}>
              <p className="eyebrow text-ink-2">{s.label}</p>
              <p className="mt-2 text-[15px] leading-snug">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
