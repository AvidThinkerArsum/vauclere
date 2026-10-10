"use client";

import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { LogoMark } from "@/components/ui/Logo";

type C = MotionValue<string> | string;

/** The thin nav from the reel: mark at left, tracked caps, one filled button. Inks follow the current car. */
export function HeroNav({ ink, paper }: { ink: C; paper: C }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header style={{ color: ink }} className={`absolute inset-x-0 top-0 ${open ? "z-[60]" : "z-30"}`}>
      <nav aria-label="Primary" className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:h-24 sm:px-10 lg:px-[5.5vw]">
        <a href="#top" className="-m-2 flex items-center gap-3 p-2" aria-label={`${SITE.company}, back to top`}>
          <LogoMark className="h-7 w-auto sm:h-9" />
        </a>

        <ul className="hidden items-center gap-[2.6vw] lg:flex">
          {SITE.nav.map((n) => (
            <li key={n.label}>
              <a href={n.href} className="wide inline-flex min-h-11 items-center text-[0.62rem] opacity-80 transition-opacity hover:opacity-100">
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <motion.a
              href={SITE.cta.href}
              style={{ backgroundColor: ink, color: paper }}
              className="wide inline-flex min-h-9 items-center px-4 text-[0.62rem] transition-transform hover:-translate-y-px"
            >
              {SITE.cta.label}
            </motion.a>
          </li>
        </ul>

        <div className="flex items-center gap-2 lg:hidden">
          <motion.a href={SITE.cta.href} style={{ backgroundColor: ink, color: paper }} className="wide inline-flex min-h-10 items-center px-3.5 text-[0.56rem]">
            {SITE.cta.label}
          </motion.a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-sheet"
            className="grid h-11 w-11 place-items-center"
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-[6px]">
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col bg-paper px-5 pb-10 text-ink"
          >
            <div className="flex h-20 items-center justify-between">
              <LogoMark className="h-7 w-auto" />
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center text-2xl" aria-label="Close menu">
                ×
              </button>
            </div>
            <ul className="mt-6 flex flex-col">
              {[...SITE.nav, SITE.cta].map((n, i) => (
                <motion.li key={n.label} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <a href={n.href} onClick={() => setOpen(false)} className="flex min-h-16 items-center justify-between border-b border-ink/15 display text-5xl">
                    {n.label}
                    <span className="eyebrow text-ink-2">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto text-xs leading-relaxed text-ink-2">{SITE.footer.disclaimer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
