"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { LogoMark } from "@/components/ui/Logo";

/** Slim fixed bar that slides in once the pinned hero has scrolled away. */
export function SiteBar() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const hero = document.getElementById("top");
    const end = hero ? hero.offsetTop + hero.offsetHeight - 80 : Infinity;
    const next = y > end;
    if (next !== show) setShow(next);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: show ? 0 : "-110%" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-paper/85 text-moss backdrop-blur-md"
      aria-hidden={!show}
      inert={!show}
    >
      <nav aria-label="Sections" className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 sm:h-16 sm:px-10 lg:px-[5.5vw]">
        <a href="#top" className="flex min-h-11 items-center gap-3">
          <LogoMark className="h-5 w-auto" />
          <span className="wordmark text-[0.7rem]">{SITE.companyCaps}</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {SITE.nav.slice(0, 4).map((n) => (
            <li key={n.label}>
              <a href={n.href} className="wide inline-flex min-h-11 items-center text-[0.58rem] opacity-75 hover:opacity-100">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={SITE.cta.href} className="wide inline-flex min-h-11 items-center bg-moss px-4 text-[0.58rem] text-paper sm:min-h-9">
          {SITE.cta.label}
        </a>
      </nav>
    </motion.header>
  );
}
