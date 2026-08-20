"use client";

/**
 * Transformer test-circuit schematics for TP2 "Circuitos Acoplados", in
 * SVG (uses currentColor so it adapts to light/dark mode). Six variants,
 * one per test described in the assignment sheet:
 *  - "parteA-I" / "parteA-II": determinación de parámetros (5.1.2).
 *  - "dc": bornes homólogos con corriente continua (5.2.1.2).
 *  - "ac-ammeter-I" / "ac-ammeter-II": bornes homólogos, método del
 *    amperímetro (5.2.2.1).
 *  - "ac-voltmeter-I" / "ac-voltmeter-II": bornes homólogos, método de la
 *    tensión aplicada (5.2.2.2).
 */

type Variant =
  | "parteA-I"
  | "parteA-II"
  | "dc"
  | "ac-ammeter-I"
  | "ac-ammeter-II"
  | "ac-voltmeter-I"
  | "ac-voltmeter-II";

const METER_R = 14;

function Meter({
  cx,
  cy,
  label,
  color,
}: {
  cx: number;
  cy: number;
  label: string;
  color?: string;
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={METER_R}
        fill="none"
        stroke={color ?? "currentColor"}
        strokeWidth={1.6}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill={color ?? "currentColor"}
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Vertical coil column of `n` half-loops, from (x, yTop) to (x, yBot).
 * Loops bulge to the right by default; `mirror` flips them to the left so a
 * secondary coil drawn to the right of the core faces it, mirroring the
 * primary instead of bulging outward the same way.
 */
function verticalCoilPath(
  x: number,
  yTop: number,
  yBot: number,
  mirror = false,
): string {
  const n = 5;
  const h = yBot - yTop;
  const r = h / (2 * n);
  const sweep = mirror ? 0 : 1;
  let p = `M ${x} ${yTop}`;
  for (let i = 0; i < n; i++) {
    const cy = yTop + r + i * 2 * r;
    p += ` A ${r} ${r} 0 0 ${sweep} ${x} ${cy + r}`;
  }
  return p;
}

/** Two vertical coils (primary/secondary) sharing a core, with terminal dots. */
function Transformer({
  x,
  yTop,
  yBot,
  primaryLabels,
  secondaryLabels,
  gap = 22,
}: {
  x: number;
  yTop: number;
  yBot: number;
  primaryLabels: [string, string];
  secondaryLabels: [string, string];
  gap?: number;
}) {
  const priX = x;
  const coreX1 = x + gap;
  const coreX2 = coreX1 + 6;
  const secX = coreX2 + gap;

  return (
    <g>
      <path
        d={verticalCoilPath(priX, yTop, yBot)}
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
      <path
        d={verticalCoilPath(secX, yTop, yBot, true)}
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
      />
      <line
        x1={coreX1}
        y1={yTop - 6}
        x2={coreX1}
        y2={yBot + 6}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <line
        x1={coreX2}
        y1={yTop - 6}
        x2={coreX2}
        y2={yBot + 6}
        stroke="currentColor"
        strokeWidth={1.6}
      />
      <text
        x={priX - 10}
        y={yTop - 4}
        textAnchor="end"
        fontSize={12}
        fontWeight={600}
        fill="currentColor"
      >
        {primaryLabels[0]}
      </text>
      <text
        x={priX - 10}
        y={yBot + 4}
        textAnchor="end"
        fontSize={12}
        fontWeight={600}
        fill="currentColor"
      >
        {primaryLabels[1]}
      </text>
      <text
        x={secX + 10}
        y={yTop - 4}
        textAnchor="start"
        fontSize={12}
        fontWeight={600}
        fill="currentColor"
      >
        {secondaryLabels[0]}
      </text>
      <text
        x={secX + 10}
        y={yBot + 4}
        textAnchor="start"
        fontSize={12}
        fontWeight={600}
        fill="currentColor"
      >
        {secondaryLabels[1]}
      </text>
      <text
        x={priX - 4}
        y={(yTop + yBot) / 2 - 30}
        textAnchor="middle"
        fontSize={10}
        fill="currentColor"
        opacity={0.7}
      >
        Primario
      </text>
      <text
        x={secX + 4}
        y={(yTop + yBot) / 2 - 30}
        textAnchor="middle"
        fontSize={10}
        fill="currentColor"
        opacity={0.7}
      >
        Secundario
      </text>
    </g>
  );
}

const TOP = 60;
const BOT = 170;
const TX = 260; // transformer primary coil x

function ariaFor(variant: Variant): string {
  switch (variant) {
    case "parteA-I":
      return "Circuito de determinación de parámetros, Conexión I: primario excitado";
    case "parteA-II":
      return "Circuito de determinación de parámetros, Conexión II: secundario excitado";
    case "dc":
      return "Circuito de determinación de bornes homólogos con corriente continua";
    case "ac-ammeter-I":
      return "Circuito con amperímetro, Conexión I";
    case "ac-ammeter-II":
      return "Circuito con amperímetro, Conexión II";
    case "ac-voltmeter-I":
      return "Circuito con voltímetros, Conexión I";
    case "ac-voltmeter-II":
      return "Circuito con voltímetros, Conexión II";
  }
}

export function TransformerSchematic({ variant }: { variant: Variant }) {
  return (
    <svg
      viewBox="0 0 525 230"
      className="h-auto w-full text-neutral-700 dark:text-neutral-200"
      role="img"
      aria-label={ariaFor(variant)}
    >
      {variant === "parteA-I" && <PartASchematic excite="primary" />}
      {variant === "parteA-II" && <PartASchematic excite="secondary" />}
      {variant === "dc" && <DCSchematic />}
      {variant === "ac-ammeter-I" && <ACAmmeterSchematic bridge="I" />}
      {variant === "ac-ammeter-II" && <ACAmmeterSchematic bridge="II" />}
      {variant === "ac-voltmeter-I" && <ACVoltmeterSchematic bridge="I" />}
      {variant === "ac-voltmeter-II" && <ACVoltmeterSchematic bridge="II" />}
    </svg>
  );
}

// ---------------------------------------------------------------------------
//  5.1.2 — Parte A: determinación de parámetros
// ---------------------------------------------------------------------------

function PartASchematic({ excite }: { excite: "primary" | "secondary" }) {
  const A_X = 165;
  const V1_X = 205;
  return (
    <g>
      {/* Source: 220V/50Hz vertical coil */}
      <path
        d={verticalCoilPath(60, TOP, BOT)}
        stroke="currentColor"
        strokeWidth={1.6}
        fill="none"
      />
      <text x={60} y={TOP - 24} textAnchor="middle" fontSize={11}>
        220 V
      </text>
      <text x={60} y={TOP - 10} textAnchor="middle" fontSize={11}>
        50 Hz
      </text>
      <text x={44} y={TOP + 4} fontSize={11}>
        +
      </text>
      <text x={44} y={BOT} fontSize={11}>
        −
      </text>

      {/* top wire, broken around A meter */}
      <path
        d={`M 60 ${TOP} H ${A_X - METER_R} M ${A_X + METER_R} ${TOP} H ${TX}`}
        stroke="currentColor"
        strokeWidth={1.6}
        fill="none"
      />
      <path d={`M 60 ${BOT} H ${TX}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <Meter cx={A_X} cy={TOP} label="A" />
      <text x={A_X} y={TOP - 20} textAnchor="middle" fontSize={11} fontWeight={600}>
        {excite === "primary" ? "I₁₀" : "I₂₀"}
      </text>

      {/* V1 across the source/excited winding */}
      <path d={`M ${V1_X} ${TOP} V ${TOP + 40}`} stroke="currentColor" strokeWidth={1.2} fill="none" />
      <path d={`M ${V1_X} ${BOT - 40} V ${BOT}`} stroke="currentColor" strokeWidth={1.2} fill="none" />
      <Meter cx={V1_X} cy={(TOP + BOT) / 2} label="V" />
      <text x={V1_X} y={(TOP + BOT) / 2 + 30} textAnchor="middle" fontSize={11} fontWeight={600}>
        {excite === "primary" ? "U₁" : "U₂"}
      </text>

      <Transformer
        x={TX}
        yTop={TOP}
        yBot={BOT}
        primaryLabels={excite === "primary" ? ["u", "v"] : ["u", "v"]}
        secondaryLabels={excite === "primary" ? ["U", "V"] : ["U", "V"]}
      />

      {/* Voltmeter on the open (unexcited) winding */}
      <Meter cx={TX + 118} cy={(TOP + BOT) / 2} label="V" />
      <path
        d={`M ${TX + 118 - METER_R} ${(TOP + BOT) / 2} H ${TX + 62}`}
        stroke="currentColor"
        strokeWidth={1.2}
        fill="none"
      />
      <text x={TX + 118} y={(TOP + BOT) / 2 + 30} textAnchor="middle" fontSize={11} fontWeight={600}>
        {excite === "primary" ? "U₂₀" : "U₁₀"}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
//  5.2.1.2 — bornes homólogos, corriente continua
// ---------------------------------------------------------------------------

function DCSchematic() {
  return (
    <g>
      {/* Battery */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={40}
          x2={80}
          y1={TOP + 40 + i * 8}
          y2={TOP + 40 + i * 8}
          stroke="currentColor"
          strokeWidth={i % 2 === 0 ? 2.4 : 1.2}
        />
      ))}
      <text x={20} y={TOP + 52} fontSize={13} fontWeight={600}>
        E
      </text>
      <text x={86} y={TOP + 40} fontSize={11}>
        +
      </text>
      <text x={86} y={TOP + 64} fontSize={11}>
        −
      </text>
      <path d={`M 60 ${TOP + 32} V ${TOP}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M 60 ${TOP + 64} V ${BOT}`} stroke="currentColor" strokeWidth={1.6} fill="none" />

      {/* Switch L on the top wire */}
      <path
        d={`M 60 ${TOP} H 120 M 140 ${TOP} H ${TX}`}
        stroke="currentColor"
        strokeWidth={1.6}
        fill="none"
      />
      <circle cx={120} cy={TOP} r={2.5} fill="currentColor" />
      <circle cx={140} cy={TOP} r={2.5} fill="currentColor" />
      <line x1={120} y1={TOP} x2={137} y2={TOP - 14} stroke="currentColor" strokeWidth={1.6} />
      <text x={130} y={TOP - 20} textAnchor="middle" fontSize={11} fontWeight={600}>
        L
      </text>

      <path d={`M 60 ${BOT} H ${TX}`} stroke="currentColor" strokeWidth={1.6} fill="none" />

      <Transformer x={TX} yTop={TOP} yBot={BOT} primaryLabels={["u", "v"]} secondaryLabels={["U", "V"]} />

      {/* Ammeter on the secondary loop */}
      <path d={`M ${TX + 92} ${TOP} H ${TX + 150}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M ${TX + 92} ${BOT} H ${TX + 150}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M ${TX + 150} ${TOP} V ${TOP + (BOT - TOP) / 2 - METER_R}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M ${TX + 150} ${BOT} V ${TOP + (BOT - TOP) / 2 + METER_R}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <Meter cx={TX + 150} cy={(TOP + BOT) / 2} label="A" />
    </g>
  );
}

// ---------------------------------------------------------------------------
//  5.2.2.1 — bornes homólogos, método del amperímetro
// ---------------------------------------------------------------------------

function ACAmmeterSchematic({ bridge }: { bridge: "I" | "II" }) {
  const A_X = 175;
  const V_X = 215;
  return (
    <g>
      <path d={verticalCoilPath(60, TOP, BOT)} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <text x={60} y={TOP - 24} textAnchor="middle" fontSize={11}>
        220 V
      </text>
      <text x={60} y={TOP - 10} textAnchor="middle" fontSize={11}>
        50 Hz
      </text>

      <path d={`M 60 ${TOP} H ${A_X - METER_R} M ${A_X + METER_R} ${TOP} H ${TX}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M 60 ${BOT} H ${TX}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <Meter cx={A_X} cy={TOP} label={`A${bridge}`} />

      <path d={`M ${V_X} ${TOP} V ${TOP + 40}`} stroke="currentColor" strokeWidth={1.2} fill="none" />
      <path d={`M ${V_X} ${BOT - 40} V ${BOT}`} stroke="currentColor" strokeWidth={1.2} fill="none" />
      <Meter cx={V_X} cy={(TOP + BOT) / 2} label="V" />

      <Transformer x={TX} yTop={TOP} yBot={BOT} primaryLabels={["u", "v"]} secondaryLabels={["U", "V"]} />

      {/* Series bridge: v↔U for Conexión I, v↔V for Conexión II, closing
          the loop back to the top rail so primary and secondary carry the
          same current (additive or subtractive depending on the bridge). */}
      {bridge === "I" ? (
        <path
          d={`M ${TX} ${BOT} H ${TX + 62} M ${TX + 62} ${BOT} V ${BOT + 30} H ${TX + 62 + 70} V ${TOP}`}
          stroke="#dc2626"
          strokeWidth={1.6}
          fill="none"
        />
      ) : (
        <path
          d={`M ${TX} ${BOT} H ${TX + 62} V ${TOP} H ${TX + 62 + 70} V ${BOT + 30} H ${TX}`}
          stroke="#dc2626"
          strokeWidth={1.6}
          fill="none"
        />
      )}
      <text x={TX + 96} y={BOT + 44} textAnchor="middle" fontSize={10} fill="#dc2626">
        {bridge === "I" ? "puente v–U" : "puente v–V"}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
//  5.2.2.2 — bornes homólogos, método de la tensión aplicada
// ---------------------------------------------------------------------------

function ACVoltmeterSchematic({ bridge }: { bridge: "I" | "II" }) {
  const V1_X = 150;
  const V2_X = 430;
  return (
    <g>
      <path d={verticalCoilPath(60, TOP, BOT)} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <text x={60} y={TOP - 24} textAnchor="middle" fontSize={11}>
        220 V
      </text>
      <text x={60} y={TOP - 10} textAnchor="middle" fontSize={11}>
        50 Hz
      </text>

      <path d={`M 60 ${TOP} H ${V1_X - METER_R}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M ${V1_X + METER_R} ${TOP} H ${TX}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M 60 ${BOT} H ${TX}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <Meter cx={V1_X} cy={TOP} label="V₁" />

      <Transformer x={TX} yTop={TOP} yBot={BOT} primaryLabels={["u", "v"]} secondaryLabels={["U", "V"]} />

      <path d={`M ${TX + 118} ${TOP} H ${V2_X - METER_R}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M ${V2_X + METER_R} ${TOP} H ${V2_X + 40} V ${BOT} H ${TX + 118}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <Meter cx={V2_X} cy={TOP} label="V₂" />

      {/* Bridge from primary "v" to secondary "V" (I) or "U" (II), and V3
          reads the resulting potential difference at the bridge point. */}
      <path
        d={`M ${TX} ${BOT} H ${TX + (bridge === "I" ? 118 : 0)} `}
        stroke="#dc2626"
        strokeWidth={1.6}
        fill="none"
      />
      <path
        d={`M ${TX} ${BOT} V ${BOT + 34} H ${TX + 118} V ${BOT}`}
        stroke="#dc2626"
        strokeWidth={1.6}
        fill="none"
        opacity={0}
      />
      <Meter cx={TX + 59} cy={BOT + 34} label="V₃" color="#dc2626" />
      <path d={`M ${TX} ${BOT} V ${BOT + 34} H ${TX + 59 - METER_R}`} stroke="#dc2626" strokeWidth={1.6} fill="none" />
      <path d={`M ${TX + 118} ${BOT} V ${BOT + 34} H ${TX + 59 + METER_R}`} stroke="#dc2626" strokeWidth={1.6} fill="none" />
      <text x={TX + 59} y={BOT + 54} textAnchor="middle" fontSize={10} fill="#dc2626">
        {bridge === "I" ? "puente v–U" : "puente v–V"}
      </text>
    </g>
  );
}
