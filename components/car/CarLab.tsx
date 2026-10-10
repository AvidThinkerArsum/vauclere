"use client";

/**
 * Dev-only preview of the car drawing (/car-lab). Not linked from the site and marked noindex.
 * Query string: ?e=0.5&m=0 sets the sliders, ?grid=1 shows the six reference states at once,
 * ?rot=0 turns off the page-style 180° turn, ?still=a|b renders the static car.
 */

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Car from "./Car";
import type { CarId } from "./types";

const STATES: [number, number][] = [
  [0, 0],
  [0.5, 0],
  [1, 0],
  [1, 0.5],
  [1, 1],
  [0, 1],
];

function Cell({ e, m, rotate }: { e: number; m: number; rotate: boolean }) {
  const explode = useMotionValue(e);
  const morph = useMotionValue(m);
  const rot = useTransform(morph, (v) => (rotate ? v * 180 : 0));
  return (
    <div className="relative">
      <motion.div style={{ rotate: rot }} className="aspect-[5/3] w-full">
        <Car explode={explode} morph={morph} className="block h-full w-full" />
      </motion.div>
      <p className="absolute left-3 top-2 font-mono text-[11px] text-black/50">
        explode {e} · morph {m}
      </p>
    </div>
  );
}

export default function CarLab() {
  const explode = useMotionValue(0);
  const morph = useMotionValue(0);
  const [ev, setEv] = useState(0);
  const [mv, setMv] = useState(0);
  const [grid, setGrid] = useState(false);
  const [rotate, setRotate] = useState(true);
  const [still, setStill] = useState<CarId | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const rot = useTransform(morph, (v) => (rotate ? v * 180 : 0));

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const e = Number(q.get("e") ?? 0);
    const m = Number(q.get("m") ?? 0);
    explode.set(e);
    morph.set(m);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time read of the query string */
    setEv(e);
    setMv(m);
    setGrid(q.get("grid") === "1");
    setRotate(q.get("rot") !== "0");
    const s = q.get("still");
    setStill(s === "a" || s === "b" ? s : undefined);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [explode, morph]);

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background:
          "repeating-linear-gradient(135deg, #ECEBDF 0 70px, #E9D9D2 70px 84px, #ECEBDF 84px 190px), #ECEBDF",
      }}
      data-ready={ready ? "1" : "0"}
    >
      {grid ? (
        <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-3">
          {STATES.map(([e, m]) => (
            <Cell key={`${e}-${m}`} e={e} m={m} rotate={rotate} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
            <motion.div style={{ rotate: rot }} className="aspect-[5/3] w-full max-w-[1200px]">
              <Car explode={explode} morph={morph} still={still} className="block h-full w-full" />
            </motion.div>
          </div>
          <div className="flex flex-wrap items-center gap-6 px-6 pb-6 font-mono text-xs text-black/70">
            <label className="flex items-center gap-3">
              explode
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={ev}
                onChange={(ev2) => {
                  const v = Number(ev2.target.value);
                  setEv(v);
                  explode.set(v);
                }}
              />
              <span className="w-10 tabular-nums">{ev.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-3">
              morph
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={mv}
                onChange={(ev2) => {
                  const v = Number(ev2.target.value);
                  setMv(v);
                  morph.set(v);
                }}
              />
              <span className="w-10 tabular-nums">{mv.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rotate} onChange={(x) => setRotate(x.target.checked)} />
              turn 180° with morph (as the page does)
            </label>
            <span className="text-black/40">dev preview · not linked</span>
          </div>
        </div>
      )}
    </main>
  );
}
