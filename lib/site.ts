import type { CarId } from "@/components/car/types";

/**
 * Every name, colour and line of copy on the page lives here.
 * Vauclère, Verdin and Sumac are invented. Names were checked against existing
 * automakers and model names before use (no matches found).
 */

export type Spec = { label: string; value: string };

export type Palette = {
  /** page background behind this car in the hero */
  background: string;
  /** colour of the diagonal stripes / chevrons */
  stripe: string;
  /** wordmark, nav and rule ink */
  ink: string;
  /** small highlights (active states, progress) */
  accent: string;
};

export type Paint = { name: string; code: string; body: string; body2: string; interior: string; note: string };

export type CarEntry = {
  id: CarId;
  /** big, wide-tracked wordmark */
  wordmark: string;
  /** proper-case name for running text */
  name: string;
  type: string;
  line: string;
  description: string;
  palette: Palette;
  specs: Spec[];
  paints: Paint[];
  /** Anatomy callouts, keyed to anchors on the exploded car (see components/sections/Anatomy.tsx) */
  anatomy: Record<"nose" | "door" | "cockpit" | "tail" | "wheel", { title: string; detail: string }>;
};

export const SITE = {
  company: "Vauclère",
  companyCaps: "VAUCLÈRE",
  tagline: "Atelier automobile",
  place: "Lac de Vauclère",
  established: "Est. 2014",
  nav: [
    { label: "Models", href: "#models" },
    { label: "Anatomy", href: "#anatomy" },
    { label: "Atelier", href: "#house" },
    { label: "Colour", href: "#colour" },
  ],
  cta: { label: "Enquire", href: "#inquiry" },
  manifesto: {
    eyebrow: "The house",
    headline: ["Two cars.", "Built slowly,"],
    headlineItalic: "by very few hands.",
    body: [
      "Vauclère is eleven people in a long stone barn at the edge of a lake. We build two open two-seaters, Verdin and Sumac, and we have decided not to build a third.",
      "Every panel is shaped over a wooden buck, every seam is closed by someone who signs it, and every car is finished to the person who will drive it. Twenty-four leave the atelier each year.",
    ],
    figures: [
      { value: "11", label: "People in the atelier" },
      { value: "24", label: "Cars a year, no more" },
      { value: "1,400", label: "Hours in every car" },
    ],
  },
  inquiry: {
    eyebrow: "By appointment",
    headline: "A private viewing.",
    body: "Drive either car on the lake road, or sit with the people who build it. We hold four viewings a month at the atelier and will travel for the right reason.",
    locations: ["At the atelier", "At your home", "On the lake road (test drive)"],
  },
  footer: {
    disclaimer:
      "Vauclère, Verdin and Sumac are fictional. This page is a design demo: no company, car or trademark is represented, nothing is for sale, and the form sends nothing.",
  },
} as const;

export const CARS: Record<CarId, CarEntry> = {
  a: {
    id: "a",
    wordmark: "VERDIN",
    name: "Verdin",
    type: "Open two-seater",
    line: "Front-engined barchetta",
    description:
      "A long bonnet, a short tail and nothing above the shoulder line. Verdin is the car we would build if we were only allowed one.",
    palette: { background: "#ECEBDF", stripe: "#E4C9C3", ink: "#2C3A2C", accent: "#8E9F86" },
    specs: [
      { label: "Engine", value: "3.6 L flat-six, naturally aspirated" },
      { label: "Power", value: "410 hp at 8,400 rpm" },
      { label: "0–100 km/h", value: "3.9 s" },
      { label: "Top speed", value: "298 km/h" },
      { label: "Weight", value: "1,180 kg dry" },
      { label: "Price", value: "On request" },
    ],
    paints: [
      { name: "Salvia", code: "VC-01", body: "#A7B39C", body2: "#E7E6DE", interior: "#6F7A4B", note: "The colour it was drawn in." },
      { name: "Loden", code: "VC-02", body: "#56634F", body2: "#D9D6CB", interior: "#B79B6E", note: "Deep field green, tan hide." },
      { name: "Chalk", code: "VC-03", body: "#E4E1D6", body2: "#B9BCB4", interior: "#7A3B2E", note: "Warm white, oxblood cabin." },
      { name: "Lake", code: "VC-04", body: "#5D7682", body2: "#DADCD8", interior: "#C9B48E", note: "Grey-blue at seven in the morning." },
      { name: "Graphite", code: "VC-05", body: "#43464A", body2: "#9EA2A6", interior: "#A35A3A", note: "Almost black, cognac inside." },
    ],
    anatomy: {
      nose: { title: "Front clam", detail: "One aluminium skin, hand-beaten over an ash buck" },
      door: { title: "Doors", detail: "Butterfly-hinged, 7.8 kg each" },
      cockpit: { title: "Cockpit", detail: "Olive hide, machined switchgear, no screen" },
      tail: { title: "Rear clam", detail: "Lifts whole to reveal the flat-six" },
      wheel: { title: "Wheels", detail: "Forged 19 / 20 in, centre-lock" },
    },
  },
  b: {
    id: "b",
    wordmark: "SUMAC",
    name: "Sumac",
    type: "Open two-seater",
    line: "Mid-engined speedster",
    description:
      "Engine behind the seats, a cut-down screen and a body split in two colours along its waist. Sumac is the loud one.",
    palette: { background: "#EAD7D0", stripe: "#DDB5AB", ink: "#5B1715", accent: "#C4452C" },
    specs: [
      { label: "Engine", value: "4.0 L V8, twin-turbocharged" },
      { label: "Power", value: "640 hp at 7,200 rpm" },
      { label: "0–100 km/h", value: "2.9 s" },
      { label: "Top speed", value: "322 km/h" },
      { label: "Weight", value: "1,320 kg dry" },
      { label: "Price", value: "On request" },
    ],
    paints: [
      { name: "Sumac", code: "SM-01", body: "#C8462B", body2: "#C9CBCD", interior: "#ECE8E3", note: "Red over silver, white hide." },
      { name: "Ember", code: "SM-02", body: "#E0702F", body2: "#D3D4D3", interior: "#2E2B2A", note: "Burnt orange, black cabin." },
      { name: "Bordeaux", code: "SM-03", body: "#6E1F25", body2: "#B7B3AE", interior: "#D9C6A8", note: "Dark wine, sand hide." },
      { name: "Silver", code: "SM-04", body: "#BFC2C4", body2: "#7F8488", interior: "#B33A26", note: "All silver, red cabin." },
      { name: "Noir", code: "SM-05", body: "#26272A", body2: "#C9472C", interior: "#E7E1D8", note: "Black, with a red waist." },
    ],
    anatomy: {
      nose: { title: "Front clam", detail: "Carbon tub nose, red over silver split" },
      door: { title: "Doors", detail: "Dihedral, opening up and out" },
      cockpit: { title: "Cockpit", detail: "White hide, a single carbon spine" },
      tail: { title: "Engine cover", detail: "V8 under glass, vented in two" },
      wheel: { title: "Wheels", detail: "Forged 20 / 21 in, carbon-ceramic brakes" },
    },
  },
};

export const CAR_LIST: CarEntry[] = [CARS.a, CARS.b];
