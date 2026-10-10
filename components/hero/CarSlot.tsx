"use client";

import type { CarProps } from "@/components/car/types";
import { Car as CarImpl, CAR_ANCHORS } from "@/components/car/Car";

/**
 * The ONE place the page gets its car from. Both cars are drawn nose-LEFT; the page turns the
 * wrapper 180° itself (hero turn, model card, configurator) to show car B nose-right.
 */

export type PartKey = "nose" | "door" | "cockpit" | "tail" | "wheel";
/** Exploded part positions (fractions of the car box, nose left) used by the Anatomy callouts. */
export const PART_ANCHORS: Record<PartKey, { x: number; y: number }> = CAR_ANCHORS;

export function CarSlot({ className, ...props }: CarProps) {
  return (
    <div className={className}>
      <CarImpl {...props} className="block h-full w-full" />
    </div>
  );
}
