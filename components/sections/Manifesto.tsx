"use client";

import { SITE } from "@/lib/site";
import { Eyebrow, Rise, Words } from "@/components/ui/Reveal";

export function Manifesto() {
  const m = SITE.manifesto;
  return (
    <section id="house" className="relative bg-paper text-ink">
      <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-28 sm:px-10 md:pb-40 md:pt-44 lg:px-[5.5vw]">
        <Rise>
          <Eyebrow n="01" className="text-ink-2">
            {m.eyebrow}
          </Eyebrow>
        </Rise>

        <h2 className="display mt-12 text-[3.4rem] sm:text-7xl md:mt-16 lg:text-[8.2rem]">
          <Words text={m.headline[0]} />
          <br />
          <Words text={m.headline[1]} delay={0.1} />
          <br />
          <Words italic={m.headlineItalic} delay={0.2} className="text-moss-2" />
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12">
          <Rise delay={0.1} className="space-y-5 text-[16px] leading-[1.7] text-ink-2 md:col-span-5 md:col-start-6 lg:col-span-4 lg:col-start-7">
            {m.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </Rise>
        </div>

        <dl className="mt-20 grid grid-cols-1 border-t border-ink/15 sm:grid-cols-3 md:mt-28">
          {m.figures.map((f, i) => (
            <Rise key={f.label} delay={0.08 * i} className="border-b border-ink/15 py-8 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
              <dt className="eyebrow text-ink-2">{f.label}</dt>
              <dd className="wordmark mt-5 text-5xl tracking-[0.04em] text-moss md:text-6xl">{f.value}</dd>
            </Rise>
          ))}
        </dl>
      </div>
    </section>
  );
}
