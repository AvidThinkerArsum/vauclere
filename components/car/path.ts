/**
 * Tiny SVG path helpers for a car drawn from above with its nose pointing LEFT (−x).
 * Paths are written for the car's RIGHT side (y < 0, top of the screen) and mirrored
 * for the left side. Only absolute M / L / C / Q / Z commands are used.
 */

type Seg = { c: "M" | "L" | "C" | "Q" | "Z"; p: number[] };

const r2 = (n: number) => Math.round(n * 100) / 100;

function parse(d: string): Seg[] {
  const out: Seg[] = [];
  const re = /([MLCQZ])([^MLCQZ]*)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d))) {
    const c = m[1].toUpperCase() as Seg["c"];
    const p = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number);
    out.push({ c, p });
  }
  return out;
}

function print(segs: Seg[]): string {
  return segs.map((s) => s.c + s.p.map(r2).join(" ")).join(" ");
}

/** Mirror a path across the car's centre line (y → −y). */
export function my(d: string): string {
  return print(parse(d).map((s) => ({ c: s.c, p: s.p.map((v, i) => (i % 2 ? -v : v)) })));
}

/** Mirror across x = 0 (nose ↔ tail). */
export function mx(d: string): string {
  return print(parse(d).map((s) => ({ c: s.c, p: s.p.map((v, i) => (i % 2 ? v : -v)) })));
}

/** Reverse an open path (M followed by L/C/Q). Returns segments starting with M at the old end. */
function reverse(segs: Seg[]): Seg[] {
  const pts: number[][] = [];
  let cur: number[] = [];
  const res: Seg[] = [];
  const items: { c: Seg["c"]; from: number[]; ctrl: number[]; to: number[] }[] = [];
  for (const s of segs) {
    if (s.c === "M") {
      cur = s.p.slice(0, 2);
      pts.push(cur);
      continue;
    }
    if (s.c === "Z") continue;
    const to = s.p.slice(-2);
    items.push({ c: s.c, from: cur, ctrl: s.p.slice(0, -2), to });
    cur = to;
  }
  res.push({ c: "M", p: cur });
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (it.c === "C") {
      res.push({ c: "C", p: [it.ctrl[2], it.ctrl[3], it.ctrl[0], it.ctrl[1], ...it.from] });
    } else if (it.c === "Q") {
      res.push({ c: "Q", p: [...it.ctrl, ...it.from] });
    } else {
      res.push({ c: "L", p: [...it.from] });
    }
  }
  return res;
}

/**
 * Close a shape that is symmetric about the centre line. `half` starts on y = 0, runs
 * through the right side (y < 0) and ends back on y = 0; the left side is mirrored in.
 */
export function sym(half: string): string {
  const segs = parse(half);
  const back = reverse(parse(my(half))).slice(1); // drop the M: we are already there
  return print([...segs, ...back, { c: "Z", p: [] }]);
}

/** Join path fragments (each may start with M). */
export function join(...parts: string[]): string {
  return parts.join(" ");
}
