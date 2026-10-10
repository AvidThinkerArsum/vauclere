/**
 * Car B: a red-over-silver open GT with the engine behind the seats. Long, sharp nose with
 * angular vents and slit lamps, cut-down screen, white race seats, glass engine cover.
 * Drawn from above, nose LEFT (the page turns it 180° so it faces right); one-sided panels are
 * drawn for the right side (y < 0).
 */
import type { Art } from "./geometry";
import { MAT, tone } from "./palette";
import { Paintwork, Soft, Stitch, Streak, sid, url, type Ctx } from "./parts";
import { sym } from "./path";
import { Seat, SteeringWheel, Tyre } from "./kit";

// ---- outline knots (right side) --------------------------------------------------------
const b01 = "C-412 -24 -410 -44 -406 -62";
const b12 = "C-402 -84 -396 -106 -388 -122";
const b23 = "C-370 -150 -338 -162 -300 -164";
const b34 = "C-250 -166 -196 -164 -160 -160";
const b45 = "C-120 -156 -92 -152 -70 -152";
const b56 = "L100 -152";
const b67 = "C126 -152 146 -168 170 -170";
const b78 = "C230 -173 300 -171 340 -164";
const b89 = "C372 -158 394 -140 398 -112";
const b910 = "C404 -80 408 -40 408 0";

export const OUTLINE_B = sym(`M-412 0 ${b01} ${b12} ${b23} ${b34} ${b45} ${b56} ${b67} ${b78} ${b89} ${b910}`);

const BONNET = sym("M-399 0 C-399 -22 -396 -42 -390 -56 L-104 -114 C-103 -70 -102 -36 -102 0");
const NOSE = sym("M-412 0 C-412 -24 -410 -44 -406 -62 L-390 -56 C-396 -42 -399 -22 -399 0");
const FENDER_F = `M-406 -62 ${b12} ${b23} ${b34} ${b45} L-84 -130 L-104 -114 L-390 -56 Z`;
const DOOR = "M-70 -152 L100 -152 C104 -144 103 -134 98 -126 L-62 -126 C-66 -134 -68 -142 -70 -152 Z";
const DOOR_SKIN =
  "M-68 -152 C-20 -155 50 -155 98 -152 C102 -196 98 -240 84 -278 C78 -286 68 -290 56 -290 L-30 -288 C-44 -286 -52 -278 -56 -266 C-64 -230 -70 -192 -68 -152 Z";
const FENDER_R = `M100 -152 ${b67} ${b78} ${b89} L384 -108 C320 -114 220 -122 140 -126 L98 -126 C103 -134 104 -144 100 -152 Z`;
const DECK = sym("M140 0 L140 -126 C220 -122 320 -114 384 -108 C388 -70 390 -34 390 0");
const TAIL = sym("M390 0 C390 -34 388 -70 384 -108 L398 -112 C404 -80 408 -40 408 0");
const SCREEN = sym("M-104 0 C-104 -56 -100 -104 -88 -134 L-74 -138 C-66 -110 -66 -56 -66 0");
const TUB = sym("M-92 0 L-92 -126 L118 -126 C132 -126 140 -116 140 -100 L140 0");
const MIRROR = "M-76 -170 L-36 -177 C-29 -178 -27 -187 -33 -191 L-70 -193 C-79 -191 -81 -175 -76 -170 Z";
const HEAD = "M-394 -66 C-390 -92 -380 -116 -360 -136 L-346 -140 L-344 -130 C-362 -112 -374 -92 -380 -66 Z";
const TAIL_LAMP = "M346 -161 L384 -142 C392 -134 396 -122 397 -104 L389 -104 C388 -120 384 -130 378 -136 L342 -154 Z";

export const B: Art = {
  shadow: { shape: OUTLINE_B, draw: () => null },

  floor: {
    shape: OUTLINE_B,
    draw: (c) => {
      const s = (n: string) => sid(c.uid, n);
      return (
        <g>
          <path d={OUTLINE_B} fill={MAT.chassisDark} transform="scale(0.985 0.96)" />
          <path d={sym("M-120 0 L-120 -140 L360 -140 L360 0")} fill={MAT.chassis} />
          <path d={sym("M-120 0 L-120 -140 L360 -140 L360 0")} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="2" />
          {/* carbon tub floor under the cabin */}
          <path d={sym("M-92 0 L-92 -128 L140 -128 L140 0")} fill={s("carbon")} opacity="0.9" />
          {/* front: luggage well between two angled radiators */}
          <rect x="-360" y="-90" width="230" height="180" rx="30" fill="#1c1d20" />
          {[-1, 1].map((k) => (
            <g key={k} transform={`translate(-360 ${k * 104}) rotate(${k * 18})`}>
              <rect x="0" y="-16" width="70" height="32" rx="4" fill={s("alu")} />
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1={4 + i * 5.5} x2={4 + i * 5.5} y1="-14" y2="14" stroke="#000" strokeOpacity="0.35" strokeWidth="1.4" />
              ))}
            </g>
          ))}
          {[-1, 1].map((k) => (
            <g key={k}>
              <path d={`M-290 ${k * 70} L-262 ${k * 124} L-232 ${k * 70}`} fill="none" stroke="#5a6066" strokeWidth="5" strokeLinejoin="round" />
              <rect x="-276" y={k * 124 - 7} width="28" height="14" rx="4" fill="#3b3f44" />
            </g>
          ))}
          {/* V8 behind the seats */}
          <rect x="150" y="-22" width="180" height="44" rx="10" fill="#2a2c30" />
          {[-1, 1].map((k) => (
            <g key={k}>
              <path d={`M160 ${k * 18} L322 ${k * 24} L322 ${k * 74} L160 ${k * 64} Z`} fill="#34373b" />
              <path d={`M168 ${k * 24} L314 ${k * 30} L314 ${k * 66} L168 ${k * 58} Z`} fill={tone(c.p.body, -0.15)} />
              <path d={`M168 ${k * 24} L314 ${k * 30} L314 ${k * 66} L168 ${k * 58} Z`} fill="none" stroke="#000" strokeOpacity="0.45" />
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={190 + i * 36} cy={k * (42 + i * 1.5)} r="5" fill={s("alu")} />
              ))}
              <circle cx="346" cy={k * 52} r="17" fill={s("alu")} />
              <circle cx="346" cy={k * 52} r="9" fill="#222" />
              <path d={`M200 ${k * 118} L240 ${k * 140} L300 ${k * 112}`} fill="none" stroke="#5a6066" strokeWidth="6" strokeLinejoin="round" />
              <rect x="226" y={k * 140 - 8} width="28" height="16" rx="4" fill="#3b3f44" />
            </g>
          ))}
          <rect x="176" y="-14" width="132" height="28" rx="8" fill={s("carbon")} />
          <rect x="176" y="-14" width="132" height="28" rx="8" fill="none" stroke="#000" strokeOpacity="0.5" />
          {/* reads upright once the page has turned car B to face right */}
          <text x="242" y="4" textAnchor="middle" fontSize="9" letterSpacing="3" fill="#d9d9d9" fontFamily="ui-sans-serif, system-ui" transform="rotate(180 242 0)">
            V8 · 4.0
          </text>
          <rect x="332" y="-22" width="44" height="44" rx="8" fill="#8d949a" />
          {[-30, -12, 12, 30].map((y) => (
            <ellipse key={y} cx="400" cy={y} rx="4" ry="6" fill={s("chrome")} />
          ))}
        </g>
      );
    },
  },

  wheelF: {
    shape: "M-326 -172 L-198 -172 L-198 -126 L-326 -126 Z",
    draw: (c) => <Tyre c={c} x={-326} y={-172} l={128} w={46} />,
  },
  wheelR: {
    shape: "M174 -177 L306 -177 L306 -121 L174 -121 Z",
    draw: (c) => <Tyre c={c} x={174} y={-177} l={132} w={56} />,
  },

  interior: {
    shape: TUB,
    draw: (c) => <InteriorB c={c} />,
  },

  bonnet: {
    shape: sym("M-412 0 C-412 -24 -410 -44 -406 -62 L-390 -56 L-104 -114 C-103 -70 -102 -36 -102 0"),
    draw: (c) => (
      <g>
        <Paintwork c={c} d={NOSE} name="nose" two>
          <Streak d="M-408 -40 C-410 -20 -410 20 -408 40" w={1.6} o={0.5} />
        </Paintwork>
        {/* front intake mesh in the nose */}
        <path d={sym("M-405 0 C-405 -20 -404 -36 -401 -48 L-397 -47 C-399 -34 -400 -20 -400 0")} fill="#121314" />
        <Paintwork c={c} d={BONNET} name="bonnet">
          <Soft c={c} d="M-390 -56 L-104 -114" w={26} o={0.3} />
          <Soft c={c} d="M-390 56 L-104 114" w={26} o={0.34} />
          <Soft c={c} d="M-380 -12 L-110 -20" w={22} col="#fff" o={0.16} />
          <path d="M-380 -24 L-110 -46 L-110 30 L-380 18 Z" fill="#fff" fillOpacity="0.1" />
          <path d="M-380 -24 L-110 -46" stroke="#fff" strokeOpacity="0.32" strokeWidth="2" />
          <Streak d="M-376 -58 L-112 -110" w={2} o={0.45} />
          {/* sharp centre spine */}
          <path d="M-396 0 L-104 0" stroke={tone(c.p.body, -0.4)} strokeOpacity="0.5" strokeWidth="1.2" />
          <path d="M-396 -1.5 L-104 -1.5" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
          {/* angular heat extractors */}
          {[-1, 1].map((k) => (
            <g key={k}>
              <path d={`M-262 ${k * 22} L-172 ${k * 30} L-160 ${k * 74} L-236 ${k * 62} Z`} fill="#141516" />
              {Array.from({ length: 7 }).map((_, i) => {
                const t = (i + 1) / 8;
                const x1 = Math.round((-262 + (-236 + 262) * t) * 10) / 10;
                const y1 = Math.round((22 + (62 - 22) * t) * 10) / 10;
                const x2 = Math.round((-172 + (-160 + 172) * t) * 10) / 10;
                const y2 = Math.round((30 + (74 - 30) * t) * 10) / 10;
                return <line key={i} x1={x1} y1={k * y1} x2={x2} y2={k * y2} stroke={tone(c.p.body, -0.2)} strokeWidth="2" />;
              })}
              <path d={`M-262 ${k * 22} L-172 ${k * 30}`} stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" />
            </g>
          ))}
        </Paintwork>
        {/* nose badge */}
        <path d="M-388 -5 L-380 0 L-388 5 L-384 0 Z" fill={sid(c.uid, "chrome")} />
      </g>
    ),
  },

  fenderF: {
    shape: FENDER_F,
    draw: (c) => (
      <g>
        <Paintwork c={c} d={FENDER_F} name="fenderF" two>
          <Soft c={c} d="M-390 -56 L-104 -114" w={28} o={0.3} />
          <Soft c={c} d="M-372 -126 C-330 -144 -250 -148 -110 -138" w={22} col="#fff" o={0.35} />
          <Streak d="M-384 -114 C-366 -140 -330 -152 -290 -154 C-230 -156 -170 -152 -96 -142" w={3} o={0.8} />
          <ellipse cx="-240" cy="-130" rx="80" ry="12" fill={sid(c.uid, "spec")} opacity="0.35" />
        </Paintwork>
        {/* red waist line carried onto the wing */}
        <path d="M-390 -58 L-104 -116 L-96 -122 L-392 -64 Z" fill={c.p.body} opacity="0.95" />
        {/* lamp recess */}
        <path d="M-398 -64 C-394 -94 -382 -120 -360 -142 L-342 -146 L-338 -128 C-358 -110 -370 -90 -376 -62 Z" fill="#0f1011" />
        {/* sharp front intake + wing gills behind the wheel */}
        <path d="M-370 -136 L-322 -150 L-318 -142 L-362 -128 Z" fill="#141516" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${-176 + i * 14} -140 L${-160 + i * 14} -154 L${-156 + i * 14} -152 L${-172 + i * 14} -138 Z`} fill="#141516" />
        ))}
      </g>
    ),
  },

  door: {
    shape: DOOR,
    draw: (c) => (
      <g>
        <Paintwork c={c} d={DOOR} name="door">
          <Streak d="M-62 -145 L98 -145" w={2.6} o={0.75} />
        </Paintwork>
        <path d="M-62 -126 L98 -126 L97 -132 L-64 -132 Z" fill="#1b1b1c" />
        <Stitch d="M-60 -129 L96 -129" col={c.p.body} o={0.9} />
      </g>
    ),
    skin: {
      shape: DOOR_SKIN,
      draw: (c) => <DoorSkinB c={c} />,
    },
  },

  mirror: {
    shape: MIRROR,
    draw: (c) => (
      <g>
        <path d="M-56 -150 L-48 -150 L-52 -174 L-58 -174 Z" fill="#1a1a1b" />
        <Paintwork c={c} d={MIRROR} name="mirror" edge={0.8} blob>
          <path d="M-74 -178 L-34 -183" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        </Paintwork>
      </g>
    ),
  },

  fenderR: {
    shape: FENDER_R,
    draw: (c) => (
      <g>
        <Paintwork c={c} d={FENDER_R} name="fenderR" two>
          <Soft c={c} d="M384 -108 C320 -114 220 -122 140 -126 L100 -127" w={30} o={0.3} />
          <Soft c={c} d="M130 -150 C200 -160 300 -160 370 -136" w={22} col="#fff" o={0.32} />
          <Streak d="M118 -146 C150 -156 190 -162 250 -163 C300 -163 344 -156 380 -130" w={3.2} o={0.85} />
          <ellipse cx="260" cy="-146" rx="90" ry="12" fill={sid(c.uid, "spec")} opacity="0.3" />
        </Paintwork>
        {/* side intake mouth on top of the hip */}
        <path d="M108 -146 C130 -150 160 -156 196 -160 L200 -150 C168 -146 136 -140 112 -136 Z" fill="#111213" />
        <path d="M108 -146 C130 -150 160 -156 196 -160" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.2" fill="none" />
        {/* red waist line along the deck seam */}
        <path d="M140 -126 C220 -122 320 -114 384 -108 L386 -114 C320 -120 220 -128 140 -132 Z" fill={c.p.body} />
      </g>
    ),
  },

  deck: {
    shape: sym("M140 0 L140 -126 C220 -122 320 -114 384 -108 L398 -112 C404 -80 408 -40 408 0"),
    draw: (c) => <DeckB c={c} />,
  },

  screen: {
    shape: SCREEN,
    draw: (c) => {
      const s = (n: string) => sid(c.uid, n);
      const clip = `${c.uid}-b-scr`;
      return (
        <g>
          <defs>
            <clipPath id={clip}>
              <path d={SCREEN} />
            </clipPath>
          </defs>
          <path d={SCREEN} fill={s("glass")} />
          <g clipPath={`url(#${clip})`}>
            <path d="M-110 -150 L-90 -150 L-76 150 L-110 150 Z" fill="#cfe0e6" fillOpacity="0.26" />
            <path d="M-100 -96 L-84 -128 L-78 -128 L-94 -96 Z" fill="#fff" fillOpacity="0.55" />
            <path d="M-102 40 L-82 -70 L-78 -70 L-98 40 Z" fill="#fff" fillOpacity="0.28" />
          </g>
          <path d="M-74 -138 C-66 -110 -66 -56 -66 0 C-66 56 -66 110 -74 138" fill="none" stroke="#0d0d0e" strokeWidth="6" strokeLinecap="round" />
          <path d="M-88 -134 C-100 -104 -104 -56 -104 0 C-104 56 -100 104 -88 134" fill="none" stroke="#0c0d0e" strokeWidth="2.4" />
          <path d="M-90 -135 L-72 -140" stroke="#111" strokeWidth="6" strokeLinecap="round" />
          <path d="M-90 135 L-72 140" stroke="#111" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    },
  },

  head: {
    shape: HEAD,
    draw: (c) => {
      const s = (n: string) => sid(c.uid, n);
      return (
        <g>
          <path d={HEAD} fill="#1a1d20" />
          <path d="M-390 -68 C-386 -92 -377 -113 -359 -132 L-350 -134 L-349 -129 C-366 -111 -374 -92 -379 -68 Z" fill={s("lens")} />
          <path d="M-387 -70 C-383 -92 -375 -112 -358 -129" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M-387 -70 C-383 -92 -375 -112 -358 -129" fill="none" stroke="#9fd2ff" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" />
          <circle cx="-376" cy="-96" r="4.5" fill="#e8eef1" stroke="#7d8890" strokeWidth="1" />
          <circle cx="-367" cy="-112" r="4" fill="#e8eef1" stroke="#7d8890" strokeWidth="1" />
          <path d="M-376 -76 L-372 -86" stroke={MAT.amber} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    },
  },

  tail: {
    shape: TAIL_LAMP,
    draw: (c) => (
      <g>
        <path d={TAIL_LAMP} fill={sid(c.uid, "tail")} />
        <path d="M348 -157 L382 -140 C389 -133 392 -122 393 -106" fill="none" stroke={MAT.tailHi} strokeWidth="1.4" strokeLinecap="round" />
      </g>
    ),
  },
};

function DoorSkinB({ c }: { c: Ctx }) {
  const clip = `${c.uid}-b-dskin`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={DOOR_SKIN} />
        </clipPath>
      </defs>
      <path d={DOOR_SKIN} fill={url(c, "side")} />
      <g clipPath={`url(#${clip})`}>
        {/* waist split: silver below a crisp crease */}
        <path d="M-80 -244 L110 -232 L110 -320 L-80 -320 Z" fill={url(c, "side2")} />
        <path d="M-80 -244 L110 -232" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" />
        {/* intake scoop toward the rear */}
        <path d="M42 -200 L98 -194 C98 -218 96 -238 92 -256 L64 -244 Z" fill="#121314" />
        <path d="M50 -206 L94 -201 L92 -240 L68 -232 Z" fill="#2a2c2f" />
        <path d="M42 -200 L98 -194" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" />
        <path d="M-80 -158 L110 -158" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
      </g>
      <path d={DOOR_SKIN} fill="none" stroke={tone(c.p.body, -0.6)} strokeOpacity="0.7" strokeWidth="1.4" />
      <rect x="-10" y="-176" width="24" height="5" rx="2.5" fill={tone(c.p.body, -0.55)} />
    </g>
  );
}

function DeckB({ c }: { c: Ctx }) {
  const s = (n: string) => sid(c.uid, n);
  const win = sym("M206 0 L206 -60 C250 -64 300 -66 340 -66 L346 -66 L346 0");
  const deck = `${DECK} ${win}`;
  return (
    <g>
      <Paintwork c={c} d={TAIL} name="tailcap" two>
        <Streak d="M404 -60 C406 -30 406 30 404 60" w={1.4} o={0.4} />
      </Paintwork>
      <Paintwork c={c} d={deck} name="deck" evenodd>
        <Soft c={c} d="M140 -126 C220 -122 320 -114 384 -108" w={26} o={0.3} />
        <Soft c={c} d="M140 126 C220 122 320 114 384 108" w={26} o={0.34} />
        <Soft c={c} d={win} w={14} o={0.35} />
        {/* roll hoops / buttresses behind each seat */}
        {[-1, 1].map((k) => (
          <g key={k}>
            <path d={`M142 ${k * 30} C170 ${k * 26} 200 ${k * 40} 214 ${k * 62} C200 ${k * 84} 170 ${k * 98} 142 ${k * 94} Z`} fill="#000" fillOpacity="0.12" />
            <Streak d={`M146 ${k * 44} C170 ${k * 42} 192 ${k * 48} 208 ${k * 62}`} w={2} o={k < 0 ? 0.6 : 0.35} />
          </g>
        ))}
        {/* ducktail lip */}
        <path d="M368 -100 C374 -60 376 -30 376 0 C376 30 374 60 368 100 L384 108 C388 70 390 34 390 0 C390 -34 388 -70 384 -108 Z" fill="#000" fillOpacity="0.18" />
        <Streak d="M372 -90 C376 -50 377 50 372 90" w={1.4} o={0.5} />
      </Paintwork>
      {/* engine glass: tinted, so the V8 shows through */}
      <path d={win} fill="#0b0e10" fillOpacity="0.38" />
      <path d={win} fill={s("refl")} opacity="0.35" />
      <path d={win} fill="none" stroke="#0c0c0d" strokeWidth="3" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${222 + i * 26} -60 L${222 + i * 26} 60`} stroke="#0c0c0d" strokeOpacity="0.8" strokeWidth="3" />
      ))}
      <path d="M212 -54 L336 -60" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" />
      {/* cabin rear rim */}
      <path d="M140 -122 L146 -122 C148 -60 148 60 146 122 L140 122 Z" fill="#1b1b1c" />
      <Stitch d="M143.4 -118 C145 -60 145 60 143.4 118" col={c.p.body} o={0.9} />
      {/* light bar + badge */}
      <path d="M392 -96 C394 -50 394 50 392 96" fill="none" stroke={MAT.tail} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M392 -96 C394 -50 394 50 392 96" fill="none" stroke={MAT.tailHi} strokeOpacity="0.8" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M356 -5 L364 0 L356 5 L360 0 Z" fill={s("chrome")} />
    </g>
  );
}

function InteriorB({ c }: { c: Ctx }) {
  const s = (n: string) => sid(c.uid, n);
  return (
    <g>
      <path d={TUB} fill="#151516" />
      <path d={TUB} fill={s("carbon")} opacity="0.5" />
      <rect x="-86" y="-118" width="48" height="236" rx="10" fill="#000" fillOpacity="0.35" />
      {[44, 62, 82].map((y, i) => (
        <rect key={y} x="-82" y={y} width="12" height={i === 2 ? 14 : 9} rx="2" fill={s("alu")} />
      ))}
      {/* dash */}
      <path d={sym("M-92 0 L-92 -126 L-58 -126 C-62 -90 -62 -40 -60 0")} fill="#1e1e20" />
      <path d="M-58 -126 C-62 -90 -62 -40 -60 0 C-62 40 -62 90 -58 126" fill="none" stroke={c.p.body} strokeOpacity="0.85" strokeWidth="1.4" />
      <path d="M-82 30 L-60 32 L-60 92 L-82 94 Z" fill="#0d0d0e" />
      <path d="M-62 34 L-62 90" stroke="#5ad1ff" strokeOpacity="0.35" strokeWidth="2" />
      {/* carbon spine console */}
      <path d="M-62 -14 L96 -10 C104 -10 108 -6 108 0 C108 6 104 10 96 10 L-62 14 Z" fill={s("carbon")} />
      <path d="M-62 -14 L96 -10 C104 -10 108 -6 108 0 C108 6 104 10 96 10 L-62 14" fill="none" stroke="#000" strokeOpacity="0.6" />
      {[-40, -26, -12].map((x) => (
        <rect key={x} x={x} y="-6" width="9" height="12" rx="2" fill={x === -40 ? c.p.body : s("alu")} />
      ))}
      <circle cx="20" cy="0" r="7" fill={s("alu")} />
      <circle cx="18.5" cy="-1.5" r="2.4" fill="#fff" fillOpacity="0.8" />
      {/* flat-bottomed wheel, driver on the car's left (+y) */}
      <SteeringWheel c={c} cx={-30} cy={60} rx={15} ry={32} rim="#161617" accent={c.p.body} flat />
      <Seat c={c} cx={26} cy={60} race />
      <Seat c={c} cx={26} cy={-60} race />
      <path d={TUB} fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="10" filter={s("blur5")} />
    </g>
  );
}
