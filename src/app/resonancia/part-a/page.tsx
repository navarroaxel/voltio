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
  usePartA,
  PART_A_FREQS,
  PART_A_F0,
  PART_A_F0_INDEX,
} from "@/store/parte-a-store";
import { calcRLC, resonantC, linspace } from "@/lib/rlc-engine";
import {
  PART_A,
  PART_A_BASE,
  PART_A_MEASURED,
  PART_A_FIRST_C,
  UF,
} from "@/lib/measured-data";
import { fmt } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";

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

const cResonance = resonantC(PART_A.L, PART_A.f); // F
const iMax = PART_A.U / (PART_A.R + PART_A.RL); // A, asymptotic limit (C → ∞)

export default function PartAPage() {
  const { state, dispatch } = usePartA();
  const { viewMode, cIndex, fIndex, chartTab } = state;
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("parta.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {t("parta.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {t("parta.header.source")} {fmt(PART_A.U, 0)} V / {PART_A.f} Hz{" "}
          {t("parta.header.constant")} R&nbsp;=&nbsp;{PART_A.R}&nbsp;Ω,
          L&nbsp;=&nbsp;{fmt(PART_A.L, 2)}
          &nbsp;H, R<sub>L</sub>&nbsp;=&nbsp;{fmt(PART_A.RL, 1)}&nbsp;Ω.
        </p>
      </header>

      <Card>
        <CircuitSchematic variant="parteA" />
      </Card>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>{t("parta.resCondition.label")}</strong>{" "}
        {t("parta.resCondition.toResonateAt")} {PART_A.f} Hz{" "}
        {t("parta.resCondition.needed")}{" "}
        <strong>{fmt(cResonance / UF, 1)} µF</strong>.{" "}
        {t("parta.resCondition.boxIntro")}{" "}
        <strong>{t("parta.resCondition.neverReaches")}</strong>{" "}
        {t("parta.resCondition.testDetail")} (X<sub>C</sub> &gt; X
        <sub>L</sub>). {t("parta.resCondition.noResonanceGrowth")}{" "}
        <strong>
          I<sub>max</sub> = U/(R + R<sub>L</sub>) ≈ {fmt(iMax, 3)} A
        </strong>{" "}
        {t("parta.resCondition.lowQ")}
      </div>

      {/* View selector */}
      <div className="inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_VIEW", viewMode: "sweepC" })}
          className={
            viewMode === "sweepC"
              ? "rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm dark:bg-neutral-700"
              : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400"
          }
        >
          {t("parta.view.sweepC")}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_VIEW", viewMode: "sweepF" })}
          className={
            viewMode === "sweepF"
              ? "rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm dark:bg-neutral-700"
              : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400"
          }
        >
          {t("parta.view.sweepF")}
        </button>
      </div>

      {viewMode === "sweepC" ? (
        <SweepC cIndex={cIndex} chartTab={chartTab} dispatch={dispatch} />
      ) : (
        <SweepF fIndex={fIndex} chartTab={chartTab} dispatch={dispatch} />
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
//  View: C sweep (main measured test)
// ---------------------------------------------------------------------------

function SweepC({
  cIndex,
  chartTab,
  dispatch,
}: {
  cIndex: number;
  chartTab: "voltages" | "iz" | "pq";
  dispatch: ReturnType<typeof usePartA>["dispatch"];
}) {
  const { t } = useLanguage();
  const row = PART_A_MEASURED[cIndex];
  const result = calcRLC({ ...PART_A_BASE, C: row.C * UF });

  // Continuous theoretical curve (8…66 µF, useful range of the test).
  const cSweep = linspace(8, 66, 60);
  const theory = cSweep.map((c) => ({
    c,
    r: calcRLC({ ...PART_A_BASE, C: c * UF }),
  }));
  const measuredFinite = PART_A_MEASURED.filter((m) => m.I > 0);

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
        <Card title={t("parta.card.pointMeasurement")}>
          <PointSelector
            count={PART_A_MEASURED.length}
            index={cIndex}
            onChange={(i) => dispatch({ type: "SET_C_INDEX", index: i })}
            label={`C = ${fmt(row.C, 0)} µF`}
            hint={row.C === 0 ? t("parta.hint.openCapacitor") : undefined}
          />
          <div className="mt-4">
            <MetricsGrid metrics={metrics} />
          </div>
        </Card>

        <Card title={t("parta.card.phasor")}>
          <PhasorDiagram result={result} />
        </Card>

        <Card title={t("parta.card.impedance")}>
          <ImpedanceTriangle result={result} />
        </Card>

        <Card title={t("parta.sweepC.conclusionsCard")}>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {t("parta.sweepC.concl1")}
            {fmt(cResonance / UF, 0)} µF {t("parta.sweepC.concl2")} I
            <sub>max</sub> ≈ {fmt(iMax, 3)} A {t("parta.sweepC.concl3")} R ={" "}
            {PART_A.R} Ω {t("parta.sweepC.concl4")}
          </p>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title={t("parta.sweepC.chartsCard")}>
          <ChartTabs
            tabs={[
              { key: "voltages", label: "U_R, U_L, U_C" },
              { key: "iz", label: "I, Z" },
              { key: "pq", label: "P" },
            ]}
            active={chartTab}
            onChange={(t) => dispatch({ type: "SET_TAB", tab: t })}
          />
          <div className="mt-4 space-y-6">
            {chartTab === "voltages" && (
              <LineChart
                xLabel="C (µF)"
                yLabel={t("parta.chart.voltageLabel")}
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
                    measuredFinite.map((m) => ({ x: m.C, y: m.UR })),
                  ),
                  line(
                    "U_C",
                    COL.UC,
                    theory.map((t) => ({ x: t.c, y: t.r.UC })),
                  ),
                  scatter(
                    "U_C",
                    COL.UC,
                    measuredFinite.map((m) => ({ x: m.C, y: m.UC })),
                  ),
                  line(
                    "U_L",
                    COL.UL,
                    theory.map((t) => ({ x: t.c, y: t.r.UL })),
                  ),
                  scatter(
                    "U_L",
                    COL.UL,
                    measuredFinite.map((m) => ({ x: m.C, y: m.UL })),
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
                      measuredFinite.map((m) => ({ x: m.C, y: m.I })),
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
                      measuredFinite.map((m) => ({
                        x: m.C,
                        y: PART_A.U / m.I,
                      })),
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
                    measuredFinite.map((m) => ({ x: m.C, y: m.P })),
                  ),
                ]}
              />
            )}
          </div>
        </Card>

        <Card title={t("parta.sweepC.tableCard")}>
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
            rows={PART_A_MEASURED.map((m) => [
              fmt(m.C, 0),
              fmt(m.I, 3),
              fmt(m.UR, 1),
              fmt(m.UL, 2),
              fmt(m.UC, 1),
              fmt(m.P, 1),
              m.I > 0 ? fmt(PART_A.U / m.I, 0) : "—",
            ])}
          />
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  View: frequency sweep (point 6d, C = 63 µF)
// ---------------------------------------------------------------------------

function SweepF({
  fIndex,
  chartTab,
  dispatch,
}: {
  fIndex: number;
  chartTab: "voltages" | "iz" | "pq";
  dispatch: ReturnType<typeof usePartA>["dispatch"];
}) {
  const { t } = useLanguage();
  const C = PART_A_FIRST_C * UF;
  const f = PART_A_FREQS[fIndex];
  const result = calcRLC({ ...PART_A_BASE, C, f });

  const fSweep = linspace(
    PART_A_FREQS[0],
    PART_A_FREQS[PART_A_FREQS.length - 1],
    80,
  );
  const theory = fSweep.map((ff) => ({
    f: ff,
    r: calcRLC({ ...PART_A_BASE, C, f: ff }),
  }));
  const marker = { x: PART_A_F0, label: "f₀", color: "#7c3aed" };
  const qF0 = calcRLC({
    ...PART_A_BASE,
    C: PART_A_FIRST_C * UF,
    f: PART_A_F0,
  }).Qfactor;

  const condition =
    fIndex === PART_A_F0_INDEX
      ? "f = f₀"
      : fIndex < PART_A_F0_INDEX
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
          {t("parta.sweepF.info1")} {PART_A_FIRST_C} µF),{" "}
          {t("parta.sweepF.info2")}{" "}
          <strong>f₀ = {fmt(PART_A_F0, 1)} Hz</strong>{" "}
          {t("parta.sweepF.info3")} {fmt(qF0, 3)}
          {t("parta.sweepF.info4")}
        </div>

        <Card title={`${t("parta.sweepF.pointCard")} · ${condition}`}>
          <PointSelector
            count={PART_A_FREQS.length}
            index={fIndex}
            onChange={(i) => dispatch({ type: "SET_F_INDEX", index: i })}
            label={`f = ${fmt(f, 1)} Hz`}
            hint={condition}
          />
          <div className="mt-4">
            <MetricsGrid metrics={metrics} />
          </div>
        </Card>

        <Card title={t("parta.card.phasor")}>
          <PhasorDiagram result={result} />
        </Card>

        <Card title={t("parta.card.impedance")}>
          <ImpedanceTriangle result={result} />
        </Card>
      </div>

      <div className="space-y-5">
        <Card title={t("parta.sweepF.chartsCard")}>
          <ChartTabs
            tabs={[
              { key: "voltages", label: "U_R, U_L, U_C" },
              { key: "iz", label: "I, Z" },
              { key: "pq", label: "P, Q, φ" },
            ]}
            active={chartTab}
            onChange={(t) => dispatch({ type: "SET_TAB", tab: t })}
          />
          <div className="mt-4 space-y-6">
            {chartTab === "voltages" && (
              <LineChart
                xLabel="f (Hz)"
                yLabel={t("parta.chart.voltageLabel")}
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

        <Card title={t("parta.sweepF.tableCard")}>
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
            rows={PART_A_FREQS.map((ff) => {
              const r = calcRLC({ ...PART_A_BASE, C, f: ff });
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

// Series helpers
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
