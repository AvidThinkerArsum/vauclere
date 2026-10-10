"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CarId } from "@/components/car/types";
import { CAR_LIST, SITE } from "@/lib/site";
import { Eyebrow, Rise, Words } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/ui/Logo";
import { PICK_EVENT } from "@/components/sections/Models";

type Sent = { name: string; car: string; where: string };

export function Inquiry() {
  const [car, setCar] = useState<CarId | "both">("a");
  const [sent, setSent] = useState<Sent | null>(null);
  const done = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = (e: Event) => setCar((e as CustomEvent<CarId>).detail);
    window.addEventListener(PICK_EVENT, on);
    return () => window.removeEventListener(PICK_EVENT, on);
  }, []);

  useEffect(() => {
    if (sent) done.current?.focus();
  }, [sent]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim().split(" ")[0] || "there";
    const carName = car === "both" ? "both cars" : CAR_LIST.find((c) => c.id === car)!.name;
    setSent({ name, car: carName, where: String(f.get("where") || SITE.inquiry.locations[0]).toLowerCase() });
  }

  return (
    <section id="inquiry" className="relative overflow-hidden bg-[#1E261F] text-[#ECEBDF]">
      <div className="mx-auto max-w-[1600px] px-5 py-28 sm:px-10 md:py-40 lg:px-[5.5vw]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Rise>
              <Eyebrow n="05" className="text-[#ECEBDF]/60">
                {SITE.inquiry.eyebrow}
              </Eyebrow>
            </Rise>
            <h2 className="display mt-10 text-[3.4rem] sm:text-7xl lg:text-[6.2rem]">
              <Words text="A private" />
              <br />
              <Words italic="viewing." delay={0.12} />
            </h2>
            <Rise delay={0.2} className="mt-10 max-w-sm text-[15px] leading-relaxed text-[#ECEBDF]/70">
              {SITE.inquiry.body}
            </Rise>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="done"
                  ref={done}
                  tabIndex={-1}
                  role="status"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-[#ECEBDF]/25 pt-10 outline-none"
                >
                  <p className="eyebrow text-[#ECEBDF]/60">Request noted</p>
                  <p className="display mt-6 text-5xl sm:text-6xl">
                    Thank you, <em>{sent.name}.</em>
                  </p>
                  <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#ECEBDF]/75">
                    We would write within two days to arrange a viewing of {sent.car}, {sent.where}. Since Vauclère is fictional, nothing has been sent and
                    no details have left this page.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(null)}
                    className="wide mt-10 inline-flex min-h-12 items-center border border-[#ECEBDF]/40 px-6 text-[0.62rem] transition-colors hover:bg-[#ECEBDF] hover:text-[#1E261F]"
                  >
                    Start again
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
                  aria-label="Request a private viewing"
                >
                  <fieldset className="sm:col-span-2">
                    <legend className="eyebrow text-[#ECEBDF]/60">Which car</legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[...CAR_LIST.map((c) => ({ id: c.id as CarId | "both", label: c.wordmark })), { id: "both" as const, label: "BOTH" }].map((o) => (
                        <label key={o.id} className="cursor-pointer">
                          <input type="radio" name="car" value={o.id} checked={car === o.id} onChange={() => setCar(o.id)} className="peer sr-only" />
                          <span className="wide inline-flex min-h-11 items-center border border-[#ECEBDF]/30 px-5 text-[0.62rem] transition-colors peer-checked:border-[#ECEBDF] peer-checked:bg-[#ECEBDF] peer-checked:text-[#1E261F] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                            {o.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <Field label="Name" name="name" autoComplete="name" required />
                  <Field label="Email" name="email" type="email" autoComplete="email" required />
                  <Field label="Telephone (optional)" name="tel" type="tel" autoComplete="tel" />
                  <label className="block">
                    <span className="eyebrow text-[#ECEBDF]/60">Where</span>
                    <select name="where" className="field mt-1 [&>option]:text-ink" defaultValue={SITE.inquiry.locations[0]}>
                      {SITE.inquiry.locations.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="eyebrow text-[#ECEBDF]/60">Anything we should know</span>
                    <textarea name="note" rows={3} className="field mt-1 resize-none" placeholder="The roads you drive, the colour you have in mind…" />
                  </label>

                  <div className="flex flex-col gap-4 pt-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs text-[12px] leading-relaxed text-[#ECEBDF]/50">This is a design demo. Submitting shows a confirmation and sends nothing.</p>
                    <button
                      type="submit"
                      className="wide inline-flex min-h-13 items-center justify-center gap-3 whitespace-nowrap bg-[#ECEBDF] px-8 py-4 text-[0.66rem] text-[#1E261F] transition-transform hover:-translate-y-0.5"
                    >
                      Request a viewing <span aria-hidden>→</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#ECEBDF]/12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-10 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-[5.5vw]">
          <div className="flex items-center gap-4">
            <LogoMark className="h-7 w-auto" />
            <div>
              <p className="wordmark text-sm">{SITE.companyCaps}</p>
              <p className="eyebrow mt-1.5 text-[0.52rem] text-[#ECEBDF]/50">
                {SITE.tagline} · {SITE.place}
              </p>
            </div>
          </div>
          <p className="max-w-xl text-[12px] leading-relaxed text-[#ECEBDF]/55 md:text-right">{SITE.footer.disclaimer}</p>
        </div>
      </footer>
    </section>
  );
}

function Field({ label, name, type = "text", autoComplete, required }: { label: string; name: string; type?: string; autoComplete?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow text-[#ECEBDF]/60">
        {label}
        {required && <span aria-hidden> *</span>}
      </span>
      <input name={name} type={type} autoComplete={autoComplete} required={required} className="field mt-1" />
    </label>
  );
}
