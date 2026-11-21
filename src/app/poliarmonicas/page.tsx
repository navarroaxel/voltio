"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/i18n/LanguageContext";
import { renderSub } from "@/components/ui/Sub";

const OBJETIVOS_KEYS = [
  "poli.theory.objectives.item1",
  "poli.theory.objectives.item2",
];
const SUMMARY_KEYS = [
  "poli.theory.summary.p1",
  "poli.theory.summary.p2",
  "poli.theory.summary.p3",
  "poli.theory.summary.p4",
  "poli.theory.summary.p5",
  "poli.theory.summary.p6",
];
const MATERIAL_KEYS = [
  "poli.theory.material.item1",
  "poli.theory.material.item2",
  "poli.theory.material.item3",
];
const LIMITS_KEYS = [
  "poli.theory.limits.item1",
  "poli.theory.limits.item2",
  "poli.theory.limits.item3",
];

export default function PoliarmonicasHub() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("poli.theory.badge")}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {t("poli.theory.title")}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          {t("poli.theory.intro")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/poliarmonicas/ensayos"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
        >
          <h2 className="text-lg font-semibold">
            {t("poli.theory.nav.ens.title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {t("poli.theory.nav.ens.desc")}
          </p>
        </Link>
        <Link
          href="/poliarmonicas/simulador"
          className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
        >
          <h2 className="text-lg font-semibold">
            {t("poli.theory.nav.sim.title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {t("poli.theory.nav.sim.desc")}
          </p>
        </Link>
      </div>

      <Card title={t("poli.theory.objectives.title")}>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {OBJETIVOS_KEYS.map((key) => (
            <li key={key}>{renderSub(t(key))}</li>
          ))}
        </ol>
      </Card>

      <Card title={t("poli.theory.summary.title")}>
        <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          {SUMMARY_KEYS.map((key) => (
            <p key={key}>{renderSub(t(key))}</p>
          ))}
        </div>
      </Card>

      <Card title={t("poli.theory.material.title")}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {MATERIAL_KEYS.map((key) => (
            <li key={key}>{renderSub(t(key))}</li>
          ))}
        </ul>
      </Card>

      <Card title={t("poli.theory.limits.title")}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {LIMITS_KEYS.map((key) => (
            <li key={key}>{renderSub(t(key))}</li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
