"use client";

import { useLanguage } from "@/i18n/LanguageContext";

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
  primaryCaption,
  secondaryCaption,
  gap = 22,
}: {
  x: number;
  yTop: number;
  yBot: number;
  primaryLabels: [string, string];
  secondaryLabels: [string, string];
  primaryCaption: string;
  secondaryCaption: string;
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
        x={priX - 28}
        y={yTop - 24}
        textAnchor="middle"
        fontSize={10}
        fill="currentColor"
        opacity={0.7}
      >
        {primaryCaption}
      </text>
      <text
        x={secX + 28}
        y={yTop - 24}
        textAnchor="middle"
        fontSize={10}
        fill="currentColor"
        opacity={0.7}
      >
        {secondaryCaption}
      </text>
    </g>
  );
}

const TOP = 60;
const BOT = 170;
const TX = 260; // transformer primary coil x (primary terminals)
const SEC_X = TX + 22 + 6 + 22; // secondary coil x (secondary terminals)
const MID = (TOP + BOT) / 2;

export function TransformerSchematic({ variant }: { variant: Variant }) {
  const { t } = useLanguage();
  const cap = {
    primary: t("acopl.schem.primary"),
    secondary: t("acopl.schem.secondary"),
    bridgeVU: t("acopl.schem.bridgeVU"),
    bridgeVV: t("acopl.schem.bridgeVV"),
  };
  return (
    <svg
      viewBox="0 0 525 240"
      fill="currentColor"
      className="h-auto w-full text-neutral-700 dark:text-neutral-200"
      role="img"
      aria-label={t(`acopl.schem.aria.${variant}`)}
    >
      {variant === "parteA-I" && <PartASchematic excite="primary" cap={cap} />}
      {variant === "parteA-II" && <PartASchematic excite="secondary" cap={cap} />}
      {variant === "dc" && <DCSchematic cap={cap} />}
      {variant === "ac-ammeter-I" && <ACAmmeterSchematic bridge="I" cap={cap} />}
      {variant === "ac-ammeter-II" && <ACAmmeterSchematic bridge="II" cap={cap} />}
      {variant === "ac-voltmeter-I" && <ACVoltmeterSchematic bridge="I" cap={cap} />}
      {variant === "ac-voltmeter-II" && <ACVoltmeterSchematic bridge="II" cap={cap} />}
    </svg>
  );
}

type Caps = { primary: string; secondary: string; bridgeVU: string; bridgeVV: string };

// ---------------------------------------------------------------------------
//  5.1.2 — Parte A: determinación de parámetros
// ---------------------------------------------------------------------------

function PartASchematic({
  excite,
  cap,
}: {
  excite: "primary" | "secondary";
  cap: Caps;
}) {
  // The source sits on the excited side. For the secondary the whole
  // external circuit is mirrored about the transformer's vertical axis, so
  // the source and A/V meters wire to the secondary terminals and the open
  // winding's voltmeter to the primary ones.
  const primary = excite === "primary";
  const CX = (TX + SEC_X) / 2;
  const mx = (x: number) => (primary ? x : 2 * CX - x);
  const exciteX = primary ? TX : SEC_X; // terminals the source feeds
  const openX = primary ? SEC_X : TX; // terminals of the open winding
  const A_X = 165;
  const V1_X = 205;
  const VO_X = TX + 118;
  const stroke = { stroke: "currentColor", fill: "none" } as const;
  return (
    <g>
      {/* Source: 220V/50Hz vertical coil */}
      <path d={verticalCoilPath(mx(60), TOP, BOT, !primary)} {...stroke} strokeWidth={1.6} />
      <text x={mx(60)} y={TOP - 24} textAnchor="middle" fontSize={11}>
        220 V
      </text>
      <text x={mx(60)} y={TOP - 10} textAnchor="middle" fontSize={11}>
        50 Hz
      </text>
      <text x={mx(44)} y={TOP + 4} fontSize={11} textAnchor="middle">
        +
      </text>
      <text x={mx(44)} y={BOT} fontSize={11} textAnchor="middle">
        −
      </text>

      {/* top wire, broken around A meter */}
      <path
        d={`M ${mx(60)} ${TOP} H ${mx(A_X - METER_R)} M ${mx(A_X + METER_R)} ${TOP} H ${exciteX}`}
        {...stroke}
        strokeWidth={1.6}
      />
      <path d={`M ${mx(60)} ${BOT} H ${exciteX}`} {...stroke} strokeWidth={1.6} />
      <Meter cx={mx(A_X)} cy={TOP} label="A" />
      <text x={mx(A_X)} y={TOP - 20} textAnchor="middle" fontSize={11} fontWeight={600}>
        {primary ? "I₁₀" : "I₂₀"}
      </text>

      {/* V across the source / excited winding */}
      <path d={`M ${mx(V1_X)} ${TOP} V ${MID - METER_R}`} {...stroke} strokeWidth={1.2} />
      <path d={`M ${mx(V1_X)} ${MID + METER_R} V ${BOT}`} {...stroke} strokeWidth={1.2} />
      <Meter cx={mx(V1_X)} cy={MID} label="V" />
      <text x={mx(V1_X)} y={MID + 30} textAnchor="middle" fontSize={11} fontWeight={600}>
        {primary ? "U₁" : "U₂"}
      </text>

      <Transformer
        x={TX}
        yTop={TOP}
        yBot={BOT}
        primaryLabels={["u", "v"]}
        secondaryLabels={["U", "V"]}
        primaryCaption={cap.primary}
        secondaryCaption={cap.secondary}
      />

      {/* Voltmeter across the open (unexcited) winding terminals */}
      <path d={`M ${openX} ${TOP} H ${mx(VO_X)} V ${MID - METER_R}`} {...stroke} strokeWidth={1.2} />
      <path d={`M ${openX} ${BOT} H ${mx(VO_X)} V ${MID + METER_R}`} {...stroke} strokeWidth={1.2} />
      <Meter cx={mx(VO_X)} cy={MID} label="V" />
      <text x={mx(VO_X)} y={MID + 30} textAnchor="middle" fontSize={11} fontWeight={600}>
        {primary ? "U₂₀" : "U₁₀"}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
//  5.2.1.2 — bornes homólogos, corriente continua
// ---------------------------------------------------------------------------

function DCSchematic({ cap }: { cap: Caps }) {
  const AM_X = SEC_X + 100;
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

      <Transformer
        x={TX}
        yTop={TOP}
        yBot={BOT}
        primaryLabels={["u", "v"]}
        secondaryLabels={["U", "V"]}
        primaryCaption={cap.primary}
        secondaryCaption={cap.secondary}
      />

      {/* Ammeter across the secondary terminals */}
      <path d={`M ${SEC_X} ${TOP} H ${AM_X} V ${MID - METER_R}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <path d={`M ${SEC_X} ${BOT} H ${AM_X} V ${MID + METER_R}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <Meter cx={AM_X} cy={MID} label="A" />
    </g>
  );
}

// ---------------------------------------------------------------------------
//  5.2.2.1 — bornes homólogos, método del amperímetro
//  Source → A → primary → bridge → secondary → back to the source, so both
//  windings carry the same current. Conexión I bridges primary v to
//  secondary U (return from V); Conexión II bridges v to V (return from U).
// ---------------------------------------------------------------------------

function ACAmmeterSchematic({ bridge, cap }: { bridge: "I" | "II"; cap: Caps }) {
  const A_X = 175;
  const V_X = 215;
  const RET = BOT + 30; // return rail below the transformer
  const RED = "#dc2626";
  return (
    <g>
      <path d={verticalCoilPath(60, TOP, BOT)} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <text x={60} y={TOP - 24} textAnchor="middle" fontSize={11}>
        220 V
      </text>
      <text x={60} y={TOP - 10} textAnchor="middle" fontSize={11}>
        50 Hz
      </text>

      {/* source+ → A → primary u */}
      <path d={`M 60 ${TOP} H ${A_X - METER_R} M ${A_X + METER_R} ${TOP} H ${TX}`} stroke="currentColor" strokeWidth={1.6} fill="none" />
      <Meter cx={A_X} cy={TOP} label={`A${bridge}`} />

      {/* V across the source */}
      <path d={`M ${V_X} ${TOP} V ${MID - METER_R}`} stroke="currentColor" strokeWidth={1.2} fill="none" />
      <path d={`M ${V_X} ${MID + METER_R} V ${RET}`} stroke="currentColor" strokeWidth={1.2} fill="none" />
      <Meter cx={V_X} cy={MID} label="V" />

      <Transformer
        x={TX}
        yTop={TOP}
        yBot={BOT}
        primaryLabels={["u", "v"]}
        secondaryLabels={["U", "V"]}
        primaryCaption={cap.primary}
        secondaryCaption={cap.secondary}
      />

      {bridge === "I" ? (
        <>
          {/* bridge: primary v → secondary U */}
          <path
            d={`M ${TX} ${BOT} V ${BOT + 14} H ${SEC_X + 26} V ${TOP} H ${SEC_X}`}
            stroke={RED}
            strokeWidth={1.6}
            fill="none"
          />
          {/* return: source− → secondary V */}
          <path
            d={`M 60 ${BOT} V ${RET} H ${SEC_X} V ${BOT}`}
            stroke="currentColor"
            strokeWidth={1.6}
            fill="none"
          />
        </>
      ) : (
        <>
          {/* bridge: primary v → secondary V */}
          <path d={`M ${TX} ${BOT} H ${SEC_X}`} stroke={RED} strokeWidth={1.6} fill="none" />
          {/* return: source− → secondary U */}
          <path
            d={`M 60 ${BOT} V ${RET} H ${SEC_X + 26} V ${TOP} H ${SEC_X}`}
            stroke="currentColor"
            strokeWidth={1.6}
            fill="none"
          />
        </>
      )}
      <text x={TX + 100} y={RET + 14} textAnchor="middle" fontSize={10} fill={RED}>
        {bridge === "I" ? cap.bridgeVU : cap.bridgeVV}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
//  5.2.2.2 — bornes homólogos, método de la tensión aplicada
//  V₁ across the primary, V₂ across the secondary, a bridge joins one
//  terminal of each winding and V₃ reads across the other two terminals.
// ---------------------------------------------------------------------------

function ACVoltmeterSchematic({ bridge, cap }: { bridge: "I" | "II"; cap: Caps }) {
  const V1_X = 150;
  const V2_X = 430;
  const V3_X = (TX + SEC_X) / 2;
  const RED = "#dc2626";
  const stroke = { stroke: "currentColor", fill: "none" } as const;
  const v3y = bridge === "I" ? BOT + 40 : TOP - 34;
  return (
    <g>
      <path d={verticalCoilPath(60, TOP, BOT)} {...stroke} strokeWidth={1.6} />
      <text x={60} y={TOP - 24} textAnchor="middle" fontSize={11}>
        220 V
      </text>
      <text x={60} y={TOP - 10} textAnchor="middle" fontSize={11}>
        50 Hz
      </text>

      {/* source feeds the primary; V₁ in parallel with it */}
      <path d={`M 60 ${TOP} H ${TX}`} {...stroke} strokeWidth={1.6} />
      <path d={`M 60 ${BOT} H ${TX}`} {...stroke} strokeWidth={1.6} />
      <path d={`M ${V1_X} ${TOP} V ${MID - METER_R}`} {...stroke} strokeWidth={1.2} />
      <path d={`M ${V1_X} ${MID + METER_R} V ${BOT}`} {...stroke} strokeWidth={1.2} />
      <Meter cx={V1_X} cy={MID} label="V₁" />

      <Transformer
        x={TX}
        yTop={TOP}
        yBot={BOT}
        primaryLabels={["u", "v"]}
        secondaryLabels={["U", "V"]}
        primaryCaption={cap.primary}
        secondaryCaption={cap.secondary}
      />

      {/* V₂ across the secondary terminals */}
      <path d={`M ${SEC_X} ${TOP} H ${V2_X} V ${MID - METER_R}`} {...stroke} strokeWidth={1.6} />
      <path d={`M ${SEC_X} ${BOT} H ${V2_X} V ${MID + METER_R}`} {...stroke} strokeWidth={1.6} />
      <Meter cx={V2_X} cy={MID} label="V₂" />

      {bridge === "I" ? (
        <>
          {/* bridge: primary v → secondary U; V₃ across u and V */}
          <path
            d={`M ${TX} ${BOT} V ${BOT + 14} H ${SEC_X + 14} V ${TOP} H ${SEC_X}`}
            stroke={RED}
            strokeWidth={1.6}
            fill="none"
          />
          <path
            d={`M ${TX} ${TOP} H ${TX - 24} V ${v3y} H ${V3_X - METER_R} M ${SEC_X} ${BOT} V ${v3y} H ${V3_X + METER_R}`}
            stroke={RED}
            strokeWidth={1.6}
            fill="none"
          />
        </>
      ) : (
        <>
          {/* bridge: primary v → secondary V; V₃ across u and U */}
          <path d={`M ${TX} ${BOT} H ${SEC_X}`} stroke={RED} strokeWidth={1.6} fill="none" />
          <path
            d={`M ${TX} ${TOP} V ${v3y} H ${V3_X - METER_R} M ${SEC_X} ${TOP} V ${v3y} H ${V3_X + METER_R}`}
            stroke={RED}
            strokeWidth={1.6}
            fill="none"
          />
        </>
      )}
      <Meter cx={V3_X} cy={v3y} label="V₃" color={RED} />
      <text
        x={V3_X}
        y={bridge === "I" ? v3y + 22 : v3y - 20}
        textAnchor="middle"
        fontSize={10}
        fill={RED}
      >
        {bridge === "I" ? cap.bridgeVU : cap.bridgeVV}
      </text>
    </g>
  );
}
