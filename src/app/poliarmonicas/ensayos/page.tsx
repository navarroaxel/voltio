"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { ChartTabs } from "@/components/sim/ChartTabs";
import { DataTable } from "@/components/sim/DataTable";
import { MetricsGrid, type Metric } from "@/components/sim/MetricsGrid";
import { fmt } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";
import { renderSub } from "@/components/ui/Sub";
import {
  ENSAYOS,
  ensayoById,
  estimateThd,
  neutralRatio,
  THD_MEASURED,
  type Ensayo,
  type Part,
} from "@/lib/poliarmonicas-data";

const PARTS: Part[] = ["A", "B", "C"];
const CODE_PARTS = ["A", "B", "C"];
const CODE_LOADS = ["H", "T", "DC", "DCV", "DE", "BC", "L", "TC1", "TC2", "TCL"];
const CODE_CONNS = ["M", "B", "T"];
const CONC_KEYS = [1, 2, 3, 4, 5].map((n) => `poli.ens.conc.${n}`);

const orDash = (n: number | null, dec: number) =>
  n === null ? "—" : fmt(n, dec);

function ordinal(n: number, lang: "es" | "en"): string {
  if (lang === "es") return `${n}.ª`;
  const v = n % 100;
  const suffix = v >= 11 && v <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
}

function phasesText(e: Ensayo): string {
  const vals = e.I.filter((x): x is number => x !== null);
  return vals.map((x) => fmt(x, 3)).join(" / ");
}

export default function EnsayosPage() {
  const { t, language } = useLanguage();
  const [part, setPart] = useState<Part>("A");
  const [id, setId] = useState("AHM");

  const inPart = ENSAYOS.filter((e) => e.part === part);
  const selected = ensayoById(id) ?? inPart[0];

  const thd = estimateThd(selected.I[0], selected.I1);
  const meas = THD_MEASURED[selected.id] ?? null;
  const ratio = neutralRatio(selected);
  const rawMetrics: Metric[] = [
    { label: t("poli.ens.read.U"), value: orDash(selected.U, 2), unit: "V", accent: "blue" },
    { label: t("poli.ens.read.I"), value: phasesText(selected), unit: "A", accent: "red" },
    { label: t("poli.ens.read.I1"), value: orDash(selected.I1, 3), unit: "A", accent: "red" },
    { label: t("poli.ens.read.phi"), value: orDash(selected.phiDeg, 0), unit: "°", accent: "violet" },
    { label: t("poli.ens.read.IN"), value: orDash(selected.IN, 3), unit: "A", accent: "amber" },
    { label: t("poli.ens.read.ratio"), value: orDash(ratio, 2), accent: "amber" },
    {
      label: t("poli.ens.read.thd"),
      value: thd === null ? "—" : fmt(thd * 100, 0),
      unit: thd === null ? undefined : "%",
      accent: "green",
    },
    {
      label: t("poli.ens.read.thdMeas"),
      value: meas ? fmt(meas.pct, 1) : "—",
      unit: meas ? "%" : undefined,
      accent: "green",
    },
  ];
  // Sin dato no se muestra la unidad ("—" en lugar de "—A").
  const metrics = rawMetrics.map((m) =>
    m.value === "—" ? { ...m, unit: undefined } : m,
  );

  const rows = ENSAYOS.map((e) => {
    const th = estimateThd(e.I[0], e.I1);
    return [
      <div key={e.id} className="min-w-[13rem] whitespace-normal">
        <div>{t(`poli.ens.${e.id}.name`)}</div>
        <div className="font-mono text-xs font-normal text-neutral-400">
          {e.id}
        </div>
      </div>,
      orDash(e.U, 1),
      fmt(e.I[0], 3),
      orDash(e.I1, 3),
      orDash(e.phiDeg, 0),
      th === null ? "—" : `${fmt(th * 100, 0)} %`,
      THD_MEASURED[e.id] ? `${fmt(THD_MEASURED[e.id].pct, 1)} %` : "—",
      orDash(neutralRatio(e), 2),
    ];
  });

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("poli.ens.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {t("poli.ens.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {t("poli.ens.intro")}
        </p>
      </header>

      <details className="rounded-xl border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <summary className="cursor-pointer font-semibold text-neutral-700 dark:text-neutral-200">
          {t("poli.ens.codes.title")}
        </summary>
        <div className="mt-3 space-y-3 text-neutral-700 dark:text-neutral-300">
          <p>{t("poli.ens.codes.intro")}</p>
          <p className="rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/60">
            {t("poli.ens.codes.example")}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(
              [
                ["part", CODE_PARTS],
                ["load", CODE_LOADS],
                ["conn", CODE_CONNS],
              ] as const
            ).map(([group, codes]) => (
              <div key={group}>
                <h3 className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                  {t(`poli.ens.codes.h.${group}`)}
                </h3>
                <dl className="space-y-1">
                  {codes.map((code) => (
                    <div key={code} className="flex gap-2">
                      <dt className="w-10 shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        {code}
                      </dt>
                      <dd>{t(`poli.ens.codes.${group}.${code}`)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("poli.ens.codes.capture")}
          </p>
        </div>
      </details>

      <div className="space-y-3">
        <ChartTabs
          tabs={PARTS.map((p) => ({ key: p, label: t(`poli.ens.part.${p}`) }))}
          active={part}
          label={t("poli.ens.partLabel")}
          onChange={(p) => {
            setPart(p);
            setId(ENSAYOS.find((e) => e.part === p)!.id);
          }}
        />
        <div
          role="group"
          aria-label={t("poli.ens.pickLabel")}
          className="flex flex-wrap gap-2"
        >
          {inPart.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={e.id === selected.id}
              onClick={() => setId(e.id)}
              className={
                e.id === selected.id
                  ? "rounded-lg border border-blue-500 bg-blue-50 px-3 py-1.5 text-left text-sm font-medium text-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
                  : "rounded-lg border border-neutral-200 px-3 py-1.5 text-left text-sm text-neutral-700 hover:border-blue-300 dark:border-neutral-700 dark:text-neutral-300"
              }
            >
              {t(`poli.ens.${e.id}.name`)}{" "}
              <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                {e.id}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Card title={t(`poli.ens.${selected.id}.name`)}>
        <p className="mb-4 text-sm text-neutral-700 dark:text-neutral-300">
          {renderSub(t(`poli.ens.${selected.id}.desc`))}
        </p>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          {t("poli.ens.readings")}
        </h3>
        <MetricsGrid metrics={metrics} />
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {renderSub(t("poli.ens.phiNote"))} {renderSub(t("poli.ens.thdNote"))}
        </p>
        {meas ? (
          <div className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
            {meas.orders ? (
              <p>
                <span className="font-semibold">{t("poli.ens.orders")}:</span>{" "}
                {meas.orders.map((o) => ordinal(o, language)).join(", ")}
              </p>
            ) : null}
            {meas.note ? (
              <p className="text-amber-700 dark:text-amber-400">
                {t(`poli.ens.thdFlag.${meas.note}`)}
              </p>
            ) : null}
          </div>
        ) : null}
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {renderSub(t("poli.ens.thdMeasNote"))}
        </p>
      </Card>

      <Card title={t("poli.ens.captures")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selected.captures.map((cap) => (
            <figure key={cap.file}>
              <Image
                src={`/poliarmonicas/capturas/${cap.file}.png`}
                alt={`${cap.file} — ${t(`poli.ens.cap.${cap.kind}`)}`}
                width={320}
                height={240}
                className="h-auto w-full rounded-lg border border-neutral-200 dark:border-neutral-700"
              />
              <figcaption className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                <div>{t(`poli.ens.cap.${cap.kind}`)}</div>
                <div className="font-mono text-[11px] text-neutral-400">
                  {cap.file}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Card>

      <Card title={t("poli.ens.summary.title")}>
        <DataTable
          columns={[
            { label: t("poli.ens.col.test") },
            { label: t("poli.ens.col.U"), sub: "V" },
            { label: t("poli.ens.col.I"), sub: "A" },
            { label: t("poli.ens.col.I1"), sub: "A" },
            { label: t("poli.ens.col.phi"), sub: "°" },
            { label: t("poli.ens.col.thd") },
            { label: t("poli.ens.col.thdMeas") },
            { label: t("poli.ens.col.ratio") },
          ]}
          rows={rows}
          highlightRow={ENSAYOS.findIndex((e) => e.id === selected.id)}
          caption={renderSub(t("poli.ens.thdNote"))}
        />
      </Card>

      <Card title={t("poli.ens.conc.title")}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {CONC_KEYS.map((k) => (
            <li key={k}>{renderSub(t(k))}</li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
