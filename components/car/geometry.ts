import type { ReactNode } from "react";
import type { CarId } from "./types";
import type { Ctx } from "./parts";

/**
 * Shared coordinate space for both cars: 1000 × 600 units, origin at the centre of the box,
 * car seen from straight above with its nose pointing LEFT (−x). Car B is drawn nose-left too;
 * the page turns the whole car 180° during the morph (see Car.tsx).
 */
export const VB = { x: -500, y: -300, w: 1000, h: 600 } as const;
export const CAR_VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
export const CAR_ASPECT = VB.w / VB.h;

export type Base =
  | "shadow"
  | "floor"
  | "wheelF"
  | "wheelR"
  | "interior"
  | "bonnet"
  | "fenderF"
  | "door"
  | "mirror"
  | "fenderR"
  | "deck"
  | "screen"
  | "head"
  | "tail";

export type PanelArt = {
  /** silhouette, used for the lifted panel's shadow */
  shape: string;
  draw: (c: Ctx) => ReactNode;
  /** door-style wing: the side skin, drawn laid flat outward from the shoulder line */
  skin?: { shape: string; draw: (c: Ctx) => ReactNode };
};
export type Art = Record<Base, PanelArt>;

/** How a panel leaves the car (right-side values; the left side is mirrored). Units are viewBox units. */
export type Explode = {
  dx: number;
  dy: number;
  /** in-plane rotation about `pivot`, degrees (clockwise on screen) */
  rot: number;
  /** toward the camera; perspective makes lifted panels larger */
  lift: number;
  /** small 3D tilts, degrees */
  tiltX?: number;
  tiltY?: number;
  pivot: [number, number];
};

/** Door-style wing: cap rotates up about `hinge` (inner top edge), skin unfolds outward from `out`. */
export type Wing = { hinge: number; out: number; phi: number };

export type PanelDef = {
  base: Base;
  sided: boolean;
  /** right-side bounding box [x0, y0, x1, y1] covering both cars' artwork (and any skin) */
  box: [number, number, number, number];
  /** stagger window inside explode 0..1 */
  t: [number, number];
  /** centre of this panel's colour swap inside morph 0..1 */
  swap: number;
  ex?: Record<CarId, Explode>;
  wing?: Record<CarId, Wing>;
  /** draws a lifted shadow on the ground */
  casts?: boolean;
};

/** Bottom → top. */
export const PANELS: PanelDef[] = [
  { base: "floor", sided: false, box: [-430, -185, 430, 185], t: [0, 1], swap: 0.5 },
  {
    base: "wheelF",
    sided: true,
    box: [-334, -182, -166, -104],
    t: [0.1, 0.8],
    swap: 0.36,
    ex: {
      a: { dx: -4, dy: -34, rot: 0, lift: 0, pivot: [-236, -135] },
      b: { dx: -4, dy: -34, rot: 0, lift: 0, pivot: [-260, -147] },
    },
  },
  {
    base: "wheelR",
    sided: true,
    box: [142, -184, 326, -106],
    t: [0.12, 0.82],
    swap: 0.62,
    ex: {
      a: { dx: 6, dy: -36, rot: 0, lift: 0, pivot: [214, -144] },
      b: { dx: 6, dy: -36, rot: 0, lift: 0, pivot: [240, -149] },
    },
  },
  { base: "interior", sided: false, box: [-136, -136, 176, 136], t: [0, 1], swap: 0.5 },
  {
    base: "deck",
    sided: false,
    box: [96, -136, 424, 136],
    t: [0.04, 0.74],
    swap: 0.66,
    casts: true,
    ex: {
      a: { dx: 84, dy: 0, rot: 0, lift: 50, tiltY: 6, pivot: [240, 0] },
      b: { dx: 76, dy: 0, rot: 0, lift: 50, tiltY: 6, pivot: [280, 0] },
    },
  },
  {
    base: "bonnet",
    sided: false,
    box: [-424, -136, -44, 136],
    t: [0.02, 0.72],
    swap: 0.34,
    casts: true,
    ex: {
      a: { dx: -84, dy: 0, rot: 0, lift: 50, tiltY: -6, pivot: [-250, 0] },
      b: { dx: -72, dy: 0, rot: 0, lift: 50, tiltY: -6, pivot: [-240, 0] },
    },
  },
  {
    base: "fenderR",
    sided: true,
    box: [26, -180, 412, -86],
    t: [0.1, 0.84],
    swap: 0.58,
    casts: true,
    ex: {
      a: { dx: 52, dy: -46, rot: -16, lift: 70, tiltX: 8, pivot: [40, -122] },
      b: { dx: 48, dy: -46, rot: -16, lift: 70, tiltX: 8, pivot: [100, -126] },
    },
  },
  {
    base: "fenderF",
    sided: true,
    box: [-414, -176, -38, -40],
    t: [0.08, 0.8],
    swap: 0.42,
    casts: true,
    ex: {
      a: { dx: -44, dy: -44, rot: 14, lift: 70, tiltX: 8, pivot: [-118, -124] },
      b: { dx: -40, dy: -44, rot: 14, lift: 70, tiltX: 8, pivot: [-84, -130] },
    },
  },
  {
    base: "tail",
    sided: true,
    box: [316, -170, 418, -46],
    t: [0.12, 0.88],
    swap: 0.7,
    casts: true,
    ex: {
      a: { dx: 66, dy: -54, rot: -16, lift: 110, pivot: [40, -122] },
      b: { dx: 62, dy: -54, rot: -16, lift: 110, pivot: [100, -126] },
    },
  },
  {
    base: "head",
    sided: true,
    box: [-414, -164, -266, -46],
    t: [0.12, 0.86],
    swap: 0.3,
    casts: true,
    ex: {
      a: { dx: -78, dy: -62, rot: 14, lift: 130, pivot: [-118, -124] },
      b: { dx: -74, dy: -62, rot: 14, lift: 130, pivot: [-84, -130] },
    },
  },
  {
    base: "door",
    sided: true,
    box: [-118, -330, 124, -112],
    t: [0.16, 1],
    swap: 0.5,
    casts: true,
    ex: {
      a: { dx: 0, dy: 0, rot: -38, lift: 90, pivot: [-104, -121] },
      b: { dx: 0, dy: 0, rot: -38, lift: 90, pivot: [-62, -126] },
    },
    wing: {
      a: { hinge: -121, out: -144, phi: 96 },
      b: { hinge: -126, out: -152, phi: 96 },
    },
  },
  {
    base: "screen",
    sided: false,
    box: [-140, -156, -6, 156],
    t: [0, 0.62],
    swap: 0.46,
    casts: true,
    ex: {
      a: { dx: -18, dy: 0, rot: 0, lift: 170, pivot: [-110, 0] },
      b: { dx: -18, dy: 0, rot: 0, lift: 170, pivot: [-85, 0] },
    },
  },
  {
    base: "mirror",
    sided: true,
    box: [-118, -212, 0, -136],
    t: [0.2, 1],
    swap: 0.5,
    casts: true,
    ex: {
      a: { dx: 150, dy: -46, rot: 30, lift: 150, pivot: [-88, -146] },
      b: { dx: 150, dy: -46, rot: 30, lift: 150, pivot: [-52, -152] },
    },
  },
];

/**
 * Where parts sit when car A is fully exploded (explode = 1, morph = 0, nose left), as fractions
 * of the 1000 × 600 box, perspective included. For page callouts.
 */
export const CAR_ANCHORS = {
  nose: { x: 0.09, y: 0.5 },
  door: { x: 0.386, y: 0.078 },
  cockpit: { x: 0.52, y: 0.6 },
  tail: { x: 0.9, y: 0.5 },
  wheel: { x: 0.73, y: 0.8 },
} as const;
