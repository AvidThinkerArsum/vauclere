"use client";

import {
  easeInOut,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { CARS } from "@/lib/site";
import { useIsMobile, useReduced } from "@/lib/useMedia";
import { CarSlot } from "@/components/hero/CarSlot";
import { HeroNav } from "@/components/hero/HeroNav";
import { Stripes } from "@/components/hero/Stripes";

const A = CARS.a;
const B = CARS.b;

/*
 * Scroll choreography (progress p of the pinned section, 0 → 1). Matches the reel's three frames:
 *   0.00–0.05  hold car A (Verdin) nose left, its nose cut by the left edge; wordmark right, cut by the right edge
 *   0.05–0.30  explode 0 → 1 while the car slides to the centre; A's wordmark slides out right;
 *              the thin stripes fatten into bold chevrons
 *   0.30–0.38  hold the exploded car, still nose left; the first red panels arrive (the reel's transition frame)
 *   0.38–0.58  the exploded car turns 180° (with a slight scale dip so it stays inside the frame);
 *              colours keep swapping front to back; the counter rolls 01 → 02; B's wordmark peeks in at the right
 *   0.58–0.64  exploded, nose right, swap completes
 *   0.64–0.88  explode 1 → 0 while the car slides right, nose cut by the right edge; B's wordmark crosses to the left
 *   0.88–1.00  hold car B (Sumac)
 * Car x is a percentage of the car box's own width, so the composition holds at any viewport size.
 */
const K = { start: 0.05, open: 0.3, turnA: 0.38, turnB: 0.58, shut: 0.64, close: 0.88 };
const TURN_MID = (K.turnA + K.turnB) / 2;

export function Hero() {
  const reduced = useReduced();
  return reduced ? <HeroStill /> : <HeroScroll />;
}

function HeroScroll() {
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 150, damping: 32, mass: 0.35, restDelta: 0.0002 });

  // The two values the car listens to.
  const explode = useTransform(p, [K.start, K.open, K.shut, K.close], [0, 1, 1, 0], { ease: [easeInOut, (t) => t, easeInOut] });
  const morph = useTransform(p, [K.open, K.shut], [0, 1]);

  // Car placement (% of its own box width), turn and scale.
  const carXv = useTransform(p, [K.start, K.open, K.shut, K.close], mobile ? [-8, -2, 2, 10] : [-42, -5, 4, 48], {
    ease: [easeInOut, (t) => t, easeInOut],
  });
  const carX = useMotionTemplate`${carXv}%`;
  const rotate = useTransform(p, [K.turnA, K.turnB], [0, 180], { ease: easeInOut });
  const scale = useTransform(
    p,
    [K.start, K.open, K.turnA, TURN_MID, K.turnB, K.shut, K.close],
    mobile ? [1, 0.82, 0.82, 0.78, 0.82, 0.82, 1] : [1, 0.8, 0.8, 0.7, 0.8, 0.8, 1],
    { ease: [easeInOut, (t) => t, easeInOut, easeInOut, (t) => t, easeInOut] },
  );

  // Palette: the background stays cream through the transition frame, then warms to rose.
  const bg = useTransform(p, [0.36, 0.66], [A.palette.background, B.palette.background]);
  const ink = useTransform(p, [0.42, 0.58], [A.palette.ink, B.palette.ink]);
  const stripe = useTransform(p, [0.3, 0.66], [A.palette.stripe, B.palette.stripe]);
  const stripeW = useTransform(p, [0, K.start, 0.28, K.shut + 0.02, K.close, 1], [9, 9, 116, 116, 9, 9]);
  const stripeO = useTransform(p, [0, K.start, 0.28, K.shut + 0.02, K.close, 1], [0.8, 0.8, 1, 1, 0.75, 0.75]);
  const stripeX = useTransform(p, [0, 1], [0, 960]);
  const wedgeA = useTransform(p, [0, 0.2, 1], [0.5, 0, 0]);
  const wedgeB = useTransform(p, [0, 0.72, 0.95, 1], [0, 0, 0.55, 0.55]);

  // Wordmarks: A slides out to the right, B peeks in from the right mid-turn and crosses to the left.
  const wmAv = useTransform(p, [0, 0.04, K.open, 1], [0, 0, 105, 105], { ease: [(t) => t, easeInOut, (t) => t] });
  const wmA = useMotionTemplate`${wmAv}vw`;
  const wmBv = useTransform(p, [0, 0.44, K.shut, 0.9, 1], mobile ? [110, 110, 110, 0, 0] : [108, 108, 84, 0, 0], {
    ease: [(t) => t, easeInOut, easeInOut, (t) => t],
  });
  const wmB = useMotionTemplate`${wmBv}vw`;

  // Counter 01 → 02 (mid-turn) and the progress on the bottom rule.
  const c1 = useTransform(p, [TURN_MID - 0.04, TURN_MID + 0.04], ["0%", "-110%"]);
  const c2 = useTransform(p, [TURN_MID - 0.04, TURN_MID + 0.04], ["110%", "0%"]);
  const cue = useTransform(p, [0, 0.04, 1], [1, 0, 0]);

  const goTo = useCallback((t: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + t * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  // ← → keys jump between the two states while the hero is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.5 || r.bottom < window.innerHeight * 0.75) return;
      e.preventDefault();
      goTo(e.key === "ArrowRight" ? 1 : 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  return (
    <section id="top" ref={ref} aria-label="Verdin and Sumac" className="relative h-[330vh] md:h-[440vh]">
      <motion.div style={{ backgroundColor: bg }} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* soft light wedges like the reel's background planes */}
        <motion.div
          aria-hidden
          style={{ opacity: wedgeA }}
          className="absolute inset-0 bg-white [clip-path:polygon(100%_0,62%_0,44%_50%,62%_100%,100%_100%)]"
        />
        <motion.div
          aria-hidden
          style={{ opacity: wedgeB }}
          className="absolute inset-0 bg-white [clip-path:polygon(0_0,34%_0,52%_58%,24%_100%,0_100%)]"
        />

        <Stripes width={mobile ? 700 : 1600} stroke={stripe} strokeWidth={stripeW} x={stripeX} opacity={stripeO} />

        <HeroNav ink={ink} paper={bg} />

        {/* Wordmarks (behind the car) */}
        <motion.div style={{ color: ink }} className="pointer-events-none absolute inset-0 z-10">
          <motion.div style={{ x: wmA }} className="absolute left-[6vw] top-[18svh] md:left-[52vw] md:top-1/2 md:-translate-y-1/2">
            <Wordmark car="a" />
          </motion.div>
          <motion.div style={{ x: wmB }} className="absolute left-[6vw] top-[18svh] md:left-[1.2vw] md:top-1/2 md:-translate-y-1/2">
            <Wordmark car="b" />
          </motion.div>
        </motion.div>

        {/* The car */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center pt-[16svh] md:pt-0">
          <motion.div style={{ x: carX, rotate, scale }} className="aspect-[5/3] w-[136vw] shrink-0 md:w-[min(66vw,112svh)]">
            <CarSlot morph={morph} explode={explode} className="h-full w-full" />
          </motion.div>
        </div>

        {/* Bottom rule, arrows and counter */}
        <motion.div style={{ color: ink }} className="absolute inset-x-0 bottom-0 z-30">
          <div className="mx-auto flex max-w-[1600px] items-end gap-4 px-5 pb-6 sm:px-10 sm:pb-9 lg:px-[5.5vw]">
            <div className="relative mb-[0.62rem] flex-1">
              <div className="hairline" />
              <motion.div style={{ scaleX: p }} className="absolute inset-x-0 top-0 h-px origin-left bg-current" />
              <motion.p style={{ opacity: cue }} className="eyebrow absolute -top-8 left-0 opacity-70">
                Scroll<span className="hidden sm:inline"> to open the car</span>
              </motion.p>
            </div>
            <div className="flex items-center gap-1">
              <ArrowBtn dir="left" label={`Show ${A.name}`} onClick={() => goTo(0)} />
              <ArrowBtn dir="right" label={`Show ${B.name}`} onClick={() => goTo(1)} />
            </div>
            <div className="wordmark relative h-[1.1em] w-[2.6ch] overflow-hidden text-3xl tracking-[0.06em] sm:text-[2.6rem]" aria-hidden>
              <motion.span style={{ y: c1 }} className="absolute inset-0">
                01
              </motion.span>
              <motion.span style={{ y: c2 }} className="absolute inset-0">
                02
              </motion.span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Wordmark({ car }: { car: "a" | "b" }) {
  const c = CARS[car];
  return (
    <div>
      <h2 className="wordmark text-[12.5vw] md:text-[8.2vw]">{c.wordmark}</h2>
      <p className="eyebrow mt-4 flex items-center gap-3 opacity-75 md:mt-6 md:pl-[0.4vw]">
        <span>{car === "a" ? "01" : "02"}</span>
        <span className="h-px w-8 bg-current opacity-60" />
        <span>{c.line}</span>
      </p>
    </div>
  );
}

function ArrowBtn({ dir, label, onClick }: { dir: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-current/25 transition-colors hover:bg-current/10"
    >
      <svg viewBox="0 0 20 10" className="h-2.5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        {dir === "left" ? <path d="M19 5H1M5 1L1 5l4 4" /> : <path d="M1 5h18M15 1l4 4-4 4" />}
      </svg>
    </button>
  );
}

/* Reduced motion: two quiet, static slides. */
function HeroStill() {
  const zero = useMotionValue(0);
  const one = useMotionValue(1);
  return (
    <section id="top" aria-label="Verdin and Sumac">
      {(["a", "b"] as const).map((id, i) => {
        const c = CARS[id];
        return (
          <div key={id} style={{ backgroundColor: c.palette.background, color: c.palette.ink }} className="relative min-h-[100svh] overflow-hidden">
            <Stripes width={1600} stroke={c.palette.stripe} strokeWidth={9} x={0} opacity={0.8} />
            {i === 0 && <HeroNav ink={c.palette.ink} paper={c.palette.background} />}
            <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-center gap-8 px-5 py-28 sm:px-10 md:flex-row md:items-center lg:px-[5.5vw]">
              <div className={`aspect-[5/3] w-full md:w-[56%] ${id === "b" ? "md:order-2" : ""}`} style={{ transform: id === "b" ? "rotate(180deg)" : undefined }}>
                <CarSlot morph={id === "a" ? zero : one} explode={zero} still={id} className="h-full w-full" />
              </div>
              <div className="min-w-0">
                <h2 className="wordmark text-[15vw] md:text-[7vw]">{c.wordmark}</h2>
                <p className="eyebrow mt-5 opacity-75">{c.line}</p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1600px] items-end gap-4 px-5 pb-6 sm:px-10 lg:px-[5.5vw]">
              <div className="hairline mb-[0.62rem] flex-1" />
              <span className="wordmark text-3xl tracking-[0.06em] sm:text-[2.6rem]">0{i + 1}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
