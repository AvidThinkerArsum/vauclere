/**
 * Car A: a sage roadster, rear-engined. Short overhangs, round lamps set into the front wings,
 * wide hips over the rear wheels, a low wrap-around screen and two humps behind the seats.
 * Drawn from above, nose LEFT; one-sided panels are drawn for the right side (y < 0).
 */
import type { Art } from "./geometry";
import { MAT, tone } from "./palette";
import { Paintwork, Soft, Stitch, Streak, sid, url, type Ctx } from "./parts";
import { sym } from "./path";
import { Seat, SteeringWheel, Tyre, Lamp } from "./kit";

// ---- outline knots (right side) --------------------------------------------------------
const s01 = "C-372 -24 -371 -44 -368 -60";
const s12 = "C-366 -74 -362 -88 -356 -98";
const s23 = "C-344 -124 -318 -146 -284 -150";
const s34 = "C-240 -155 -180 -155 -140 -150";
const s45 = "C-126 -148 -116 -145 -108 -144";
const s56 = "L40 -144";
const s67 = "C70 -144 92 -160 130 -162";
const s78 = "C200 -167 272 -165 318 -156";
const s89 = "C346 -150 362 -126 368 -96";
const s910 = "C373 -70 374 -36 374 0";

export const OUTLINE_A = sym(`M-372 0 ${s01} ${s12} ${s23} ${s34} ${s45} ${s56} ${s67} ${s78} ${s89} ${s910}`);

const BONNET = sym("M-361 0 C-361 -24 -358 -44 -352 -58 C-300 -70 -200 -94 -128 -108 C-127 -70 -126 -36 -126 0");
const NOSE = sym("M-372 0 C-372 -24 -371 -44 -368 -60 L-352 -58 C-358 -44 -361 -24 -361 0");
const FENDER_F = `M-368 -60 ${s12} ${s23} ${s34} ${s45} L-118 -124 L-128 -108 C-200 -94 -300 -70 -352 -58 Z`;
const DOOR = "M-108 -144 L40 -144 C43 -136 42 -127 37 -121 L-96 -121 C-100 -126 -104 -134 -108 -144 Z";
const DOOR_SKIN =
  "M-106 -144 C-60 -147 0 -147 38 -144 C42 -190 38 -236 28 -272 C22 -281 10 -284 -4 -284 L-68 -283 C-82 -281 -90 -274 -93 -264 C-103 -226 -108 -186 -106 -144 Z";
const FENDER_R = `M40 -144 ${s67} ${s78} ${s89} L352 -98 C300 -104 180 -116 112 -121 L37 -121 C42 -127 43 -136 40 -144 Z`;
const DECK = sym("M112 0 L112 -121 C180 -116 300 -104 352 -98 C355 -60 356 -30 356 0");
const TAIL = sym("M356 0 C356 -30 355 -60 352 -98 L368 -96 C373 -70 374 -36 374 0");
const SCREEN = sym("M-127 0 C-127 -50 -124 -100 -112 -128 L-100 -131 C-92 -104 -91 -52 -91 0");
const TUB = sym("M-112 0 L-112 -121 L84 -121 C102 -121 112 -110 112 -92 L112 0");
const MIRROR =
  "M-108 -176 C-108 -190 -98 -195 -90 -193 C-80 -191 -75 -183 -75 -176 C-75 -168 -81 -162 -92 -162 C-102 -162 -108 -166 -108 -176 Z";
const TAIL_LAMP = "M330 -152 C350 -147 362 -128 366 -100 L358 -100 C354 -124 345 -139 328 -145 Z";

export const A: Art = {
  shadow: { shape: OUTLINE_A, draw: () => null },

  floor: {
    shape: OUTLINE_A,
    draw: (c) => {
      const s = (n: string) => sid(c.uid, n);
      return (
        <g>
          <path d={OUTLINE_A} fill={MAT.chassisDark} transform="scale(0.985 0.96)" />
          {/* sills and tub */}
          <path d={sym("M-150 0 L-150 -132 L330 -132 L330 0")} fill={MAT.chassis} />
          <path d={sym("M-150 0 L-150 -132 L330 -132 L330 0")} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="2" />
          {[-120, -60, 0, 60].map((x) => (
            <line key={x} x1={x} y1="-131" x2={x} y2="131" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
          ))}
          {/* front luggage well + tank */}
          <rect x="-338" y="-96" width="196" height="192" rx="34" fill="#1d1f22" />
          <rect x="-328" y="-86" width="176" height="172" rx="28" fill="none" stroke="#3a3d41" strokeWidth="1.5" />
          <path d="M-300 -58 L-176 -64 C-166 -64 -160 -56 -160 -46 L-160 46 C-160 56 -166 64 -176 64 L-300 58 C-312 57 -318 50 -318 40 L-318 -40 C-318 -50 -312 -57 -300 -58 Z" fill={s("alu")} />
          {[-280, -255, -230, -205, -180].map((x) => (
            <line key={x} x1={x} y1="-56" x2={x} y2="56" stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
          ))}
          <circle cx="-196" cy="-30" r="9" fill={s("chrome")} stroke="#333" strokeWidth="1" />
          {/* front suspension */}
          {[-1, 1].map((k) => (
            <g key={k}>
              <path d={`M-262 ${k * 72} L-240 ${k * 112} L-214 ${k * 72}`} fill="none" stroke="#5a6066" strokeWidth="5" strokeLinejoin="round" />
              <rect x="-252" y={k * 112 - 7} width="24" height="14" rx="4" fill="#3b3f44" />
            </g>
          ))}
          {/* gearbox + flat six */}
          <rect x="118" y="-24" width="84" height="48" rx="12" fill={s("alu")} />
          {[132, 146, 160, 174, 188].map((x) => (
            <line key={x} x1={x} y1="-22" x2={x} y2="22" stroke="#000" strokeOpacity="0.2" strokeWidth="2" />
          ))}
          <rect x="196" y="-30" width="126" height="60" rx="14" fill="#8d949a" />
          {[-1, 1].map((k) => (
            <g key={k}>
              <rect x="206" y={k > 0 ? 30 : -92} width="108" height="62" rx="12" fill="#2e3135" />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect x={212 + i * 34} y={k > 0 ? 34 : -88} width="28" height="54" rx="8" fill={s("alu")} />
                  {[0, 1, 2, 3, 4, 5].map((j) => (
                    <line key={j} x1={214 + i * 34} x2={238 + i * 34} y1={(k > 0 ? 40 : -82) + j * 8} y2={(k > 0 ? 40 : -82) + j * 8} stroke="#000" strokeOpacity="0.28" strokeWidth="1.6" />
                  ))}
                </g>
              ))}
            </g>
          ))}
          <rect x="214" y="-16" width="92" height="32" rx="10" fill={tone(c.p.body, -0.35)} />
          <rect x="214" y="-16" width="92" height="32" rx="10" fill="none" stroke="#000" strokeOpacity="0.4" />
          <text x="260" y="4" textAnchor="middle" fontSize="9" letterSpacing="3" fill={tone(c.p.body, 0.5)} fontFamily="ui-sans-serif, system-ui">
            3.6 · SIX
          </text>
          {/* cooling fan */}
          <circle cx="330" cy="0" r="26" fill="#222" />
          <circle cx="330" cy="0" r="22" fill={s("alu")} />
          {Array.from({ length: 11 }).map((_, i) => {
            const a = (i / 11) * Math.PI * 2;
            return (
              <line key={i} x1="330" y1="0" x2={Math.round((330 + Math.cos(a) * 20) * 10) / 10} y2={Math.round(Math.sin(a) * 20 * 10) / 10} stroke="#333" strokeWidth="2" />
            );
          })}
          <circle cx="330" cy="0" r="6" fill="#1a1a1a" />
          {/* rear suspension + exhausts */}
          {[-1, 1].map((k) => (
            <g key={k}>
              <path d={`M150 ${k * 40} L212 ${k * 118} L262 ${k * 96}`} fill="none" stroke="#5a6066" strokeWidth="6" strokeLinejoin="round" />
              <rect x="200" y={k * 118 - 8} width="28" height="16" rx="4" fill="#3b3f44" />
              <rect x="350" y={k * 44 - 8} width="20" height="16" rx="7" fill={s("chrome")} />
              <ellipse cx="368" cy={k * 44} rx="3" ry="6" fill="#111" />
            </g>
          ))}
        </g>
      );
    },
  },

  wheelF: {
    shape: "M-296 -157 L-176 -157 L-176 -113 L-296 -113 Z",
    draw: (c) => <Tyre c={c} x={-296} y={-157} l={120} w={44} />,
  },
  wheelR: {
    shape: "M152 -170 L276 -170 L276 -118 L152 -118 Z",
    draw: (c) => <Tyre c={c} x={152} y={-170} l={124} w={52} />,
  },

  interior: {
    shape: TUB,
    draw: (c) => <InteriorA c={c} />,
  },

  bonnet: {
    shape: sym("M-372 0 C-372 -24 -371 -44 -368 -60 L-352 -58 C-300 -70 -200 -94 -128 -108 C-127 -70 -126 -36 -126 0"),
    draw: (c) => (
      <g>
        <Paintwork c={c} d={NOSE} name="nose" two>
          <Streak d="M-366 -40 C-368 -20 -368 20 -366 40" w={2} o={0.5} />
        </Paintwork>
        <Paintwork c={c} d={BONNET} name="bonnet">
          {/* valleys beside the wings, a domed centre */}
          <Soft c={c} d="M-352 -58 C-300 -70 -200 -94 -128 -108" w={26} o={0.3} />
          <Soft c={c} d="M-352 58 C-300 70 -200 94 -128 108" w={26} o={0.34} />
          <Soft c={c} d="M-340 0 L-140 0" w={50} col="#fff" o={0.16} />
          {/* softbox reflection: a long pale panel with a crisp leading edge */}
          <path d="M-344 -26 C-290 -34 -200 -40 -134 -42 L-134 34 C-200 32 -290 26 -344 18 Z" fill="#fff" fillOpacity="0.1" />
          <path d="M-344 -26 C-290 -34 -200 -40 -134 -42" fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="2" />
          <Streak d="M-330 -54 C-280 -64 -200 -84 -140 -98" w={2.2} o={0.45} />
          <Streak d="M-330 54 C-280 64 -200 84 -140 98" w={1.6} o={0.25} />
          {/* centre crease */}
          <path d="M-356 0 L-130 0" stroke={tone(c.p.body, -0.25)} strokeOpacity="0.35" strokeWidth="1" />
          <path d="M-356 1.4 L-130 1.4" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" />
        </Paintwork>
        {/* small crest on the nose */}
        <g transform="translate(-340 0)">
          <ellipse rx="7" ry="8.5" fill={sid(c.uid, "chrome")} />
          <ellipse rx="5" ry="6.5" fill={tone(c.p.body, -0.55)} />
          <path d="M-2.5 -3 L0 3 L2.5 -3" fill="none" stroke={tone(c.p.body2, 0.2)} strokeWidth="1.2" />
        </g>
      </g>
    ),
  },

  fenderF: {
    shape: FENDER_F,
    draw: (c) => (
      <g>
        <Paintwork c={c} d={FENDER_F} name="fenderF">
          <Soft c={c} d="M-352 -58 C-300 -70 -200 -94 -128 -108" w={28} o={0.32} />
          <Soft c={c} d="M-330 -118 C-290 -130 -220 -133 -140 -128" w={22} col="#fff" o={0.3} />
          <Streak d="M-346 -104 C-330 -128 -300 -142 -260 -142 C-210 -142 -170 -141 -128 -137" w={3} o={0.75} />
          <ellipse cx="-214" cy="-124" rx="60" ry="10" fill={sid(c.uid, "spec")} opacity="0.4" />
          {/* lamp bucket: occlusion around the bezel */}
          <circle cx="-302" cy="-110" r="27" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="6" filter={sid(c.uid, "blur2")} />
        </Paintwork>
        <circle cx="-302" cy="-110" r="25" fill={tone(c.p.body, -0.55)} />
        <circle cx="-302" cy="-110" r="22" fill="#121414" />
        <circle cx="-302" cy="-110" r="25" fill="none" stroke={sid(c.uid, "chrome")} strokeWidth="1.2" />
      </g>
    ),
  },

  door: {
    shape: DOOR,
    draw: (c) => (
      <g>
        <Paintwork c={c} d={DOOR} name="door">
          <Streak d="M-100 -138 L36 -138" w={2.6} o={0.75} />
        </Paintwork>
        {/* leather roll on the door top */}
        <path d="M-96 -121 L37 -121 L36 -127 L-98 -127 Z" fill={tone(c.p.interior, -0.1)} />
        <Stitch d="M-94 -124 L35 -124" col={tone(c.p.interior, 0.5)} o={0.7} />
      </g>
    ),
    skin: {
      shape: DOOR_SKIN,
      draw: (c) => <DoorSkinA c={c} />,
    },
  },

  mirror: {
    shape: MIRROR,
    draw: (c) => (
      <g>
        <path d="M-92 -146 L-84 -146 L-86 -166 L-94 -166 Z" fill={tone(c.p.body, -0.35)} />
        <Paintwork c={c} d={MIRROR} name="mirror" edge={0.7} blob>
          <ellipse cx="-96" cy="-182" rx="9" ry="5" fill={sid(c.uid, "spec")} opacity="0.9" />
        </Paintwork>
      </g>
    ),
  },

  fenderR: {
    shape: FENDER_R,
    draw: (c) => (
      <g>
        <Paintwork c={c} d={FENDER_R} name="fenderR">
          <Soft c={c} d="M352 -98 C300 -104 180 -116 112 -121 L40 -122" w={30} o={0.32} />
          <Soft c={c} d="M70 -146 C140 -154 260 -156 336 -140" w={22} col="#fff" o={0.3} />
          <Streak d="M60 -140 C100 -146 140 -152 200 -154 C260 -155 310 -150 344 -132" w={3.2} o={0.8} />
          <ellipse cx="220" cy="-138" rx="80" ry="14" fill={sid(c.uid, "spec")} opacity="0.3" />
        </Paintwork>
        {/* fuel filler on the right hip */}
        <circle cx="96" cy="-134" r="8" fill="none" stroke={tone(c.p.body, -0.5)} strokeOpacity="0.6" strokeWidth="1.2" />
      </g>
    ),
  },

  deck: {
    shape: sym("M112 0 L112 -121 C180 -116 300 -104 352 -98 L368 -96 C373 -70 374 -36 374 0"),
    draw: (c) => <DeckA c={c} />,
  },

  screen: {
    shape: SCREEN,
    draw: (c) => {
      const s = (n: string) => sid(c.uid, n);
      const clip = `${c.uid}-a-scr`;
      return (
        <g>
          <defs>
            <clipPath id={clip}>
              <path d={SCREEN} />
            </clipPath>
          </defs>
          <path d={SCREEN} fill={s("glass")} />
          <g clipPath={`url(#${clip})`}>
            {/* sky reflection + two sharp streaks */}
            <path d="M-130 -140 L-112 -140 L-100 140 L-130 140 Z" fill="#cfe0e6" fillOpacity="0.28" />
            <path d="M-124 -100 L-110 -126 L-104 -126 L-118 -100 Z" fill="#fff" fillOpacity="0.55" />
            <path d="M-125 30 L-108 -60 L-104 -60 L-121 30 Z" fill="#fff" fillOpacity="0.3" />
            <path d="M-125 60 L-112 20 L-110 20 L-123 60 Z" fill="#fff" fillOpacity="0.22" />
          </g>
          {/* top rail, base seal, pillars */}
          <path d="M-100 -131 C-92 -104 -91 -52 -91 0 C-91 52 -92 104 -100 131" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          <path d="M-101 -130 C-93 -104 -92.5 -52 -92.5 0 C-92.5 52 -93 104 -101 130" fill="none" stroke={s("chrome")} strokeWidth="1.6" />
          <path d="M-112 -128 C-124 -100 -127 -50 -127 0 C-127 50 -124 100 -112 128" fill="none" stroke="#0c0d0e" strokeWidth="2.4" />
          <path d="M-114 -129 L-99 -133" stroke="#141516" strokeWidth="5" strokeLinecap="round" />
          <path d="M-114 129 L-99 133" stroke="#141516" strokeWidth="5" strokeLinecap="round" />
          {/* single wiper */}
          <path d="M-124 34 L-108 -40" stroke="#0b0b0b" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    },
  },

  head: {
    shape: "M-325 -110 A23 23 0 1 0 -279 -110 A23 23 0 1 0 -325 -110 Z",
    draw: (c) => <Lamp c={c} cx={-302} cy={-110} r={23} />,
  },

  tail: {
    shape: TAIL_LAMP,
    draw: (c) => (
      <g>
        <path d={TAIL_LAMP} fill={sid(c.uid, "tail")} />
        <path d="M333 -149 C350 -144 359 -128 362 -104" fill="none" stroke={MAT.tailHi} strokeOpacity="0.9" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    ),
  },
};

function DoorSkinA({ c }: { c: Ctx }) {
  const clip = `${c.uid}-a-dskin`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={DOOR_SKIN} />
        </clipPath>
      </defs>
      <path d={DOOR_SKIN} fill={url(c, "side")} />
      <g clipPath={`url(#${clip})`}>
        {/* lower body in the second colour, under a thin chrome strake */}
        <rect x="-120" y="-300" width="170" height="44" fill={url(c, "side2")} />
        <rect x="-120" y="-258" width="170" height="2" fill={sid(c.uid, "chrome")} />
        <path d="M-110 -150 L44 -150" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
      </g>
      <path d={DOOR_SKIN} fill="none" stroke={tone(c.p.body, -0.6)} strokeOpacity="0.7" strokeWidth="1.4" />
      {/* flush handle */}
      <rect x="-2" y="-170" width="26" height="6" rx="3" fill={tone(c.p.body, -0.55)} />
      <rect x="-1" y="-169" width="24" height="1.4" rx="0.7" fill="#fff" fillOpacity="0.6" />
    </g>
  );
}

function DeckA({ c }: { c: Ctx }) {
  const s = (n: string) => sid(c.uid, n);
  return (
    <g>
      <Paintwork c={c} d={TAIL} name="tailcap" two>
        <Streak d="M370 -60 C372 -30 372 30 370 60" w={1.6} o={0.4} />
      </Paintwork>
      <Paintwork c={c} d={DECK} name="deck">
        <Soft c={c} d="M112 -121 C180 -116 300 -104 352 -98" w={26} o={0.3} />
        <Soft c={c} d="M112 121 C180 116 300 104 352 98" w={26} o={0.34} />
        {/* speedster humps behind each seat */}
        {[-1, 1].map((k) => (
          <g key={`v${k}`}>
            <Soft c={c} d={`M118 ${k * 100} C170 ${k * 104} 220 ${k * 90} 250 ${k * 62}`} w={14} o={0.3} />
            <Soft c={c} d={`M122 ${k * 50} C170 ${k * 46} 210 ${k * 50} 236 ${k * 60}`} w={16} col="#fff" o={0.28} />
            <Soft c={c} d={`M120 ${k * 8} C160 ${k * 10} 220 ${k * 26} 250 ${k * 54}`} w={10} o={0.2} />
          </g>
        ))}
        {[-1, 1].map((k) => (
          <g key={k}>
            <path
              d={`M114 ${k * 22} C114 ${k * 6} 128 ${k * 4} 150 ${k * 6} C200 ${k * 12} 238 ${k * 30} 256 ${k * 58} C238 ${k * 86} 200 ${k * 104} 150 ${k * 110} C128 ${k * 112} 114 ${k * 108} 114 ${k * 94} Z`}
              fill="#000"
              fillOpacity="0.08"
            />
            <path
              d={`M118 ${k * 26} C150 ${k * 18} 210 ${k * 36} 244 ${k * 58} C210 ${k * 80} 150 ${k * 98} 118 ${k * 90} Z`}
              fill="#fff"
              fillOpacity="0.07"
            />
            <Streak d={`M122 ${k * 40} C160 ${k * 36} 200 ${k * 44} 234 ${k * 58}`} w={2} o={k < 0 ? 0.55 : 0.3} />
          </g>
        ))}
        {/* engine-lid louvres */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = -48 + i * 12;
          return (
            <g key={i}>
              <rect x="292" y={y - 3} width="48" height="6" rx="3" fill="#0f1110" fillOpacity="0.85" />
              <rect x="292" y={y + 2.2} width="48" height="1.1" rx="0.5" fill="#fff" fillOpacity="0.35" />
            </g>
          );
        })}
        <path d="M120 0 L290 0" stroke="#fff" strokeOpacity="0.16" strokeWidth="10" />
        <Streak d="M300 -88 C330 -84 346 -76 352 -60" w={1.6} o={0.4} />
      </Paintwork>
      {/* leather roll at the cockpit rear */}
      <path d="M112 -118 L118 -118 C120 -60 120 60 118 118 L112 118 Z" fill={tone(c.p.interior, -0.1)} />
      <Stitch d="M115.4 -114 C117 -60 117 60 115.4 114" col={tone(c.p.interior, 0.5)} o={0.7} />
      {/* crest + light bar */}
      <g transform="translate(270 0)">
        <ellipse rx="8" ry="9.5" fill={s("chrome")} />
        <ellipse rx="6" ry="7.5" fill={tone(c.p.body, -0.55)} />
        <path d="M-3 -3.5 L0 3.5 L3 -3.5" fill="none" stroke={tone(c.p.body2, 0.2)} strokeWidth="1.3" />
      </g>
      <path d="M357 -92 C359 -50 359 50 357 92" fill="none" stroke={MAT.tail} strokeWidth="3" strokeLinecap="round" />
      <path d="M357 -92 C359 -50 359 50 357 92" fill="none" stroke={MAT.tailHi} strokeOpacity="0.8" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

function InteriorA({ c }: { c: Ctx }) {
  const I = c.p.interior;
  const s = (n: string) => sid(c.uid, n);
  return (
    <g>
      <path d={TUB} fill={tone(I, -0.62)} />
      <path d={TUB} fill={url(c, "int")} opacity="0.5" />
      {/* footwells, darker */}
      <rect x="-104" y="-112" width="50" height="224" rx="10" fill="#000" fillOpacity="0.35" />
      {/* pedals (driver, left = +y) */}
      {[44, 62, 82].map((y, i) => (
        <rect key={y} x="-98" y={y} width="12" height={i === 2 ? 14 : 9} rx="2" fill={s("alu")} />
      ))}
      {/* dash: leather-topped shelf following the screen */}
      <path d={sym("M-112 0 L-112 -121 L-76 -121 C-80 -90 -80 -40 -78 0")} fill={tone(I, -0.12)} />
      <path d={sym("M-112 0 L-112 -121 L-76 -121 C-80 -90 -80 -40 -78 0")} fill={url(c, "int")} opacity="0.45" />
      <path d="M-76 -121 C-80 -90 -80 -40 -78 0 C-80 40 -80 90 -76 121" fill="none" stroke={tone(I, -0.6)} strokeWidth="2" />
      <Stitch d="M-80 -116 C-83 -88 -83 -40 -81 0 C-83 40 -83 88 -80 116" col={tone(I, 0.45)} o={0.6} />
      {/* gauge hood in front of the driver */}
      <path d="M-96 24 C-96 18 -92 16 -86 16 L-70 18 C-64 18 -62 24 -62 30 L-62 86 C-62 92 -64 98 -70 98 L-86 100 C-92 100 -96 98 -96 92 Z" fill={tone(I, -0.62)} />
      <path d="M-70 20 C-64 22 -63 30 -63 34 L-63 84 C-63 90 -64 96 -70 96" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" />
      {/* twin round vents, centre */}
      {[-14, 14].map((y) => (
        <g key={y}>
          <circle cx="-94" cy={y} r="8" fill={s("alu")} />
          <circle cx="-94" cy={y} r="5.5" fill="#1a1a1a" />
        </g>
      ))}
      {/* console */}
      <path d="M-80 -18 L40 -16 C46 -16 50 -12 50 -6 L50 6 C50 12 46 16 40 16 L-80 18 Z" fill={tone(I, -0.62)} />
      <path d="M-80 -18 L40 -16 C46 -16 50 -12 50 -6 L50 6 C50 12 46 16 40 16 L-80 18" fill="none" stroke="#000" strokeOpacity="0.4" />
      {[-74, -66, -58].map((x) => (
        <rect key={x} x={x} y="-10" width="5" height="20" rx="1.5" fill={s("alu")} />
      ))}
      <rect x="-40" y="-11" width="30" height="22" rx="4" fill={s("chrome")} />
      <rect x="-37" y="-8" width="24" height="16" rx="3" fill="#1b1c1d" />
      <path d="M-33 -4 L-17 -4 M-25 -4 L-25 4 M-33 4 L-17 4" stroke="#555" strokeWidth="1.2" />
      <circle cx="-25" cy="0" r="6.5" fill={s("alu")} />
      <circle cx="-26.5" cy="-1.5" r="2.4" fill="#fff" fillOpacity="0.8" />
      <rect x="0" y="-5" width="36" height="10" rx="5" fill="#1d1e1f" />
      <rect x="28" y="-3.5" width="6" height="7" rx="2" fill={s("alu")} />
      {/* steering wheel: driver sits on the car's left (+y) */}
      <SteeringWheel c={c} cx={-48} cy={58} rx={17} ry={35} rim="#1b1c17" accent={c.p.body2} />
      {/* seats */}
      <Seat c={c} cx={0} cy={58} />
      <Seat c={c} cx={0} cy={-58} />
      {/* inner shadow under the cockpit rim */}
      <path d={TUB} fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="10" filter={s("blur5")} />
    </g>
  );
}
