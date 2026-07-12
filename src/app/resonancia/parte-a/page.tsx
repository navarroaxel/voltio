"use client";

import { Card } from "@/components/ui/Card";
import { CircuitSchematic } from "@/components/sim/CircuitSchematic";
import { MetricsGrid, type Metric } from "@/components/sim/MetricsGrid";
import { DataTable } from "@/components/sim/DataTable";
import { PointSelector } from "@/components/sim/PointSelector";
import { ChartTabs } from "@/components/sim/ChartTabs";
import { LineChart, type Series } from "@/components/charts/LineChart";
import { PhasorDiagram } from "@/components/charts/PhasorDiagram";
import { ImpedanceTriangle } from "@/components/charts/ImpedanceTriangle";
import {
  useParteA,
  PARTE_A_FREQS,
  PARTE_A_F0,
  PARTE_A_F0_INDEX,
} from "@/store/parte-a-store";
import { calcRLC, resonantC, linspace } from "@/lib/rlc-engine";
import {
  PARTE_A,
  PARTE_A_BASE,
  PARTE_A_MEDIDO,
  PARTE_A_C_PRIMERO,
  UF,
} from "@/lib/measured-data";
import { fmt } from "@/lib/format";

const COL = {
  UR: "#2563eb",
  UL: "#dc2626",
  UC: "#16a34a",
  I: "#d97706",
  Z: "#7c3aed",
  P: "#0891b2",
  Q: "#db2777",
  phi: "#ea580c",
};

const Cres = resonantC(PARTE_A.L, PARTE_A.f); // F
const IMax = PARTE_A.U / (PARTE_A.R + PARTE_A.RL); // A, límite asintótico (C → ∞)

export default function ParteAPage() {
  const { state, dispatch } = useParteA();
  const { viewMode, cIndex, fIndex, chartTab } = state;

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          TP N°1 · Parte A
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          RLC serie — se varía la capacidad C
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Fuente Variac a {fmt(PARTE_A.U, 0)} V / {PARTE_A.f} Hz constante.
          R&nbsp;=&nbsp;{PARTE_A.R}&nbsp;Ω, L&nbsp;=&nbsp;{fmt(PARTE_A.L, 2)}
          &nbsp;H, R<sub>L</sub>&nbsp;=&nbsp;{fmt(PARTE_A.RL, 1)}&nbsp;Ω.
        </p>
      </header>

      <Card>
        <CircuitSchematic variant="parteA" />
      </Card>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>Condición de resonancia (punto 6a):</strong> para resonar a{" "}
        {PARTE_A.f} Hz se necesita C = 1/(ω²·L) ={" "}
        <strong>{fmt(Cres / UF, 1)} µF</strong>. La caja de capacitores llega
        sólo a ~64 µF (8 escalones × 8 µF), muy por debajo de eso, así que{" "}
        <strong>el circuito nunca alcanza la resonancia</strong> en este ensayo:
        siempre es capacitivo (X<sub>C</sub> &gt; X<sub>L</sub>). Al no
        resonar, la corriente sólo crece asintóticamente hacia{" "}
        <strong>
          I<sub>max</sub> = U/(R + R<sub>L</sub>) ≈ {fmt(IMax, 3)} A
        </strong>{" "}
        y el factor de mérito a los 50 Hz de resonancia es muy bajo (Q ≈
        0,03), lo que da una curva chata y poco selectiva.
      </div>

      {/* Selector de vista */}
      <div className="inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_VIEW", viewMode: "barridoC" })}
          className={
            viewMode === "barridoC"
              ? "rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm dark:bg-neutral-700"
              : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400"
          }
        >
          Barrido de C (ensayo medido)
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_VIEW", viewMode: "barridoF" })}
          className={
            viewMode === "barridoF"
              ? "rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm dark:bg-neutral-700"
              : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400"
          }
        >
          Barrido de f (punto 6d)
        </button>
      </div>

      {viewMode === "barridoC" ? (
        <BarridoC cIndex={cIndex} chartTab={chartTab} dispatch={dispatch} />
      ) : (
        <BarridoF fIndex={fIndex} chartTab={chartTab} dispatch={dispatch} />
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
//  Vista: barrido de C (ensayo principal medido)
// ---------------------------------------------------------------------------

function BarridoC({
  cIndex,
  chartTab,
  dispatch,
}: {
  cIndex: number;
  chartTab: "tensiones" | "iz" | "pq";
  dispatch: ReturnType<typeof useParteA>["dispatch"];
}) {
  const row = PARTE_A_MEDIDO[cIndex];
  const result = calcRLC({ ...PARTE_A_BASE, C: row.C * UF });

  // Curva teórica continua (8…66 µF, rango útil del ensayo).
  const cSweep = linspace(8, 66, 60);
  const theory = cSweep.map((c) => ({
    c,
    r: calcRLC({ ...PARTE_A_BASE, C: c * UF }),
  }));
  const medFinite = PARTE_A_MEDIDO.filter((m) => m.I > 0);

  const metrics: Metric[] = [
    { label: "Z", value: fmt(result.Z, 1), unit: "Ω", accent: "violet" },
    { label: "I", value: fmt(result.I, 3), unit: "A", accent: "amber" },
    { label: "φ", value: fmt(result.phiDeg, 1), unit: "°" },
    { label: "U_R", value: fmt(result.UR, 1), unit: "V", accent: "blue" },
    { label: "U_L", value: fmt(result.UL, 2), unit: "V", accent: "red" },
    { label: "U_C", value: fmt(result.UC, 1), unit: "V", accent: "green" },
    { label: "P", value: fmt(result.P, 2), unit: "W" },
    { label: "X_C", value: fmt(result.XC, 1), unit: "Ω" },
    { label: "cos φ", value: fmt(result.fp, 3) },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <Card title="Punto de medición">
          <PointSelector
            count={PARTE_A_MEDIDO.length}
            index={cIndex}
            onChange={(i) => dispatch({ type: "SET_C_INDEX", index: i })}
            label={`C = ${fmt(row.C, 0)} µF`}
            hint={row.C === 0 ? "capacitor abierto" : undefined}
          />
          <div className="mt-4">
            <MetricsGrid metrics={metrics} />
          </div>
        </Card>

        <Card title="Diagrama fasorial (tensiones)">
          <PhasorDiagram result={result} />
        </Card>

        <Card title="Diagrama de impedancia">
          <ImpedanceTriangle result={result} />
        </Card>

        <Card title="Conclusiones (punto 6g)">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            La corriente medida crece con C pero nunca muestra un pico de
            resonancia: la capacidad disponible (~64 µF) queda muy por debajo
            de los ~{fmt(Cres / UF, 0)} µF necesarios para resonar a 50 Hz.
            Tiende asintóticamente a I<sub>max</sub> ≈ {fmt(IMax, 3)} A sin
            llegar a alcanzarla. Además R = {PARTE_A.R} Ω domina ampliamente
            sobre las reactancias (Q ≪ 1), por lo que la respuesta es apenas
            selectiva — consistente con lo que muestra la tabla medida.
          </p>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Gráficos en función de C">
          <ChartTabs
            tabs={[
              { key: "tensiones", label: "U_R, U_L, U_C" },
              { key: "iz", label: "I, Z" },
              { key: "pq", label: "P" },
            ]}
            active={chartTab}
            onChange={(t) => dispatch({ type: "SET_TAB", tab: t })}
          />
          <div className="mt-4 space-y-6">
            {chartTab === "tensiones" && (
              <LineChart
                xLabel="C (µF)"
                yLabel="Tensión (V)"
                xDecimals={0}
                series={[
                  line(
                    "U_R",
                    COL.UR,
                    theory.map((t) => ({ x: t.c, y: t.r.UR })),
                  ),
                  scatter(
                    "U_R",
                    COL.UR,
                    medFinite.map((m) => ({ x: m.C, y: m.UR })),
                  ),
                  line(
                    "U_C",
                    COL.UC,
                    theory.map((t) => ({ x: t.c, y: t.r.UC })),
                  ),
                  scatter(
                    "U_C",
                    COL.UC,
                    medFinite.map((m) => ({ x: m.C, y: m.UC })),
                  ),
                  line(
                    "U_L",
                    COL.UL,
                    theory.map((t) => ({ x: t.c, y: t.r.UL })),
                  ),
                  scatter(
                    "U_L",
                    COL.UL,
                    medFinite.map((m) => ({ x: m.C, y: m.UL })),
                  ),
                ]}
              />
            )}
            {chartTab === "iz" && (
              <>
                <LineChart
                  xLabel="C (µF)"
                  yLabel="I (A)"
                  xDecimals={0}
                  yDecimals={3}
                  series={[
                    line(
                      "I",
                      COL.I,
                      theory.map((t) => ({ x: t.c, y: t.r.I })),
                    ),
                    scatter(
                      "I",
                      COL.I,
                      medFinite.map((m) => ({ x: m.C, y: m.I })),
                    ),
                  ]}
                />
                <LineChart
                  xLabel="C (µF)"
                  yLabel="Z (Ω)"
                  xDecimals={0}
                  yDecimals={0}
                  series={[
                    line(
                      "Z",
                      COL.Z,
                      theory.map((t) => ({ x: t.c, y: t.r.Z })),
                    ),
                    scatter(
                      "Z",
                      COL.Z,
                      medFinite.map((m) => ({ x: m.C, y: PARTE_A.U / m.I })),
                    ),
                  ]}
                />
              </>
            )}
            {chartTab === "pq" && (
              <LineChart
                xLabel="C (µF)"
                yLabel="P (W)"
                xDecimals={0}
                yDecimals={1}
                series={[
                  line(
                    "P",
                    COL.P,
                    theory.map((t) => ({ x: t.c, y: t.r.P })),
                  ),
                  scatter(
                    "P",
                    COL.P,
                    medFinite.map((m) => ({ x: m.C, y: m.P })),
                  ),
                ]}
              />
            )}
          </div>
        </Card>

        <Card title="Tabla de valores medidos">
          <DataTable
            columns={[
              { label: "C", sub: "µF" },
              { label: "I", sub: "A" },
              { label: "U_R", sub: "V" },
              { label: "U_L", sub: "V" },
              { label: "U_C", sub: "V" },
              { label: "P", sub: "W" },
              { label: "Z = U/I", sub: "Ω" },
            ]}
            highlightRow={cIndex}
            rows={PARTE_A_MEDIDO.map((m) => [
              fmt(m.C, 0),
              fmt(m.I, 3),
              fmt(m.UR, 1),
              fmt(m.UL, 2),
              fmt(m.UC, 1),
              fmt(m.P, 1),
              m.I > 0 ? fmt(PARTE_A.U / m.I, 0) : "—",
            ])}
          />
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Vista: barrido de frecuencia (punto 6d, C = 63 µF)
// ---------------------------------------------------------------------------

function BarridoF({
  fIndex,
  chartTab,
  dispatch,
}: {
  fIndex: number;
  chartTab: "tensiones" | "iz" | "pq";
  dispatch: ReturnType<typeof useParteA>["dispatch"];
}) {
  const C = PARTE_A_C_PRIMERO * UF;
  const f = PARTE_A_FREQS[fIndex];
  const result = calcRLC({ ...PARTE_A_BASE, C, f });

  const fSweep = linspace(
    PARTE_A_FREQS[0],
    PARTE_A_FREQS[PARTE_A_FREQS.length - 1],
    80,
  );
  const theory = fSweep.map((ff) => ({
    f: ff,
    r: calcRLC({ ...PARTE_A_BASE, C, f: ff }),
  }));
  const marker = { x: PARTE_A_F0, label: "f₀", color: "#7c3aed" };
  const qF0 = calcRLC({
    ...PARTE_A_BASE,
    C: PARTE_A_C_PRIMERO * UF,
    f: PARTE_A_F0,
  }).Qfactor;

  const cond =
    fIndex === PARTE_A_F0_INDEX
      ? "f = f₀"
      : fIndex < PARTE_A_F0_INDEX
        ? "f < f₀"
        : "f > f₀";

  const metrics: Metric[] = [
    { label: "f", value: fmt(f, 1), unit: "Hz", accent: "amber" },
    { label: "Z", value: fmt(result.Z, 1), unit: "Ω", accent: "violet" },
    { label: "I", value: fmt(result.I, 3), unit: "A", accent: "amber" },
    { label: "φ", value: fmt(result.phiDeg, 1), unit: "°" },
    { label: "U_R", value: fmt(result.UR, 1), unit: "V", accent: "blue" },
    { label: "U_L", value: fmt(result.UL, 2), unit: "V", accent: "red" },
    { label: "U_C", value: fmt(result.UC, 1), unit: "V", accent: "green" },
    { label: "P", value: fmt(result.P, 2), unit: "W" },
    { label: "Q", value: fmt(result.Qreact, 2), unit: "VAR" },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
          Para el primer C de la tabla (C = {PARTE_A_C_PRIMERO} µF), la
          frecuencia de resonancia teórica es{" "}
          <strong>f₀ = {fmt(PARTE_A_F0, 1)} Hz</strong> (punto 6c). El barrido
          toma 5 frecuencias por debajo y 5 por encima. Aun en f₀ el factor de
          mérito sigue siendo ≪ 1 (Q ≈ {fmt(qF0, 3)}), por lo que el pico de
          resonancia teórico es apenas pronunciado.
        </div>

        <Card title={`Punto de cálculo · ${cond}`}>
          <PointSelector
            count={PARTE_A_FREQS.length}
            index={fIndex}
            onChange={(i) => dispatch({ type: "SET_F_INDEX", index: i })}
            label={`f = ${fmt(f, 1)} Hz`}
            hint={cond}
          />
          <div className="mt-4">
            <MetricsGrid metrics={metrics} />
          </div>
        </Card>

        <Card title="Diagrama fasorial (tensiones)">
          <PhasorDiagram result={result} />
        </Card>

        <Card title="Diagrama de impedancia">
          <ImpedanceTriangle result={result} />
        </Card>
      </div>

      <div className="space-y-5">
        <Card title="Gráficos en función de f">
          <ChartTabs
            tabs={[
              { key: "tensiones", label: "U_R, U_L, U_C" },
              { key: "iz", label: "I, Z" },
              { key: "pq", label: "P, Q, φ" },
            ]}
            active={chartTab}
            onChange={(t) => dispatch({ type: "SET_TAB", tab: t })}
          />
          <div className="mt-4 space-y-6">
            {chartTab === "tensiones" && (
              <LineChart
                xLabel="f (Hz)"
                yLabel="Tensión (V)"
                markers={[marker]}
                series={[
                  line(
                    "U_R",
                    COL.UR,
                    theory.map((t) => ({ x: t.f, y: t.r.UR })),
                  ),
                  line(
                    "U_C",
                    COL.UC,
                    theory.map((t) => ({ x: t.f, y: t.r.UC })),
                  ),
                  line(
                    "U_L",
                    COL.UL,
                    theory.map((t) => ({ x: t.f, y: t.r.UL })),
                  ),
                ]}
              />
            )}
            {chartTab === "iz" && (
              <>
                <LineChart
                  xLabel="f (Hz)"
                  yLabel="I (A)"
                  yDecimals={3}
                  markers={[marker]}
                  series={[
                    line(
                      "I",
                      COL.I,
                      theory.map((t) => ({ x: t.f, y: t.r.I })),
                    ),
                  ]}
                />
                <LineChart
                  xLabel="f (Hz)"
                  yLabel="Z (Ω)"
                  yDecimals={0}
                  markers={[marker]}
                  series={[
                    line(
                      "Z",
                      COL.Z,
                      theory.map((t) => ({ x: t.f, y: t.r.Z })),
                    ),
                  ]}
                />
              </>
            )}
            {chartTab === "pq" && (
              <>
                <LineChart
                  xLabel="f (Hz)"
                  yLabel="P (W) · Q (VAR)"
                  yFromZero={false}
                  yDecimals={2}
                  markers={[marker]}
                  series={[
                    line(
                      "P",
                      COL.P,
                      theory.map((t) => ({ x: t.f, y: t.r.P })),
                    ),
                    line(
                      "Q",
                      COL.Q,
                      theory.map((t) => ({ x: t.f, y: t.r.Qreact })),
                    ),
                  ]}
                />
                <LineChart
                  xLabel="f (Hz)"
                  yLabel="φ (°)"
                  yFromZero={false}
                  yDecimals={0}
                  markers={[marker]}
                  series={[
                    line(
                      "φ",
                      COL.phi,
                      theory.map((t) => ({ x: t.f, y: t.r.phiDeg })),
                    ),
                  ]}
                />
              </>
            )}
          </div>
        </Card>

        <Card title="Tabla del punto 6d (calculada)">
          <DataTable
            columns={[
              { label: "f", sub: "Hz" },
              { label: "Z", sub: "Ω" },
              { label: "I", sub: "A" },
              { label: "U_R", sub: "V" },
              { label: "U_L", sub: "V" },
              { label: "U_C", sub: "V" },
              { label: "P", sub: "W" },
              { label: "Q", sub: "VAR" },
              { label: "φ", sub: "°" },
            ]}
            highlightRow={fIndex}
            rows={PARTE_A_FREQS.map((ff) => {
              const r = calcRLC({ ...PARTE_A_BASE, C, f: ff });
              return [
                fmt(ff, 1),
                fmt(r.Z, 1),
                fmt(r.I, 3),
                fmt(r.UR, 1),
                fmt(r.UL, 2),
                fmt(r.UC, 1),
                fmt(r.P, 2),
                fmt(r.Qreact, 2),
                fmt(r.phiDeg, 1),
              ];
            })}
          />
        </Card>
      </div>
    </div>
  );
}

// Helpers de series
function line(label: string, color: string, points: Series["points"]): Series {
  return { label, color, points, kind: "line" };
}
function scatter(
  label: string,
  color: string,
  points: Series["points"],
): Series {
  return { label, color, points, kind: "scatter" };
}
