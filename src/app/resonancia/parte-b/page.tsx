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
import { useParteB, PARTE_B_F0 } from "@/store/parte-b-store";
import { calcRLC, linspace } from "@/lib/rlc-engine";
import {
  PARTE_B,
  PARTE_B_BASE,
  PARTE_B_ESTIMADO,
  PARTE_B_MEDIDO,
  PARTE_B_RESONANCIA,
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

export default function ParteBPage() {
  const { state, dispatch } = useParteB();
  const { fIndex, chartTab } = state;

  const rz = PARTE_B_RESONANCIA;
  const row = PARTE_B_MEDIDO[fIndex];
  const result = calcRLC({ ...PARTE_B_BASE, f: row.f });

  const fMin = PARTE_B_MEDIDO[0].f;
  const fMax = PARTE_B_MEDIDO[PARTE_B_MEDIDO.length - 1].f;
  const fSweep = linspace(fMin, fMax, 120);
  const theory = fSweep.map((ff) => ({
    f: ff,
    r: calcRLC({ ...PARTE_B_BASE, f: ff }),
  }));
  const marker = { x: PARTE_B_F0, label: "f₀", color: "#7c3aed" };

  // Medidos: I = U_R/R, Z = U/I.
  const med = PARTE_B_MEDIDO.map((m) => {
    const I = m.URS / PARTE_B.R;
    return { ...m, I, Z: I > 0 ? m.U / I : NaN };
  });

  const cond =
    Math.abs(row.f - PARTE_B_F0) < 6
      ? "f ≈ f₀"
      : row.f < PARTE_B_F0
        ? "f < f₀"
        : "f > f₀";

  const metrics: Metric[] = [
    { label: "f", value: fmt(row.f, 0), unit: "Hz", accent: "amber" },
    { label: "Z", value: fmt(result.Z, 0), unit: "Ω", accent: "violet" },
    { label: "I", value: fmt(result.I * 1000, 2), unit: "mA", accent: "amber" },
    { label: "φ", value: fmt(result.phiDeg, 1), unit: "°" },
    { label: "U_R", value: fmt(result.UR, 2), unit: "V", accent: "blue" },
    { label: "U_L", value: fmt(result.UL, 1), unit: "V", accent: "red" },
    { label: "U_C", value: fmt(result.UC, 1), unit: "V", accent: "green" },
    { label: "cos φ", value: fmt(result.fp, 3) },
    { label: "Q (mérito)", value: fmt(result.Qfactor, 1) },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          TP N°1 · Parte B
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          RLC serie — se varía la frecuencia f
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Fuente GAF a tensión senoidal constante (≈{fmt(PARTE_B.U, 0)} V).
          Resonancia teórica en <strong>f₀ ≈ {fmt(PARTE_B_F0, 0)} Hz</strong>.
        </p>
      </header>

      <Card>
        <CircuitSchematic variant="parteB" />
      </Card>

      {PARTE_B_ESTIMADO && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <strong>Nota:</strong> el enunciado no fija los valores de R, L y C de
          este ensayo. Los usados aquí (R&nbsp;=&nbsp;{PARTE_B.R}&nbsp;Ω,
          L&nbsp;=&nbsp;{fmt(PARTE_B.L, 2)}&nbsp;H, C&nbsp;=&nbsp;
          {fmt(PARTE_B.C, 1)}&nbsp;µF, R<sub>L</sub>&nbsp;=&nbsp;{PARTE_B.RL}
          &nbsp;Ω)
          son <strong>estimados</strong> a partir de la curva medida
          (reproducen f₀ y Q). Reemplazar por los valores reales registrados
          por el grupo. La tensión de fuente medida cae en resonancia
          (impedancia interna del GAF), por eso la teoría con U constante
          queda por encima del pico medido.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Card title={`Punto de medición · ${cond}`}>
            <PointSelector
              count={PARTE_B_MEDIDO.length}
              index={fIndex}
              onChange={(i) => dispatch({ type: "SET_F_INDEX", index: i })}
              label={`f = ${fmt(row.f, 0)} Hz`}
              hint={`medición N°${row.n}`}
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
                    scatter(
                      "U_R",
                      COL.UR,
                      med.map((m) => ({ x: m.f, y: m.URS })),
                    ),
                    line(
                      "U_C",
                      COL.UC,
                      theory.map((t) => ({ x: t.f, y: t.r.UC })),
                    ),
                    scatter(
                      "U_C",
                      COL.UC,
                      med.map((m) => ({ x: m.f, y: m.UC })),
                    ),
                    line(
                      "U_L",
                      COL.UL,
                      theory.map((t) => ({ x: t.f, y: t.r.UL })),
                    ),
                    scatter(
                      "U_L",
                      COL.UL,
                      med.map((m) => ({ x: m.f, y: m.UL })),
                    ),
                  ]}
                />
              )}
              {chartTab === "iz" && (
                <>
                  <LineChart
                    xLabel="f (Hz)"
                    yLabel="I (mA)"
                    yDecimals={1}
                    markers={[marker]}
                    series={[
                      line(
                        "I",
                        COL.I,
                        theory.map((t) => ({ x: t.f, y: t.r.I * 1000 })),
                      ),
                      scatter(
                        "I",
                        COL.I,
                        med.map((m) => ({ x: m.f, y: m.I * 1000 })),
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
                      scatter(
                        "Z",
                        COL.Z,
                        med.map((m) => ({ x: m.f, y: m.Z })),
                      ),
                    ]}
                  />
                </>
              )}
              {chartTab === "pq" && (
                <>
                  <LineChart
                    xLabel="f (Hz)"
                    yLabel="P (mW) · Q (mVAR)"
                    yFromZero={false}
                    yDecimals={0}
                    markers={[marker]}
                    series={[
                      line(
                        "P",
                        COL.P,
                        theory.map((t) => ({ x: t.f, y: t.r.P * 1000 })),
                      ),
                      line(
                        "Q",
                        COL.Q,
                        theory.map((t) => ({ x: t.f, y: t.r.Qreact * 1000 })),
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

          <Card title="Tabla: medidos + calculados">
            <DataTable
              columns={[
                { label: "N°" },
                { label: "f", sub: "Hz" },
                { label: "U", sub: "V" },
                { label: "U_R", sub: "V" },
                { label: "U_L", sub: "V" },
                { label: "U_C", sub: "V" },
                { label: "I", sub: "mA" },
                { label: "Z", sub: "Ω" },
              ]}
              highlightRow={fIndex}
              rows={med.map((m) => [
                m.n,
                fmt(m.f, 0),
                fmt(m.U, 2),
                fmt(m.URS, 3),
                fmt(m.UL, 2),
                fmt(m.UC, 2),
                fmt(m.I * 1000, 2),
                fmt(m.Z, 0),
              ])}
            />
          </Card>

          <Card title="Conclusiones (medido)">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Resonancia en la medición N°{rz.n} ≈ {fmt(rz.f, 0)} Hz: U_RS
              máxima ({fmt(rz.URS, 3)} V) y U<sub>L</sub> ≈ U<sub>C</sub> (
              {fmt(rz.UL, 2)} / {fmt(rz.UC, 2)} V).
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              <strong>Sobretensión:</strong> U<sub>L</sub> y U<sub>C</sub> (~
              {fmt(rz.UL, 0)} V) muy por encima de la fuente (~{fmt(rz.U, 1)}{" "}
              V) → factor de mérito Q ≈ {fmt(rz.UL / rz.U, 1)} (= U
              <sub>L</sub>/U).
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              <strong>Doble lectura de Q:</strong> respecto a la fuente Q = U
              <sub>L</sub>/U ≈ {fmt(rz.UL / rz.U, 1)}; respecto a la R externa
              Q = U<sub>C</sub>/U_RS ≈ {fmt(rz.UC / rz.URS, 1)}. La diferencia
              revela la resistencia interna de la bobina R<sub>L</sub> (el
              exceso U − U_RS ≈ {fmt(rz.U - rz.URS, 2)} V cae en R
              <sub>L</sub>).
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              <strong>Caída de fuente:</strong> la tensión medida baja de ~4 V
              a {fmt(rz.U, 2)} V en resonancia por la impedancia interna del
              GAF (no es error); por eso la curva teórica con U constante
              queda por encima del pico medido.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}

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
