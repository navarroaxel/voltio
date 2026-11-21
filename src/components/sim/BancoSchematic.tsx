"use client";

import { useId } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { fmt } from "@/lib/format";
import type { Connection } from "@/lib/harmonics-engine";
import type { LoadKey } from "@/lib/poliarmonicas-data";

/**
 * Esquema del banco de ensayo (guía, sección 3): fases R, S y T y neutro hacia
 * el Fluke 435 y el tablero de lámparas. Se redibuja según el estado del
 * simulador: qué carga está encendida y en qué fases, y las corrientes
 * SIMULADAS de fase y neutro.
 *
 * El orden de las tres lámparas de cada fase (bajo consumo, LED, halógena, de
 * arriba hacia abajo) se tomó de la foto del banco; la guía no lo indica.
 */

const COL = {
  R: { color: "#dc2626", lampX: 865, swX: 790, label: "AT", lineX: 862, nX: 892, y: 542 },
  S: { color: "#16a34a", lampX: 1060, swX: 985, label: "DC", lineX: 1024, nX: 1052, y: 610 },
  T: { color: "#2563eb", lampX: 1257, swX: 1185, label: "DE", lineX: 1213, nX: 1245, y: 675 },
} as const;
type Phase = keyof typeof COL;
const PHASES: Phase[] = ["R", "S", "T"];
const ROW_Y = [110, 205, 300, 395];
const N_COLOR = "#d97706";
const N_Y = 733;
/** Desplazamientos del circuito respecto del esquema original de la guía. */
const DY = 40; // todo el circuito más abajo: más aire bajo el tablero
const DX = 60;
/** Centro del hueco entre el puente del wattímetro (x≈360) y el Fluke. */
const LABEL_X = (360 + 495 + DX) / 2; // Fluke más a la derecha: lugar para las corrientes

/** Fila del tablero que se enciende para cada carga. */
const ROW_OF_LOAD: Record<LoadKey, number> = {
  bajoConsumo: 1,
  led: 2,
  halogena: 3,
  tubos: 0,
  trafoVacio: 0,
  bancoCapacitores: 0,
};
const IS_LAMP: Record<LoadKey, boolean> = {
  bajoConsumo: true,
  led: true,
  halogena: true,
  tubos: false,
  trafoVacio: false,
  bancoCapacitores: false,
};

function activePhases(c: Connection): Phase[] {
  return c === "mono" ? ["R"] : c === "bifasica" ? ["R", "S"] : ["R", "S", "T"];
}

function Sub({ base, sub }: { base: string; sub: string }) {
  return (
    <>
      <tspan>{base}</tspan>
      <tspan fontSize="0.7em" dy="5">
        {sub}
      </tspan>
      <tspan dy="-5"> </tspan>
    </>
  );
}

export function BancoSchematic({
  load,
  connection,
  tubosC,
  iPhase,
  iNeutral,
}: {
  load: LoadKey;
  connection: Connection;
  tubosC: number;
  iPhase: number;
  iNeutral: number;
}) {
  const { t } = useLanguage();
  const gid = useId().replace(/:/g, "");
  const active = activePhases(connection);
  const litRow = ROW_OF_LOAD[load];
  const lamp = IS_LAMP[load];
  const lampLabels = [
    t("poli.sim.lamp.bc"),
    t("poli.sim.lamp.led"),
    t("poli.sim.lamp.h"),
  ];

  const loadName =
    t(`poli.sim.load.${load}`) +
    (load === "tubos" && tubosC > 0 ? ` + C ${fmt(tubosC, 1)} µF` : "");
  const caption = `${t("poli.sim.circuit.on")}: ${loadName} (${active.join(", ")})`;

  return (
    <div>
      <svg
        viewBox={`0 0 1340 ${790 + DY}`}
        className="h-auto w-full text-neutral-700 dark:text-neutral-300"
        role="img"
        aria-label={`${t("poli.sim.circuit.ariaLabel")} ${caption}`}
      >
        <defs>
          <radialGradient id={`glow-${gid}`}>
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={`translate(0 ${DY})`}>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          {/* ── Terminales y conductores del lado fuente ── */}
          {/* R: terminal → nodo → A → W_R → Fluke */}
          <path
            d={`M93 542 H128 M128 542 H180 M244 542 H292 M358 542 H${495 + DX}`}
            stroke={active.includes("R") ? COL.R.color : "currentColor"}
            strokeWidth={active.includes("R") ? 3 : 2}
          />
          {/* S y T hasta el Fluke */}
          <path
            d={`M237 610 H${495 + DX}`}
            stroke={active.includes("S") ? COL.S.color : "currentColor"}
            strokeWidth={active.includes("S") ? 3 : 2}
          />
          <path
            d={`M237 675 H${495 + DX}`}
            stroke={active.includes("T") ? COL.T.color : "currentColor"}
            strokeWidth={active.includes("T") ? 3 : 2}
          />
          {/* N: terminal → nodos → Fluke */}
          <path d={`M93 733 H${495 + DX}`} stroke={N_COLOR} strokeWidth={3} />
          {/* Voltímetro entre R y N */}
          <path d="M128 542 V603 M128 668 V733" />
          {/* Bobina de tensión del wattímetro a N y puente de corriente */}
          <path d="M318 575 V733 M335 575 V592 H360 V542" />

          {/* Flechas de los instrumentos: van por detrás de los círculos */}
          <path d="M186 575 L246 499 M103 670 L157 597" />
        </g>
        {/* Círculos rellenos con el fondo de la tarjeta: tapan la flecha y
            la letra queda encima */}
        <g stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-neutral-900">
          <circle cx="212" cy="542" r="32" />
          <circle cx="325" cy="542" r="32" />
          <circle cx="128" cy="636" r="33" />
        </g>
        <g fill="currentColor">
          <polygon points="246,499 244,511 235,504" />
          <polygon points="157,597 155,609 146,602" />
          {[
            [93, 542],
            [237, 610],
            [237, 675],
            [93, 733],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="none" stroke="currentColor" strokeWidth="2" />
          ))}
          {[
            [128, 542],
            [128, 733],
            [318, 733],
          ].map(([x, y]) => (
            <circle key={`n${x}-${y}`} cx={x} cy={y} r="5" />
          ))}
          <text x="212" y="552" fontSize="28" textAnchor="middle">
            A
          </text>
          <text x="128" y="647" fontSize="28" textAnchor="middle">
            V
          </text>
          <text x="325" y="552" fontSize="26" textAnchor="middle">
            <Sub base="W" sub="R" />
          </text>
          {(["R", "S", "T", "N"] as const).map((l, i) => (
            <text
              key={l}
              x={[62, 208, 208, 62][i]}
              y={[550, 618, 683, 741][i]}
              fontSize="24"
              fontStyle="italic"
              fontWeight="bold"
              textAnchor="middle"
            >
              {l}
            </text>
          ))}
        </g>

        {/* ── Fluke 435 ── */}
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect x={495 + DX} y="470" width="223" height="300" />
          <rect x={530 + DX} y="497" width="150" height="65" />
        </g>
        <text x={605 + DX} y="537" fontSize="22" fontWeight="bold" textAnchor="middle" fill="currentColor">
          FLUKE 435
        </text>

        {/* ── Conductores del Fluke al tablero ── */}
        <g fill="none" strokeWidth="2">
          {PHASES.map((p) => (
            <path
              key={p}
              d={`M${718 + DX} ${COL[p].y} H${COL[p].lineX} V${468 - DY}`}
              stroke={active.includes(p) ? COL[p].color : "currentColor"}
              strokeWidth={active.includes(p) ? 3 : 2}
            />
          ))}
          <path d={`M${718 + DX} ${N_Y} H1245 V${468 - DY} M892 ${N_Y} V${468 - DY} M1052 ${N_Y} V${468 - DY}`} stroke={N_COLOR} strokeWidth={3} />
        </g>
        <g fill={N_COLOR}>
          <circle cx="892" cy={N_Y} r="5" />
          <circle cx="1052" cy={N_Y} r="5" />
        </g>

        {/* ── Corrientes simuladas ── */}
        <g fontSize="19" fontWeight="600">
          <text x={LABEL_X} y="528" textAnchor="middle" fill={COL.R.color}>
            <Sub base="I" sub="R" />
            <tspan> = {fmt(iPhase, 3)} A</tspan>
          </text>
          {active.includes("S") ? (
            <text x={LABEL_X} y="596" textAnchor="middle" fill={COL.S.color}>
              <Sub base="I" sub="S" />
              <tspan> = {fmt(iPhase, 3)} A</tspan>
            </text>
          ) : null}
          {active.includes("T") ? (
            <text x={LABEL_X} y="661" textAnchor="middle" fill={COL.T.color}>
              <Sub base="I" sub="T" />
              <tspan> = {fmt(iPhase, 3)} A</tspan>
            </text>
          ) : null}
          <text x={LABEL_X} y="719" textAnchor="middle" fill={N_COLOR}>
            <Sub base="I" sub="N" />
            <tspan> = {fmt(iNeutral, 3)} A</tspan>
          </text>
        </g>

        </g>

        {/* ── Tablero ── */}
        <rect x="740" y="5" width="578" height="463" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M925 5 V468 M1124 5 V468" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5" />
        {PHASES.map((p) => {
          const c = COL[p];
          const on = active.includes(p);
          return (
            <g key={p}>
              <text
                x={c.lampX - (p === "R" ? 35 : p === "S" ? 35 : 30)}
                y="52"
                fontSize="38"
                fontStyle="italic"
                fontWeight="bold"
                textAnchor="middle"
                fill={on ? c.color : "currentColor"}
              >
                {p}
              </text>
              {ROW_Y.map((y, row) => {
                const lit = on && row === litRow;
                const isSocket = row === 0;
                return (
                  <g key={row}>
                    {/* interruptor */}
                    <rect x={c.swX - 30} y={y - 21} width="60" height="42" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect
                      x={c.swX - 21}
                      y={y - 13}
                      width="42"
                      height="26"
                      fill={lit ? c.color : "none"}
                      fillOpacity={lit ? 0.45 : 0}
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    {/* lámpara / carga del tomacorriente */}
                    {lit && lamp ? (
                      <circle cx={c.lampX} cy={y} r="52" fill={`url(#glow-${gid})`} />
                    ) : null}
                    <circle
                      cx={c.lampX}
                      cy={y}
                      r="28"
                      fill={lit ? (lamp ? "#fde68a" : "#bfdbfe") : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    {isSocket ? (
                      <text
                        x={c.lampX - 2}
                        y={y + 8.6}
                        fontSize="24"
                        fontStyle="italic"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill={lit ? "#1f2937" : "currentColor"}
                      >
                        {c.label}
                      </text>
                    ) : (
                      <>
                        <path
                          d={`M${c.lampX - 20} ${y - 20} L${c.lampX + 20} ${y + 20} M${c.lampX + 20} ${y - 20} L${c.lampX - 20} ${y + 20}`}
                          stroke={lit ? "#1f2937" : "currentColor"}
                          strokeWidth="2"
                        />
                        <text
                          x={c.lampX}
                          y={y + 47}
                          fontSize="15"
                          textAnchor="middle"
                          fill="currentColor"
                          opacity="0.75"
                        >
                          {lampLabels[row - 1]}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-neutral-600 dark:text-neutral-300">
        <span className="font-semibold">{caption}</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-neutral-500 bg-amber-200" />
          {t("poli.sim.circuit.legend.on")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-neutral-500 bg-blue-200" />
          {t("poli.sim.circuit.legend.conn")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-neutral-500" />
          {t("poli.sim.circuit.legend.off")}
        </span>
      </div>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        {t("poli.sim.circuit.note")}
      </p>
      {!lamp ? (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {t("poli.sim.circuit.noteSocket")}
        </p>
      ) : null}
    </div>
  );
}
