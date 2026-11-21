"use client";

import { Card } from "@/components/ui/Card";
import { ChartTabs } from "@/components/sim/ChartTabs";
import { DataTable } from "@/components/sim/DataTable";
import { MetricsGrid, type Metric } from "@/components/sim/MetricsGrid";
import { PhasorDiagram } from "@/components/sim/PhasorDiagram";
import { SliderField } from "@/components/sim/SliderField";
import { StarSchematic } from "@/components/sim/StarSchematic";
import { renderSub } from "@/components/ui/Sub";
import { useLanguage } from "@/i18n/LanguageContext";
import { fmt } from "@/lib/format";
import { useTrifasica, type State } from "@/store/trifasica-store";
import {
  abs,
  arg,
  capacitanceFor,
  inductanceFor,
  solveStar,
  type ReactiveKind,
} from "@/lib/three-phase-engine";
import { casoById, R_FASE, U_RED, X_BANCO, type Caso } from "@/lib/trifasica-data";
import { phasorFromResult } from "@/lib/trifasica-view";

const SYM = { R: 221, S: 221, T: 221 } as const;
const ELEMENTS: ReactiveKind[] = ["none", "capacitor", "inductor"];

/** The measured test that this configuration reproduces, if any. */
function matchingCaso(s: State): Caso | null {
  if (s.net !== "ensayo" || s.R !== R_FASE) return null;
  if (s.reactive === "none") return casoById(s.neutral ? "eq-cn" : "eq-sn");
  if (s.reactive === "capacitor" && Math.abs(s.X - X_BANCO) <= 1)
    return casoById(s.neutral ? "des-cn" : "des-sn");
  return null;
}

export default function SimuladorPage() {
  const { t } = useLanguage();
  const { state, dispatch } = useTrifasica();
  const r = solveStar({
    U: state.net === "ensayo" ? { ...U_RED } : { ...SYM },
    R: state.R,
    reactive: state.reactive,
    X: state.X,
    neutral: state.neutral,
  });
  const ref = matchingCaso(state);
  const phases = ["R", "S", "T"] as const;

  const metrics: Metric[] = [
    {
      label: "U_R'/U_S'/U_T'",
      value: phases.map((p) => fmt(abs(r.Uload[p]), 0)).join(" / "),
      unit: "V",
      accent: "blue",
    },
    {
      label: "I_R/I_S/I_T",
      value: phases.map((p) => fmt(abs(r.I[p]), 2)).join(" / "),
      unit: "A",
      accent: "red",
    },
    {
      label: t("tri.sim.res.UN"),
      value:
        abs(r.UN) < 0.005 ? "0 V" : `${fmt(abs(r.UN), 1)} V ∠ ${fmt(arg(r.UN), 0)}°`,
      accent: "violet",
    },
    {
      label: t("tri.sim.res.IN"),
      value:
        abs(r.IN) < 0.005 ? "0 A" : `${fmt(abs(r.IN), 2)} A ∠ ${fmt(arg(r.IN), 0)}°`,
      accent: "amber",
    },
    { label: t("tri.sim.res.W"), value: `${fmt(r.W1, 0)} + ${fmt(r.W2, 0)} = ${fmt(r.WT, 0)}`, unit: "W", accent: "green" },
    { label: t("tri.sim.res.PT"), value: fmt(r.PT, 0), unit: "W", accent: "green" },
  ];
  const aronOk = Math.abs(r.WT - r.PT) < 0.5;
  const equiv =
    state.reactive === "capacitor"
      ? t("tri.sim.equiv.C").replace("{v}", fmt(capacitanceFor(state.X) * 1e6, 1))
      : state.reactive === "inductor"
        ? t("tri.sim.equiv.L").replace("{v}", fmt(inductanceFor(state.X), 2))
        : null;

  const cmpRows: React.ReactNode[][] | null = ref
    ? [
        [
          renderSub("U_R' / U_S' / U_T' [V]"),
          ref.U.map((u) => fmt(u, 0)).join(" / "),
          phases.map((p) => fmt(abs(r.Uload[p]), 0)).join(" / "),
        ],
        [
          renderSub("I_R / I_S / I_T [A]"),
          ref.I.map((i) => fmt(i, 2)).join(" / "),
          phases.map((p) => fmt(abs(r.I[p]), 2)).join(" / "),
        ],
        ref.neutral
          ? [renderSub("I_N [A]"), ref.IN === 0 ? "≈ 0" : fmt(ref.IN ?? NaN, 2), fmt(abs(r.IN), 2)]
          : [renderSub("U_N [V]"), fmt(ref.UN ?? NaN, 1), fmt(abs(r.UN), 1)],
        [renderSub("W_T [W]"), fmt(ref.WT, 0), fmt(r.WT, 0)],
      ]
    : null;

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("tri.sim.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{t("tri.sim.title")}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t("tri.sim.intro")}</p>
        <p
          role="note"
          className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {t("tri.sim.banner")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Card title={t("tri.sim.card.load")}>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "PRESET_EQUIL" })}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium dark:border-neutral-700"
                >
                  {t("tri.sim.preset.equil")}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "PRESET_BANCO" })}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium dark:border-neutral-700"
                >
                  {t("tri.sim.preset.banco")}
                </button>
              </div>
              <ChartTabs<"on" | "off">
                tabs={[
                  { key: "off", label: t("tri.sim.neutral.off") },
                  { key: "on", label: t("tri.sim.neutral.on") },
                ]}
                active={state.neutral ? "on" : "off"}
                label={t("tri.sim.neutral")}
                onChange={(k) => dispatch({ type: "SET_NEUTRAL", value: k === "on" })}
              />
              <ChartTabs<ReactiveKind>
                tabs={ELEMENTS.map((k) => ({ key: k, label: t(`tri.sim.element.${k}`) }))}
                active={state.reactive}
                label={t("tri.sim.element")}
                onChange={(k) => dispatch({ type: "SET_REACTIVE", value: k })}
              />
              {state.reactive !== "none" ? (
                <div className="space-y-1">
                  <SliderField
                    label={t("tri.sim.X")}
                    unit="Ω"
                    value={state.X}
                    min={50}
                    max={800}
                    step={1}
                    display={fmt(state.X, 0)}
                    onChange={(v) => dispatch({ type: "SET_X", value: v })}
                  />
                  {equiv ? (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{equiv}</p>
                  ) : null}
                </div>
              ) : null}
              <SliderField
                label={t("tri.sim.R")}
                unit="Ω"
                value={state.R}
                min={60}
                max={300}
                step={1}
                display={fmt(state.R, 0)}
                onChange={(v) => dispatch({ type: "SET_R", value: v })}
              />
              <ChartTabs<State["net"]>
                tabs={[
                  { key: "ensayo", label: t("tri.sim.net.ensayo") },
                  { key: "sym", label: t("tri.sim.net.sym") },
                ]}
                active={state.net}
                label={t("tri.sim.net")}
                onChange={(k) => dispatch({ type: "SET_NET", value: k })}
              />
            </div>
          </Card>
          <Card title={t("tri.sim.card.schematic")}>
            <StarSchematic reactive={state.reactive} neutral={state.neutral} />
          </Card>
        </div>
        <Card title={t("tri.sim.card.phasor")}>
          <PhasorDiagram data={phasorFromResult(r)} />
        </Card>
      </div>

      <Card title={t("tri.sim.card.results")}>
        <MetricsGrid metrics={metrics} />
        <p
          className={
            aronOk
              ? "mt-3 text-sm text-green-700 dark:text-green-400"
              : "mt-3 text-sm text-amber-700 dark:text-amber-400"
          }
        >
          {aronOk ? t("tri.sim.res.aronOk") : t("tri.sim.res.aronBad")}
        </p>
      </Card>

      <Card title={t("tri.sim.cmp.title")}>
        {cmpRows ? (
          <DataTable
            columns={[
              { label: t("tri.ens.cmp.quantity") },
              { label: t("tri.ens.cmp.measured") },
              { label: t("tri.sim.cmp.simulated") },
            ]}
            rows={cmpRows}
          />
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("tri.sim.cmp.none")}</p>
        )}
      </Card>

      <Card title={t("tri.sim.limits.title")}>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {["tri.sim.limits.item1", "tri.sim.limits.item2", "tri.sim.limits.item3"].map((k) => (
            <li key={k}>{t(k)}</li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
