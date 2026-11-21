"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChartTabs } from "@/components/sim/ChartTabs";
import { DataTable } from "@/components/sim/DataTable";
import { MetricsGrid, type Metric } from "@/components/sim/MetricsGrid";
import { PhasorDiagram } from "@/components/sim/PhasorDiagram";
import { renderSub } from "@/components/ui/Sub";
import { useLanguage } from "@/i18n/LanguageContext";
import { fmt } from "@/lib/format";
import {
  CASOS,
  casoById,
  R_FASE,
  U_RED,
  X_BANCO,
  type Caso,
  type CasoId,
} from "@/lib/trifasica-data";
import { abs, add, c, polar, solveStar } from "@/lib/three-phase-engine";
import { phasorFromCaso } from "@/lib/trifasica-view";

/** The model run for a measured state (parameters of the report, not tuned). */
function modelFor(caso: Caso) {
  return solveStar({
    U: { ...U_RED },
    R: R_FASE,
    reactive: caso.balanced ? "none" : "capacitor",
    X: X_BANCO,
    neutral: caso.neutral,
  });
}

export default function EnsayosPage() {
  const { t } = useLanguage();
  const [id, setId] = useState<CasoId>("des-sn");
  const caso = casoById(id);
  const model = modelFor(caso);

  const metrics: Metric[] = [
    {
      label: "U_R'/U_S'/U_T'",
      value: caso.U.map((u) => fmt(u, 0)).join(" / "),
      unit: "V",
      accent: "blue",
    },
    {
      label: "I_R/I_S/I_T",
      value: caso.I.map((i) => fmt(i, 2)).join(" / "),
      unit: "A",
      accent: "red",
    },
    caso.neutral
      ? {
          label: t("tri.ens.m.IN"),
          value: caso.IN === 0 ? t("tri.ens.m.approxZero") : fmt(caso.IN ?? NaN, 2),
          unit: "A",
          accent: "amber",
        }
      : {
          label: t("tri.ens.m.UN"),
          value: fmt(caso.UN ?? NaN, 1),
          unit: "V",
          accent: "violet",
        },
    {
      label: "W1 + W2",
      value: `${fmt(caso.W1, 0)} + ${fmt(caso.W2, 0)}`,
      unit: "W",
      accent: "green",
    },
    { label: "W_T", value: fmt(caso.WT, 0), unit: "W", accent: "green" },
  ];

  // Checks computed from the report's own phasors.
  const sumI = caso.phasors.I.map((p) => polar(p.mag, p.deg)).reduce(add, c(0));
  const sumIabs = abs(sumI);
  const p3ui =
    caso.U.reduce((s, u, k) => s + u * caso.I[k], 0); // Σ U_F·I_F, resistive load

  const cmpRows: React.ReactNode[][] = [
    [
      renderSub("U_R' / U_S' / U_T' [V]"),
      caso.U.map((u) => fmt(u, 0)).join(" / "),
      (["R", "S", "T"] as const).map((p) => fmt(abs(model.Uload[p]), 0)).join(" / "),
    ],
    [
      renderSub("I_R / I_S / I_T [A]"),
      caso.I.map((i) => fmt(i, 2)).join(" / "),
      (["R", "S", "T"] as const).map((p) => fmt(abs(model.I[p]), 2)).join(" / "),
    ],
    caso.neutral
      ? [renderSub("I_N [A]"), caso.IN === 0 ? "≈ 0" : fmt(caso.IN ?? NaN, 2), fmt(abs(model.IN), 2)]
      : [renderSub("U_N [V]"), fmt(caso.UN ?? NaN, 1), fmt(abs(model.UN), 1)],
    [renderSub("W_T [W]"), fmt(caso.WT, 0), fmt(model.WT, 0)],
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("tri.ens.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{t("tri.ens.title")}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t("tri.ens.intro")}</p>
      </header>

      <ChartTabs<CasoId>
        tabs={CASOS.map((k) => ({ key: k.id, label: t(`tri.ens.case.${k.id}`) }))}
        active={id}
        label={t("tri.ens.case.label")}
        onChange={setId}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("tri.ens.phasor.title")}>
          <PhasorDiagram data={phasorFromCaso(caso)} />
        </Card>
        <div className="space-y-5">
          <Card title={t("tri.ens.read.title")}>
            <MetricsGrid metrics={metrics} />
          </Card>
          <Card title={t("tri.ens.explain.title")}>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              {renderSub(t(`tri.ens.explain.${caso.id}`))}
            </p>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("tri.ens.cmp.title")}>
          <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
            {t("tri.ens.cmp.intro")}
          </p>
          <DataTable
            columns={[
              { label: t("tri.ens.cmp.quantity") },
              { label: t("tri.ens.cmp.measured") },
              { label: t("tri.ens.cmp.model") },
            ]}
            rows={cmpRows}
          />
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
            {t("tri.ens.cmp.noteP")}
          </p>
        </Card>
        <Card title={t("tri.ens.checks.title")}>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>
              {renderSub(t("tri.ens.checks.sumI"))} <strong>{fmt(sumIabs, 2)} A</strong>
              {caso.neutral ? (
                <>
                  {" "}
                  — {renderSub(t("tri.ens.checks.sumIreported"))}{" "}
                  <strong>
                    {caso.IN === 0 || caso.IN === null ? t("tri.ens.m.approxZero") : fmt(caso.IN, 2)} A
                  </strong>
                  .
                </>
              ) : (
                <> — {t("tri.ens.checks.sumI0")}</>
              )}
            </li>
            {caso.balanced ? (
              <li>
                {t("tri.ens.checks.p3ui")} <strong>{fmt(p3ui, 0)} W</strong> vs{" "}
                <strong>{fmt(caso.WT, 0)} W</strong> ({fmt(((caso.WT - p3ui) / p3ui) * 100, 1)} %).{" "}
                {t("tri.ens.checks.p3uiNote")}
              </li>
            ) : null}
          </ul>
        </Card>
      </div>

      <Card title={t("tri.ens.table.title")}>
        <DataTable
          caption={renderSub(t("tri.ens.table.caption"))}
          highlightRow={CASOS.findIndex((k) => k.id === id)}
          columns={[
            { label: t("tri.ens.table.case") },
            { label: "U_R", sub: "V" },
            { label: "U_S", sub: "V" },
            { label: "U_T", sub: "V" },
            { label: "U_RS", sub: "V" },
            { label: "U_ST", sub: "V" },
            { label: "U_TR", sub: "V" },
            { label: "U_N / I_N", sub: "V / A" },
            { label: "I_R", sub: "A" },
            { label: "I_S", sub: "A" },
            { label: "I_T", sub: "A" },
            { label: "W1", sub: "W" },
            { label: "W2", sub: "W" },
            { label: "W_T", sub: "W" },
          ]}
          rows={CASOS.map((k) => [
            t(`tri.ens.case.${k.id}`),
            ...k.U.map((u) => fmt(u, 0)),
            ...k.Uline.map((u) => fmt(u, 0)),
            k.neutral
              ? k.IN === 0
                ? "≈ 0 A"
                : `${fmt(k.IN ?? NaN, 2)} A`
              : `${fmt(k.UN ?? NaN, 1)} V`,
            ...k.I.map((i) => fmt(i, 2)),
            fmt(k.W1, 0),
            fmt(k.W2, 0),
            fmt(k.WT, 0),
          ])}
        />
      </Card>
    </main>
  );
}
