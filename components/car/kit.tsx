/** Reusable bits of hardware: seats, steering wheels, tyres, lamps. All drawn from above. */
import { MAT, tone } from "./palette";
import { Stitch, sid, url, type Ctx } from "./parts";

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A bucket seat seen from above, cushion toward the nose (−x). */
export function Seat({ c, cx, cy, race = false }: { c: Ctx; cx: number; cy: number; race?: boolean }) {
  const I = c.p.interior;
  const light = tone(I, 0.6);
  const stitchCol = race ? c.p.body : light;
  const x = (v: number) => r1(cx + v);
  const y = (v: number) => r1(cy + v);
  const pleats = race ? [-28, -18, -8, 2, 12] : [-30, -23, -16, -9, -2, 5, 12];
  return (
    <g>
      {/* soft drop shadow into the tub */}
      <rect x={x(-40)} y={y(-38)} width="142" height="80" rx="26" fill="#000" fillOpacity="0.55" filter={sid(c.uid, "blur5")} />
      {/* cushion + backrest bolsters */}
      <rect x={x(-42)} y={y(-35)} width="70" height="70" rx="13" fill={url(c, "bolster")} />
      <rect x={x(22)} y={y(-39)} width="60" height="78" rx={race ? 18 : 14} fill={url(c, "bolster")} />
      {/* headrest (integrated shell for the race seat) */}
      <rect x={x(76)} y={y(race ? -26 : -22)} width={race ? 26 : 24} height={race ? 52 : 44} rx="11" fill={url(c, "bolster")} />
      <rect x={x(80)} y={y(-14)} width="16" height="28" rx="7" fill={url(c, "seat")} />
      {/* inserts */}
      <rect x={x(-36)} y={y(-21)} width="58" height="42" rx="7" fill={url(c, "seat")} />
      <rect x={x(28)} y={y(-23)} width="46" height="46" rx="8" fill={url(c, "seat")} />
      {pleats.map((v) => (
        <g key={v}>
          <line x1={x(v)} y1={y(-20)} x2={x(v)} y2={y(20)} stroke={tone(I, -0.4)} strokeOpacity="0.5" strokeWidth="1.1" />
          <line x1={x(v + 1.2)} y1={y(-20)} x2={x(v + 1.2)} y2={y(20)} stroke="#fff" strokeOpacity="0.16" strokeWidth="0.8" />
        </g>
      ))}
      {[36, 46, 56, 66].map((v) => (
        <line key={v} x1={x(v)} y1={y(-22)} x2={x(v)} y2={y(22)} stroke={tone(I, -0.4)} strokeOpacity="0.4" strokeWidth="1" />
      ))}
      {/* stitching around the inserts */}
      <Stitch d={`M${x(-34)} ${y(-23.5)} L${x(20)} ${y(-23.5)} M${x(-34)} ${y(23.5)} L${x(20)} ${y(23.5)}`} col={stitchCol} o={0.85} />
      <Stitch d={`M${x(30)} ${y(-25.5)} L${x(72)} ${y(-25.5)} M${x(30)} ${y(25.5)} L${x(72)} ${y(25.5)}`} col={stitchCol} o={0.85} />
      {/* crease where cushion meets backrest */}
      <rect x={x(23)} y={y(-34)} width="4" height="68" rx="2" fill="#000" fillOpacity="0.35" />
      {race && (
        <>
          {/* harness slots + red belts folded on the cushion */}
          <rect x={x(70)} y={y(-17)} width="9" height="8" rx="2" fill="#0b0b0b" />
          <rect x={x(70)} y={y(9)} width="9" height="8" rx="2" fill="#0b0b0b" />
          <path d={`M${x(70)} ${y(-13)} L${x(10)} ${y(-8)} M${x(70)} ${y(13)} L${x(10)} ${y(8)}`} stroke={c.p.body} strokeWidth="4" strokeLinecap="round" />
          <circle cx={x(8)} cy={y(0)} r="7" fill={sid(c.uid, "alu")} stroke="#222" strokeWidth="1" />
        </>
      )}
      {/* sheen on the outer bolsters */}
      <ellipse cx={x(0)} cy={y(-30)} rx="30" ry="2.4" fill="#fff" fillOpacity="0.2" />
      <ellipse cx={x(52)} cy={y(-34)} rx="24" ry="2.4" fill="#fff" fillOpacity="0.18" />
    </g>
  );
}

/** Raked steering wheel: an ellipse from above, three spokes, a hub and a top-centre marker. */
export function SteeringWheel({
  c,
  cx,
  cy,
  rx,
  ry,
  rim,
  accent,
  flat = false,
}: {
  c: Ctx;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rim: string;
  accent: string;
  flat?: boolean;
}) {
  return (
    <g>
      <rect x={cx - 34} y={cy - 5} width="30" height="10" rx="4" fill="#111" />
      <ellipse cx={cx + 3} cy={cy + 3} rx={rx + 2} ry={ry + 2} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="7" filter={sid(c.uid, "blur2")} />
      {/* spokes */}
      <path d={`M${cx} ${cy} L${cx} ${cy - ry + 3} M${cx} ${cy} L${cx} ${cy + ry - 3} M${cx} ${cy} L${cx + rx - 3} ${cy}`} stroke={tone(rim, 0.25)} strokeWidth="5" strokeLinecap="round" />
      <path d={`M${cx} ${cy} L${cx} ${cy - ry + 3} M${cx} ${cy} L${cx} ${cy + ry - 3}`} stroke={sid(c.uid, "alu")} strokeWidth="1.6" strokeLinecap="round" />
      {flat ? (
        <path
          d={`M${cx - rx} ${cy} C${cx - rx} ${cy - ry * 0.6} ${cx - rx * 0.6} ${cy - ry} ${cx} ${cy - ry} L${cx + rx * 0.7} ${cy - ry} L${cx + rx * 0.7} ${cy + ry} L${cx} ${cy + ry} C${cx - rx * 0.6} ${cy + ry} ${cx - rx} ${cy + ry * 0.6} ${cx - rx} ${cy} Z`}
          fill="none"
          stroke={rim}
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
      ) : (
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={rim} strokeWidth="6.5" />
      )}
      <ellipse cx={cx - 1} cy={cy} rx={rx - 2} ry={ry - 2} fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="1.4" strokeDasharray={`${ry * 1.4} ${ry * 4}`} />
      {/* hub */}
      <ellipse cx={cx} cy={cy} rx="7" ry="10" fill={tone(rim, 0.1)} />
      <ellipse cx={cx} cy={cy} rx="3.6" ry="5" fill={sid(c.uid, "chrome")} />
      {/* top-centre marker (toward the dash) */}
      <rect x={cx - rx - 3.5} y={cy - 3} width="7" height="6" rx="1.5" fill={accent} />
    </g>
  );
}

/** A tyre seen from above: rounded block, tread grooves and sipes, shoulder highlight. */
export function Tyre({ c, x, y, l, w }: { c: Ctx; x: number; y: number; l: number; w: number }) {
  const grooves = [0.28, 0.5, 0.72];
  const sipes = Math.floor(l / 9);
  return (
    <g>
      <rect x={x} y={y} width={l} height={w} rx={Math.min(18, l * 0.15)} fill={sid(c.uid, "tyre")} />
      {grooves.map((g) => (
        <line key={g} x1={x + 8} x2={x + l - 8} y1={r1(y + w * g)} y2={r1(y + w * g)} stroke="#000" strokeOpacity="0.75" strokeWidth="2.2" />
      ))}
      {Array.from({ length: sipes }).map((_, i) => {
        const xx = r1(x + 6 + (i * (l - 12)) / (sipes - 1));
        return <line key={i} x1={xx} x2={xx + 3} y1={y + 3} y2={r1(y + w * 0.26)} stroke="#000" strokeOpacity="0.5" strokeWidth="1.2" />;
      })}
      {Array.from({ length: sipes }).map((_, i) => {
        const xx = r1(x + 6 + (i * (l - 12)) / (sipes - 1));
        return <line key={i} x1={xx} x2={xx - 3} y1={r1(y + w * 0.74)} y2={y + w - 3} stroke="#000" strokeOpacity="0.5" strokeWidth="1.2" />;
      })}
      <rect x={x + 10} y={r1(y + w * 0.38)} width={l - 20} height={r1(w * 0.07)} rx="1" fill="#fff" fillOpacity="0.07" />
      <rect x={x + 4} y={y + 1} width={l - 8} height="2" rx="1" fill="#fff" fillOpacity="0.08" />
    </g>
  );
}

/** Round headlamp: chrome bezel, domed glass, reflector rings, light ring and a glint. */
export function Lamp({ c, cx, cy, r }: { c: Ctx; cx: number; cy: number; r: number }) {
  const s = (n: string) => sid(c.uid, n);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={s("chrome")} />
      <circle cx={cx} cy={cy} r={r - 3} fill="#20262a" />
      <circle cx={cx} cy={cy} r={r - 4} fill={s("lens")} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke="#fff" strokeWidth="2.2" strokeOpacity="0.95" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke="#9fd2ff" strokeWidth="5" strokeOpacity="0.18" />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#cfd8dd" stroke="#8a969d" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#5b666d" />
      <ellipse cx={cx - r * 0.35} cy={cy - r * 0.4} rx={r * 0.32} ry={r * 0.16} fill="#fff" fillOpacity="0.9" transform={`rotate(-35 ${cx - r * 0.35} ${cy - r * 0.4})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MAT.chassisDark} strokeOpacity="0.5" strokeWidth="1" />
    </g>
  );
}
