"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { fmt } from "@/lib/format";
import { abs, add, c, type Complex, type Phase } from "@/lib/three-phase-engine";

/**
 * Phasor diagram of a star load (TP3). Origin = source neutral n; the triangle
 * is the source (vertices R, S, T); N' is the load star point, displaced by U_N.
 * Blue arrows go from N' to each vertex (load phase voltages), red arrows are
 * the line currents drawn from N', violet is the displacement n→N' and amber
 * the neutral current (drawn from n). Real axis to the right, imaginary up.
 */
export interface PhasorData {
  /** Source phase voltages (n → vertex). */
  vertices: Record<Phase, Complex>;
  /** N' relative to n. */
  UN: Complex;
  I: Record<Phase, Complex>;
  IN?: Complex | null;
  /** Line voltage magnitudes for the triangle sides (RS, ST, TR). */
  Uline?: [number, number, number];
}

const W = 520;
const H = 450;
const CX = W / 2;
const CY = 238;
const KU = 0.88; // px per volt
const KI = 44; // px per ampere

const COLORS = {
  U: "#2563eb",
  I: "#dc2626",
  UN: "#7c3aed",
  IN: "#d97706",
  line: "currentColor",
};

const px = (z: Complex) => ({ x: CX + z.re * KU, y: CY - z.im * KU });
const pxI = (origin: { x: number; y: number }, z: Complex) => ({
  x: origin.x + z.re * KI,
  y: origin.y - z.im * KI,
});

function Arrow({
  from,
  to,
  color,
  width = 2,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  width?: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 3) return null;
  const ux = dx / len;
  const uy = dy / len;
  const hs = 8;
  const a = { x: to.x - ux * hs + uy * hs * 0.45, y: to.y - uy * hs - ux * hs * 0.45 };
  const b = { x: to.x - ux * hs - uy * hs * 0.45, y: to.y - uy * hs + ux * hs * 0.45 };
  return (
    <g stroke={color} fill={color} strokeWidth={width} strokeLinejoin="round">
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} fill="none" />
      <polygon points={`${to.x},${to.y} ${a.x},${a.y} ${b.x},${b.y}`} stroke="none" />
    </g>
  );
}

function Sub({ base, sub, extra = "" }: { base: string; sub: string; extra?: string }) {
  return (
    <>
      {base}
      <tspan fontSize="75%" baselineShift="sub">
        {sub}
      </tspan>
      {extra}
    </>
  );
}

export function PhasorDiagram({ data }: { data: PhasorData }) {
  const { t } = useLanguage();
  const { vertices, UN, I, IN, Uline } = data;
  const O = px(c(0));
  const Np = px(UN);
  const V = {
    R: px(vertices.R),
    S: px(vertices.S),
    T: px(vertices.T),
  };
  const phases: Phase[] = ["R", "S", "T"];
  const Uload = (p: Phase) => abs(add(vertices[p], c(-UN.re, -UN.im)));
  const labelOffset: Record<Phase, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
    R: { dx: 8, dy: 14, anchor: "start" },
    S: { dx: -8, dy: 14, anchor: "end" },
    T: { dx: 0, dy: -10, anchor: "middle" },
  };
  const sideLabels: Array<{ a: Phase; b: Phase; key: string; text: string; dx: number; dy: number }> = [
    { a: "R", b: "S", key: "RS", text: "RS", dx: 0, dy: 54 },
    { a: "S", b: "T", key: "ST", text: "ST", dx: -34, dy: -6 },
    { a: "T", b: "R", key: "TR", text: "TR", dx: 34, dy: -6 },
  ];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full text-neutral-600 dark:text-neutral-300"
        role="img"
        aria-label={t("tri.phasor.aria")}
        fill="currentColor"
      >
        {/* source triangle */}
        <polygon
          points={`${V.R.x},${V.R.y} ${V.S.x},${V.S.y} ${V.T.x},${V.T.y}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={1.2}
        />
        {Uline
          ? sideLabels.map((s, i) => {
              const mx = (V[s.a].x + V[s.b].x) / 2 + s.dx;
              const my = (V[s.a].y + V[s.b].y) / 2 + s.dy;
              return (
                <text key={s.key} x={mx} y={my} textAnchor="middle" fontSize={11} fillOpacity={0.7}>
                  <Sub base="U" sub={s.text} /> {fmt(Uline[i], 0)} V
                </text>
              );
            })
          : null}

        {/* load phase voltages N' → vertices */}
        {phases.map((p) => (
          <Arrow key={`u${p}`} from={Np} to={V[p]} color={COLORS.U} width={2.2} />
        ))}
        {/* currents from N' */}
        {phases.map((p) => (
          <Arrow key={`i${p}`} from={Np} to={pxI(Np, I[p])} color={COLORS.I} width={2.2} />
        ))}
        {/* displacement n → N' */}
        <Arrow from={O} to={Np} color={COLORS.UN} width={2.2} />
        {IN ? <Arrow from={O} to={pxI(O, IN)} color={COLORS.IN} width={2.6} /> : null}

        {/* points */}
        <circle cx={O.x} cy={O.y} r={3.5} fill="currentColor" />
        <text x={O.x - 8} y={O.y - 6} textAnchor="end" fontSize={12} fontWeight={600}>
          n
        </text>
        <circle cx={Np.x} cy={Np.y} r={3.5} fill="currentColor" />
        <text x={Np.x + 8} y={Np.y + 14} fontSize={12} fontWeight={600}>
          N&apos;
        </text>

        {/* vertex + voltage labels */}
        {phases.map((p) => {
          const o = labelOffset[p];
          return (
            <text
              key={`l${p}`}
              x={V[p].x + o.dx}
              y={V[p].y + o.dy}
              textAnchor={o.anchor}
              fontSize={12}
              fontWeight={600}
              fill={COLORS.U}
            >
              <Sub base="U" sub={p} extra="'" /> {fmt(Uload(p), 0)} V
            </text>
          );
        })}
        {phases.map((p) => {
          const tip = pxI(Np, I[p]);
          const dx = tip.x - Np.x;
          const dy = tip.y - Np.y;
          const len = Math.hypot(dx, dy) || 1;
          // label beside the arrow tip (perpendicular side, away from the origin of the star)
          const nx = -dy / len;
          const ny = dx / len;
          const side = nx * (tip.x - CX) + ny * (tip.y - CY) >= 0 ? 1 : -1;
          return (
            <text
              key={`li${p}`}
              x={tip.x + (dx / len) * 6 + nx * side * 22}
              y={tip.y + (dy / len) * 6 + ny * side * 22 + 4}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={COLORS.I}
            >
              <Sub base="I" sub={p} /> {fmt(abs(I[p]), 2)} A
            </text>
          );
        })}
        {abs(UN) > 0.5 ? (
          <text x={(O.x + Np.x) / 2 + 12} y={(O.y + Np.y) / 2} fontSize={11} fontWeight={600} fill={COLORS.UN}>
            <Sub base="U" sub="N" /> {fmt(abs(UN), 0)} V
          </text>
        ) : null}
        {IN && abs(IN) > 0.02 ? (
          <text
            x={pxI(O, IN).x + 8}
            y={pxI(O, IN).y - 6}
            fontSize={11}
            fontWeight={600}
            fill={COLORS.IN}
          >
            <Sub base="I" sub="N" /> {fmt(abs(IN), 2)} A
          </text>
        ) : null}
        <text x={W - 8} y={H - 8} textAnchor="end" fontSize={10} fillOpacity={0.6}>
          {t("tri.phasor.axis")}
        </text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-300">
        {(
          [
            ["U", "tri.phasor.legend.U"],
            ["I", "tri.phasor.legend.I"],
            ["UN", "tri.phasor.legend.UN"],
            ["IN", "tri.phasor.legend.IN"],
          ] as const
        ).map(([k, key]) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-5" style={{ background: COLORS[k] }} />
            {t(key)}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
