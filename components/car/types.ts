import type { MotionValue } from "framer-motion";

/** Shared contract between the car drawing (components/car/*) and the page (hero orchestration). */

export type CarId = "a" | "b";

export type CarProps = {
  /** 0 = car A fully assembled, 1 = car B fully assembled. Panels morph shape and colour between the two. */
  morph: MotionValue<number>;
  /** 0 = assembled, 1 = fully exploded (panels split radially, doors swung up and out, interior exposed). */
  explode: MotionValue<number>;
  /** Optional palette override per car (for a colour configurator). */
  paint?: Partial<Record<CarId, { body?: string; body2?: string; interior?: string }>>;
  className?: string;
  /** Static render for reduced motion: which car, assembled. */
  still?: CarId;
};
