"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { CarId } from "@/components/car/types";
import { CARS } from "@/lib/site";
import { mix } from "@/lib/color";
import { CarSlot } from "@/components/hero/CarSlot";
import { Eyebrow, Rise, Words } from "@/components/ui/Reveal";
import { ModelToggle } from "@/components/ui/ModelToggle";

export function Colour() {
  const [car, setCar] = useState<CarId>("a");
  const [pick, setPick] = useState<Record<CarId, number>>({ a: 0, b: 0 });
  const morph = useMotionValue(0);
  const explode = useMotionValue(0);
  // Switching cars is a small version of the hero: the panels lift, swap and the car turns to face right.
  const rotate = useTransform(morph, [0, 1], [0, 180]);
  const scale = useTransform(morph, (m) => 1 - 0.3 * Math.sin(Math.PI * m));

  useEffect(() => {
    const target = car === "a" ? 0 : 1;
    if (morph.get() === target) return;
    const ease = [0.65, 0, 0.35, 1] as const;
    const m = animate(morph, target, { duration: 1.3, ease });
    const e = animate(explode, [explode.get(), 0.5, 0], { duration: 1.3, times: [0, 0.4, 1], ease: "easeInOut" });
    return () => {
      m.stop();
      e.stop();
    };
  }, [car, morph, explode]);

  // A new paint lifts the panels a touch, as if they had just come back from the booth.
  const firstPaint = useRef(true);
  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    const c = animate(explode, [explode.get(), 0.16, 0], { duration: 0.9, times: [0, 0.35, 1], ease: "easeInOut" });
    return () => c.stop();
  }, [pick, explode]);

  const entry = CARS[car];
  const paintA = CARS.a.paints[pick.a];
  const paintB = CARS.b.paints[pick.b];
  const current = car === "a" ? paintA : paintB;
  const paint = {
    a: { body: paintA.body, body2: paintA.body2, interior: paintA.interior },
    b: { body: paintB.body, body2: paintB.body2, interior: paintB.interior },
  };
  const tint = mix("#F3F1E8", current.body, 0.13);

  return (
    <section id="colour" className="relative overflow-hidden text-ink transition-colors duration-700" style={{ backgroundColor: tint }}>
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-10 md:py-40 lg:px-[5.5vw]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Rise>
              <Eyebrow n="04" className="text-ink-2">
                Colour
              </Eyebrow>
            </Rise>
            <h2 className="display mt-10 text-[3.2rem] sm:text-7xl lg:text-[6.6rem]">
              <Words text="Painted" />
              <br />
              <Words italic="by hand, twice." delay={0.12} />
            </h2>
          </div>
          <Rise delay={0.2} className="md:pb-3">
            <ModelToggle value={car} onChange={setCar} />
          </Rise>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="relative -mx-5 aspect-[5/3] sm:mx-0 lg:col-span-8">
            <motion.div style={{ rotate, scale }} className="absolute inset-0">
              <CarSlot morph={morph} explode={explode} paint={paint} className="h-full w-full" />
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow text-ink-2">
              {entry.name} · {current.code}
            </p>
            <div className="relative mt-4 h-[4.6rem] overflow-hidden sm:h-24">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={`${car}-${current.name}`}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="display absolute inset-x-0 top-0 text-[4rem] sm:text-[5.2rem]"
                >
                  {current.name}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-2 min-h-12 text-[15px] leading-relaxed text-ink-2">{current.note}</p>

            <div role="radiogroup" aria-label={`${entry.name} paint`} className="mt-8 flex flex-wrap gap-3">
              {entry.paints.map((pt, i) => {
                const on = pick[car] === i;
                return (
                  <button
                    key={pt.code}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`${pt.name}: ${pt.note}`}
                    onClick={() => setPick((s) => ({ ...s, [car]: i }))}
                    className={`relative grid h-14 w-14 place-items-center rounded-full transition ${on ? "ring-1 ring-ink ring-offset-4 ring-offset-transparent" : "hover:scale-105"}`}
                  >
                    <span
                      className="block h-12 w-12 rounded-full shadow-[inset_0_-6px_12px_rgba(0,0,0,0.25),inset_0_6px_10px_rgba(255,255,255,0.35)]"
                      style={{ background: `linear-gradient(135deg, ${pt.body} 0 58%, ${pt.body2} 58% 100%)` }}
                    />
                    <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border border-white/70" style={{ backgroundColor: pt.interior }} />
                  </button>
                );
              })}
            </div>

            <dl className="mt-10 grid grid-cols-3 border-t border-ink/15 pt-6">
              {[
                ["Body", current.body],
                ["Accent", current.body2],
                ["Hide", current.interior],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow text-ink-2">{k}</dt>
                  <dd className="mt-3 flex items-center gap-2 text-[13px] uppercase tracking-wider">
                    <span className="h-3 w-3 rounded-full border border-ink/20" style={{ backgroundColor: v }} />
                    {v.replace("#", "")}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-[13px] leading-relaxed text-ink-2">
              Any colour can be matched to a sample you send us. Allow nine weeks; the paint alone takes three.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
