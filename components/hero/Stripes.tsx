"use client";

import { motion, type MotionValue } from "framer-motion";

type N = MotionValue<number> | number;
type C = MotionValue<string> | string;

const H = 1000;
const PERIOD = 240;
const DEPTH = 470; // how far the vertex sits to the right of the arms' ends

/**
 * Right-pointing chevrons. Thin and faint at rest (the reel's pale stripes), fat and bold mid-transition.
 * The vertex sits at mid-height, behind the car.
 */
export function Stripes({
  width = 1600,
  stroke,
  strokeWidth,
  x,
  opacity = 1,
}: {
  width?: number;
  stroke: C;
  strokeWidth: N;
  x: N;
  opacity?: N;
}) {
  // Enough chevrons to cover the frame while the group slides up to 4 periods right.
  const from = -Math.ceil((DEPTH + 4 * PERIOD) / PERIOD) - 1;
  const to = Math.ceil(width / PERIOD) + 1;
  const paths: string[] = [];
  for (let i = from; i <= to; i++) {
    const x0 = Math.round(i * PERIOD);
    paths.push(`M${x0} -80 L${x0 + DEPTH} ${H / 2} L${x0} ${H + 80}`);
  }
  return (
    <svg aria-hidden viewBox={`0 0 ${width} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <motion.g style={{ x, stroke, strokeWidth, opacity }} fill="none" strokeLinejoin="miter" strokeMiterlimit={10}>
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </motion.g>
    </svg>
  );
}
