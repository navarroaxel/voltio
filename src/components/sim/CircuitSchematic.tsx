"use client";

/**
 * Esquema del circuito RLC serie en SVG. Dos variantes:
 *  - "parteA": Variac (50 V/50 Hz) + watímetro (W) + amperímetro (A) + V1 + V2.
 *  - "parteB": GAF + voltímetros V, VR, VL, VC sobre cada elemento.
 * Usa currentColor para adaptarse a modo claro/oscuro.
 */

type Variant = "parteA" | "parteB";

const TOP = 70;
const BOT = 180;

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
        r={14}
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
  const wire = "currentColor";
  const blue = "#2563eb";
  const red = "#dc2626";
  const green = "#16a34a";

  // Posiciones de los elementos en serie (top wire).
  const rX = 250;
  const rW = 70;
  const lX = 360;
  const lW = 70;
  const cX = 470;

  return (
    <svg
      viewBox="0 0 620 230"
      className="h-auto w-full text-neutral-700 dark:text-neutral-200"
      role="img"
      aria-label={
        variant === "parteA"
          ? "Circuito RLC serie de la Parte A con Variac, watímetro y amperímetro"
          : "Circuito RLC serie de la Parte B alimentado por generador de funciones"
      }
    >
      {/* Wires del lazo */}
      <path
        d={`M 70 ${TOP} H ${rX}`}
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
        d={`M ${cX + 30} ${TOP} H 560 V ${BOT} H 70`}
        stroke={wire}
        strokeWidth={1.6}
        fill="none"
      />

      {/* Fuente a la izquierda */}
      {variant === "parteA" ? (
        <>
          {/* Variac: bobina vertical */}
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
          <text x={20} y={120} fontSize={11} fill="currentColor">
            Variac
          </text>
          <text x={14} y={135} fontSize={10} fill="currentColor">
            50 V · 50 Hz
          </text>
        </>
      ) : (
        <>
          {/* GAF: caja */}
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

      {/* Voltímetro de fuente */}
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

      {/* Medidores en serie (solo Parte A) */}
      {variant === "parteA" && (
        <>
          <Meter cx={165} cy={TOP} label="W" />
          <Meter cx={205} cy={TOP} label="A" />
          <path
            d={`M 179 ${TOP} H 191`}
            stroke={wire}
            strokeWidth={1.6}
            fill="none"
          />
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

      {/* Voltímetros sobre los elementos */}
      {variant === "parteB" ? (
        <>
          <ElementVoltmeter x={rX + rW / 2} label="VR" color={blue} />
          <ElementVoltmeter x={lX + lW / 2} label="VL" color={red} />
          <ElementVoltmeter x={cX + 14} label="VC" color={green} />
        </>
      ) : (
        <>
          {/* V2: téster sobre el tramo L–C */}
          <path
            d={`M ${lX} ${TOP} V 34`}
            stroke={wire}
            strokeWidth={1}
            fill="none"
          />
          <path
            d={`M ${cX + 30} ${TOP} V 34`}
            stroke={wire}
            strokeWidth={1}
            fill="none"
          />
          <path
            d={`M ${lX} 34 H ${cX + 30}`}
            stroke={wire}
            strokeWidth={1}
            fill="none"
          />
          <Meter cx={(lX + cX + 30) / 2} cy={34} label="V2" />
        </>
      )}
    </svg>
  );
}

function ElementVoltmeter({
  x,
  label,
  color,
}: {
  x: number;
  label: string;
  color: string;
}) {
  const top = 30;
  return (
    <g>
      <path
        d={`M ${x - 18} ${TOP} V ${top + 14}`}
        stroke={color}
        strokeWidth={1}
        fill="none"
        opacity={0.6}
      />
      <path
        d={`M ${x + 18} ${TOP} V ${top + 14}`}
        stroke={color}
        strokeWidth={1}
        fill="none"
        opacity={0.6}
      />
      <circle
        cx={x}
        cy={top}
        r={13}
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
      </text>
    </g>
  );
}
