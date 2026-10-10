"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { CAR_LIST, type CarEntry } from "@/lib/site";
import { CarSlot } from "@/components/hero/CarSlot";
import { Eyebrow, Rise, Words } from "@/components/ui/Reveal";
import { Stripes } from "@/components/hero/Stripes";

/** Lets a "Request a viewing" link preselect the car in the inquiry form. */
export const PICK_EVENT = "vauclere:pick";

export function Models() {
  return (
    <section id="models" className="relative bg-paper text-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-10 md:py-40 lg:px-[5.5vw]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Rise>
              <Eyebrow n="03" className="text-ink-2">
                The two cars
              </Eyebrow>
            </Rise>
            <h2 className="display mt-10 text-[3.2rem] sm:text-7xl lg:text-[6.6rem]">
              <Words text="One quiet," />
              <br />
              <Words italic="one loud." delay={0.12} />
            </h2>
          </div>
          <Rise delay={0.2} className="max-w-sm text-[15px] leading-relaxed text-ink-2">
            Both are open two-seaters with a manual gearbox and no screens. Both are built to order, and neither is built in a hurry.
          </Rise>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-24 lg:grid-cols-2 lg:gap-8">
          {CAR_LIST.map((c, i) => (
            <Rise key={c.id} delay={i * 0.12}>
              <ModelCard car={c} index={i} />
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModelCard({ car, index }: { car: CarEntry; index: number }) {
  const morph = useMotionValue(car.id === "a" ? 0 : 1);
  const explode = useMotionValue(0);
  const [peek, setPeek] = useState(false);

  useEffect(() => {
    const c = animate(explode, peek ? 0.22 : 0, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [peek, explode]);

  return (
    <article
      onMouseEnter={() => setPeek(true)}
      onMouseLeave={() => setPeek(false)}
      style={{ backgroundColor: car.palette.background, color: car.palette.ink }}
      className="group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <Stripes width={1000} stroke={car.palette.stripe} strokeWidth={7} x={index === 0 ? 0 : 120} />
        </div>
        <div className="absolute inset-[6%_4%]" style={{ transform: car.id === "b" ? "rotate(180deg)" : undefined }}>
          <CarSlot morph={morph} explode={explode} className="h-full w-full" />
        </div>
        <p className="eyebrow absolute left-5 top-5 sm:left-8 sm:top-7">0{index + 1}</p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-8 pt-6 sm:px-8 sm:pb-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="wordmark text-[13vw] sm:text-6xl lg:text-[4.2vw] xl:text-[4.6rem]">{car.wordmark}</h3>
          <p className="eyebrow opacity-75">{car.line}</p>
        </div>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed opacity-80">{car.description}</p>

        <dl className="mt-8 grid grid-cols-2 border-t border-current/20 sm:grid-cols-3">
          {car.specs.map((s) => (
            <div key={s.label} className="border-b border-current/15 py-4 pr-4">
              <dt className="eyebrow text-[0.56rem] opacity-65">{s.label}</dt>
              <dd className="mt-1.5 text-[14px] leading-snug">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#inquiry"
            onClick={() => window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: car.id }))}
            style={{ backgroundColor: car.palette.ink, color: car.palette.background }}
            className="wide inline-flex min-h-12 items-center gap-3 px-6 text-[0.62rem] transition-transform hover:-translate-y-0.5"
          >
            Request a viewing <span aria-hidden>→</span>
          </a>
          <a href="#colour" className="wide inline-flex min-h-12 items-center px-4 text-[0.62rem] opacity-75 hover:opacity-100">
            Choose a colour
          </a>
        </div>
      </div>
    </article>
  );
}
