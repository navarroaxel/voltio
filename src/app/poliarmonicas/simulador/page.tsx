"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { ChartTabs } from "@/components/sim/ChartTabs";
import { DataTable } from "@/components/sim/DataTable";
import { MetricsGrid, type Metric } from "@/components/sim/MetricsGrid";
import { SliderField } from "@/components/sim/SliderField";
import { BancoSchematic } from "@/components/sim/BancoSchematic";
import { FlukeAnalyzer } from "@/components/fluke/FlukeAnalyzer";
import { flukeModel } from "@/lib/fluke-view";
import { usePoliarmonicas, type GridField } from "@/store/poliarmonicas-store";
import { simulate, type Connection } from "@/lib/harmonics-engine";
import {
  buildLoad,
  capacitorsOnlyInR,
  estimateThd,
  gridFromSettings,
  GRID_PRESETS,
  LOAD_KEYS,
  measuredReference,
  neutralRatio,
  THD_MEASURED,
  TUBOS_C1_UF,
  TUBOS_C2_UF,
  tubosPreset,
  type TubosPreset,
  TUBOS_C_MAX_UF,
  type LoadKey,
} from "@/lib/poliarmonicas-data";
import { fmt } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";
import { renderSub } from "@/components/ui/Sub";

const CONNECTIONS: Connection[] = ["mono", "bifasica", "trifasica"];
const PRESETS = ["ideal", "dia", "distorsionada"] as const;
type TubosKey = TubosPreset;

export default function SimuladorPage() {
  const { t } = useLanguage();
  const { state, dispatch } = usePoliarmonicas();

  const grid = useMemo(
    () => gridFromSettings(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.V1, state.v3, state.v5, state.v7, state.theta],
  );
  const load = useMemo(
    () => buildLoad(state.load, state.tubosC),
    [state.load, state.tubosC],
  );
  const capR = capacitorsOnlyInR(state.load, state.tubosC);
  const connection = capR ? "mono" : state.connection;
  const sim = useMemo(
    () => simulate({ grid, load, connection }),
    [grid, load, connection],
  );

  const fluke = useMemo(() => flukeModel(sim), [sim]);

  const setGrid = (field: GridField) => (value: number) =>
    dispatch({ type: "SET_GRID", field, value });

  const p = sim.phase;
  const n = sim.neutral;
  const multi = connection !== "mono";

  const metrics: Metric[] = [
    { label: t("poli.sim.m.thdV"), value: fmt(sim.thdV * 100, 1), unit: "%", accent: "violet" },
    { label: t("poli.sim.m.Irms"), value: fmt(p.Irms, 3), unit: "A", accent: "red" },
    { label: t("poli.sim.m.I1"), value: fmt(p.I1, 3), unit: "A", accent: "red" },
    { label: t("poli.sim.m.phi"), value: fmt(p.phi1Deg, 1), unit: "°", accent: "blue" },
    { label: t("poli.sim.m.thdI"), value: fmt(p.thdI * 100, 1), unit: "%", accent: "green" },
    { label: t("poli.sim.m.pf"), value: fmt(p.pf, 3), accent: "none" },
    ...(multi
      ? ([
          { label: t("poli.sim.m.IN"), value: fmt(n.Irms, 3), unit: "A", accent: "amber" },
          { label: t("poli.sim.m.ratio"), value: fmt(n.ratio, 2), accent: "amber" },
        ] as Metric[])
      : []),
  ];

  const ref = measuredReference(state.load, connection, state.tubosC);
  const refThd = ref ? estimateThd(ref.I[0], ref.I1) : null;
  const refRatio = ref ? neutralRatio(ref) : null;
  const refThdMeas = ref ? (THD_MEASURED[ref.id] ?? null) : null;
  const dash = (v: number | null, d: number) => (v === null ? "—" : fmt(v, d));
  const lab = (key: string, unit?: string) => (
    <>
      {renderSub(t(key))}
      {unit ? ` (${unit})` : ""}
    </>
  );
  const cmpRows = ref
    ? [
        [lab("poli.sim.m.Irms", "A"), dash(ref.I[0], 3), fmt(p.Irms, 3)],
        [lab("poli.sim.m.phi", "°"), dash(ref.phiDeg, 0), fmt(p.phi1Deg, 1)],
        [lab("poli.sim.m.thdI", "%"), refThd === null ? "—" : fmt(refThd * 100, 0), fmt(p.thdI * 100, 0)],
        [
          lab("poli.ens.read.thdMeas", "%"),
          refThdMeas ? fmt(refThdMeas.pct, 1) : "—",
          fmt(p.thdI * 100, 1),
        ],
        [lab("poli.sim.m.IN", "A"), dash(ref.IN, 3), fmt(n.Irms, 3)],
        [lab("poli.sim.m.ratio"), dash(refRatio, 2), fmt(n.ratio, 2)],
      ]
    : null;

  const tubosKey: TubosKey = tubosPreset(state.tubosC);

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("poli.sim.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {t("poli.sim.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {t("poli.sim.intro")}
        </p>
        <p
          role="note"
          className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {t("poli.sim.banner")}
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card title={t("poli.fluke.title")} className="lg:sticky lg:top-4">
          <FlukeAnalyzer model={fluke} />
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            {t("poli.fluke.help")}
          </p>
        </Card>
        <div className="space-y-5">
        <Card title={t("poli.sim.load.title")}>
          <div className="space-y-4">
            <ChartTabs
              tabs={LOAD_KEYS.map((k: LoadKey) => ({
                key: k,
                label: t(`poli.sim.load.${k}`),
              }))}
              active={state.load}
              label={t("poli.sim.load.label")}
              onChange={(k) => dispatch({ type: "SET_LOAD", load: k })}
            />
            <ChartTabs
              // Con capacitores sólo existe la conexión monofásica: no se
              // ofrecen las otras para que no cambien el estado sin efecto.
              tabs={(capR ? CONNECTIONS.slice(0, 1) : CONNECTIONS).map((k) => ({
                key: k,
                label: t(`poli.sim.conn.${k}`),
              }))}
              active={connection}
              label={t("poli.sim.conn.label")}
              onChange={(k) => dispatch({ type: "SET_CONNECTION", connection: k })}
            />
            {capR ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t("poli.sim.conn.capOnlyR")}
              </p>
            ) : null}
            {state.load === "tubos" ? (
              <div className="space-y-2">
                <ChartTabs<TubosKey>
                  tabs={[
                    { key: "none", label: t("poli.sim.tubosC.none") },
                    { key: "c1", label: t("poli.sim.tubosC.c1") },
                    { key: "c2", label: t("poli.sim.tubosC.c2") },
                  ]}
                  active={tubosKey}
                  label={t("poli.sim.tubosC")}
                  onChange={(k) => {
                    if (k === "none") dispatch({ type: "SET_TUBOS_C", value: 0 });
                    if (k === "c1")
                      dispatch({ type: "SET_TUBOS_C", value: TUBOS_C1_UF });
                    if (k === "c2")
                      dispatch({ type: "SET_TUBOS_C", value: TUBOS_C2_UF });
                  }}
                />
                {tubosKey === "custom" ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t("poli.sim.tubosC.custom")}
                  </p>
                ) : null}
                <SliderField
                  label={t("poli.sim.tubosC")}
                  unit="µF"
                  value={state.tubosC}
                  min={0}
                  max={TUBOS_C_MAX_UF}
                  step={0.1}
                  display={fmt(state.tubosC, 1)}
                  onChange={(v) => dispatch({ type: "SET_TUBOS_C", value: v })}
                />
              </div>
            ) : null}
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold">{t("poli.sim.model.title")}: </span>
              {renderSub(t(`poli.sim.model.${state.load}`))}
            </p>
          </div>
        </Card>

        <Card title={t("poli.sim.grid.title")}>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {t("poli.sim.preset.label")}:
              </span>
              {PRESETS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => dispatch({ type: "PRESET", grid: GRID_PRESETS[k] })}
                  className="rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-blue-400 dark:border-neutral-700 dark:text-neutral-300"
                >
                  {renderSub(t(`poli.sim.preset.${k}`))}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("poli.sim.preset.diaNote")}
            </p>
            <SliderField
              label={t("poli.sim.grid.V1")}
              unit="V"
              value={state.V1}
              min={200}
              max={250}
              step={1}
              onChange={setGrid("V1")}
            />
            <SliderField
              label={t("poli.sim.grid.v3")}
              unit="%"
              value={state.v3}
              min={0}
              max={8}
              step={0.1}
              display={fmt(state.v3, 1)}
              onChange={setGrid("v3")}
            />
            <SliderField
              label={t("poli.sim.grid.v5")}
              unit="%"
              value={state.v5}
              min={0}
              max={8}
              step={0.1}
              display={fmt(state.v5, 1)}
              onChange={setGrid("v5")}
            />
            <SliderField
              label={t("poli.sim.grid.v7")}
              unit="%"
              value={state.v7}
              min={0}
              max={8}
              step={0.1}
              display={fmt(state.v7, 1)}
              onChange={setGrid("v7")}
            />
            <SliderField
              label={t("poli.sim.grid.theta")}
              unit="°"
              value={state.theta}
              min={-180}
              max={180}
              step={5}
              onChange={setGrid("theta")}
            />
          </div>
        </Card>
        </div>
      </div>

      <Card title={t("poli.sim.circuit.title")}>
        <BancoSchematic
          load={state.load}
          connection={connection}
          tubosC={state.tubosC}
          iPhase={p.Irms}
          iNeutral={n.Irms}
        />
      </Card>

      <Card>
        <MetricsGrid metrics={metrics} />
      </Card>

      <Card title={t("poli.sim.cmp.title")}>
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">
          {t("poli.sim.cmp.desc")}
        </p>
        {cmpRows && ref ? (
          <>
            <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
              {t("poli.sim.cmp.ref")}: {t(`poli.ens.${ref.id}.name`)} (
              <span className="font-mono">{ref.id}</span>)
            </p>
            <DataTable
              columns={[
                { label: "" },
                { label: t("poli.sim.cmp.measured") },
                { label: t("poli.sim.cmp.simulated") },
              ]}
              rows={cmpRows}
            />
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {renderSub(t("poli.sim.cmp.note"))}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {renderSub(t("poli.sim.cmp.thdNote"))}
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("poli.sim.cmp.none")}
          </p>
        )}
      </Card>

      <Card title={t("poli.sim.limits.title")}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          <li>{renderSub(t("poli.sim.limits.item1"))}</li>
          <li>{renderSub(t("poli.sim.limits.item2"))}</li>
          <li>{renderSub(t("poli.sim.limits.item3"))}</li>
          <li>{renderSub(t("poli.sim.limits.item4"))}</li>
        </ul>
      </Card>
    </main>
  );
}
