"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import type { CarId } from "@/components/car/types";
import { CAR_LIST } from "@/lib/site";

/** Two-way segmented switch between the cars. */
export function ModelToggle({ value, onChange, className = "" }: { value: CarId; onChange: (v: CarId) => void; className?: string }) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label="Choose a car" className={`inline-flex rounded-full border border-current/25 p-1 ${className}`}>
      {CAR_LIST.map((c) => {
        const on = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(c.id)}
            className={`wide relative min-h-11 rounded-full px-5 text-[0.62rem] transition-colors ${on ? "text-paper" : "opacity-70 hover:opacity-100"}`}
          >
            {on && (
              <motion.span
                layoutId={`pill-${id}`}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: c.palette.ink }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
            <span className="relative">{c.wordmark}</span>
          </button>
        );
      })}
    </div>
  );
}
