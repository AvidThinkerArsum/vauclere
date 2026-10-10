import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Static export. BASE_PATH lets the same build live under a sub-path (GitHub Pages); locally it stays at the root.
export default function config(phase: string): NextConfig {
  const dev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    output: "export",
    basePath: process.env.BASE_PATH || undefined,
    images: { unoptimized: true },
    turbopack: { root: process.cwd() },
    // `*.dev.tsx` routes (the /car-lab drawing preview) exist only under `next dev`, never in the export.
    pageExtensions: dev ? ["dev.tsx", "tsx", "ts", "jsx", "js"] : ["tsx", "ts", "jsx", "js"],
  };
}
