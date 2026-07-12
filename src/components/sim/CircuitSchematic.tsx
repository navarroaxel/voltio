"use client";

/**
 * Series RLC circuit schematic in SVG. Two variants:
 *  - "parteA": Variac (50 V/50 Hz) + wattmeter (W) + ammeter (A) + V1 + V2.
 *  - "parteB": GAF + voltmeters V, VR, VL, VC across each element.
 * Uses currentColor to adapt to light/dark mode.
 */

import { useLanguage } from "@/i18n/LanguageContext";

type Variant = "parteA" | "parteB";

const TOP = 70;
const BOT = 180;
const METER_R = 14;

// Series meters on the top wire (Part A): wattmeter W and ammeter A.
const W_X = 165;
const A_X = 205;

function resistorPath(x: number, w: number, y: number): string {
  const seg = w / 6;
  const a = 8;
  return (
    `M ${x} ${y} ` +
    `l ${seg / 2} ${-a} l ${seg} ${2 * a} l ${seg} ${-2 * a} ` +
    `l ${seg} ${2 * a} l ${seg} ${-2 * a} l ${seg} ${2 * a} l ${seg / 2} ${-a}`
  );
}

function inductorPath(x: number, w: number, y: number): string {
  const n = 4;
  const r = w / (2 * n);
  let p = `M ${x} ${y}`;
  for (let i = 0; i < n; i++) {
    const cx = x + r + i * 2 * r;
    p += ` A ${r} ${r} 0 0 1 ${cx + r} ${y}`;
  }
  return p;
}

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

export function CircuitSchematic({ variant }: { variant: Variant }) {
  const { t } = useLanguage();
  const wire = "currentColor";
  const blue = "#2563eb";
  const red = "#dc2626";
  const green = "#16a34a";

  // Positions of the series elements (top wire).
  const rX = 250;
  const rW = 70;
  const lX = 360;
  const lW = 70;
  const cX = 470;

  return (
    <svg
      viewBox="0 0 525 230"
      className="h-auto w-full text-neutral-700 dark:text-neutral-200"
      role="img"
      aria-label={
        variant === "parteA"
          ? t("sim.schematic.ariaPartA")
          : t("sim.schematic.ariaPartB")
      }
    >
      {/* Loop wires. In Part A the top-left segment breaks around the
          series W and A meters so the wire never crosses their circles. */}
      <path
        d={
          variant === "parteA"
            ? `M 70 ${TOP} H ${W_X - METER_R} ` +
              `M ${W_X + METER_R} ${TOP} H ${A_X - METER_R} ` +
              `M ${A_X + METER_R} ${TOP} H ${rX}`
            : `M 70 ${TOP} H ${rX}`
        }
        stroke={wire}
        strokeWidth={1.6}
        fill="none"
      />
      <path
        d={`M ${rX + rW} ${TOP} H ${lX}`}
        stroke={wire}
        strokeWidth={1.6}
        fill="none"
      />
      <path
        d={`M ${lX + lW} ${TOP} H ${cX}`}
        stroke={wire}
        strokeWidth={1.6}
        fill="none"
      />
      <path
        d={`M ${cX + 30} ${TOP} H ${cX + 38} V ${BOT} H 70`}
        stroke={wire}
        strokeWidth={1.6}
        fill="none"
      />

      {/* Source on the left */}
      {variant === "parteA" ? (
        <>
          {/* Variac: vertical coil */}
          <path
            d={`M 70 ${TOP} V 95`}
            stroke={wire}
            strokeWidth={1.6}
            fill="none"
          />
          <path
            d="M 70 95 q -12 8 0 16 q -12 8 0 16 q -12 8 0 16 q -12 8 0 16"
            stroke={wire}
            strokeWidth={1.6}
            fill="none"
          />
          <path
            d={`M 70 159 V ${BOT}`}
            stroke={wire}
            strokeWidth={1.6}
            fill="none"
          />
          <text
            x={70}
            y={32}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
          >
            Variac
          </text>
          <text
            x={70}
            y={46}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
          >
            50 V · 50 Hz
          </text>
        </>
      ) : (
        <>
          {/* GAF: box */}
          <rect
            x={20}
            y={95}
            width={56}
            height={60}
            rx={4}
            fill="none"
            stroke={wire}
            strokeWidth={1.6}
          />
          <text
            x={48}
            y={120}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill="currentColor"
          >
            GAF
          </text>
          <text
            x={48}
            y={135}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
          >
            ~4 V
          </text>
          <path
            d={`M 76 105 H 70 V ${TOP}`}
            stroke={wire}
            strokeWidth={1.6}
            fill="none"
          />
          <path
            d={`M 76 145 H 70 V ${BOT}`}
            stroke={wire}
            strokeWidth={1.6}
            fill="none"
          />
        </>
      )}

      {/* Source voltmeter */}
      <path
        d={`M 120 ${TOP} V 120`}
        stroke={wire}
        strokeWidth={1.2}
        fill="none"
      />
      <path
        d={`M 120 148 V ${BOT}`}
        stroke={wire}
        strokeWidth={1.2}
        fill="none"
      />
      <Meter cx={120} cy={134} label={variant === "parteA" ? "V1" : "V"} />

      {/* Series meters (Part A only). The top wire already breaks around
          them, so the circles sit in the gaps without a line through them. */}
      {variant === "parteA" && (
        <>
          <Meter cx={W_X} cy={TOP} label="W" />
          <Meter cx={A_X} cy={TOP} label="A" />
        </>
      )}

      {/* R */}
      <path
        d={resistorPath(rX, rW, TOP)}
        stroke={blue}
        strokeWidth={2}
        fill="none"
      />
      <text
        x={rX + rW / 2}
        y={TOP - 14}
        textAnchor="middle"
        fontSize={12}
        fill={blue}
      >
        R
      </text>

      {/* L */}
      <path
        d={inductorPath(lX, lW, TOP)}
        stroke={red}
        strokeWidth={2}
        fill="none"
      />
      <text
        x={lX + lW / 2}
        y={TOP - 16}
        textAnchor="middle"
        fontSize={12}
        fill={red}
      >
        L
      </text>

      {/* C */}
      <path
        d={`M ${cX} ${TOP} h 10 M ${cX + 10} ${TOP - 12} v 24 M ${cX + 18} ${TOP - 12} v 24 M ${cX + 18} ${TOP} h 12`}
        stroke={green}
        strokeWidth={2}
        fill="none"
      />
      <text
        x={cX + 14}
        y={TOP - 16}
        textAnchor="middle"
        fontSize={12}
        fill={green}
      >
        C
      </text>

      {/* Voltmeters across the elements */}
      {variant === "parteB" ? (
        <>
          <ElementVoltmeter
            x={rX + rW / 2}
            half={rW / 2}
            label="U"
            sub="R"
            color={wire}
          />
          <ElementVoltmeter
            x={lX + lW / 2}
            half={lW / 2}
            label="U"
            sub="L"
            color={wire}
          />
          <ElementVoltmeter x={cX + 15} half={15} label="U" sub="C" color={wire} />
        </>
      ) : (
        <>
          {/* One voltmeter per element (U_R, U_L, U_C). The lab used a
              single tester V2 moved from element to element, but showing
              one per element matches the measured columns and is clearer. */}
          <ElementVoltmeter
            x={rX + rW / 2}
            half={rW / 2}
            label="U"
            sub="R"
            color={wire}
          />
          <ElementVoltmeter
            x={lX + lW / 2}
            half={lW / 2}
            label="U"
            sub="L"
            color={wire}
          />
          <ElementVoltmeter x={cX + 15} half={15} label="U" sub="C" color={wire} />
        </>
      )}
    </svg>
  );
}

function ElementVoltmeter({
  x,
  half,
  label,
  sub,
  color,
}: {
  x: number;
  half: number; // distance from center to each element terminal
  label: string;
  sub?: string;
  color: string;
}) {
  const top = 22;
  const r = 13;
  const lead = half + 5; // slightly wider than the element for breathing room
  return (
    <g>
      {/* Leads tap the element's two terminals and bracket up to the meter. */}
      <path
        d={`M ${x - lead} ${TOP} V ${top} H ${x - r}`}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
      <path
        d={`M ${x + lead} ${TOP} V ${top} H ${x + r}`}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
      <circle
        cx={x}
        cy={top}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
      />
      <text
        x={x}
        y={top + 4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={color}
      >
        {label}
        {sub ? (
          <tspan fontSize={8} dy={2}>
            {sub}
          </tspan>
        ) : null}
      </text>
    </g>
  );
}
