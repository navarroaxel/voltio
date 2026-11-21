"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/i18n/LanguageContext";
import { renderSub } from "@/components/ui/Sub";

const keys = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);

const NAV = [
  { href: "/trifasica/ensayos", k: "tri.theory.nav.ens" },
  { href: "/trifasica/simulador", k: "tri.theory.nav.sim" },
  { href: "/trifasica/cuestionario", k: "tri.theory.nav.quiz" },
] as const;

export default function TrifasicaHub() {
  const { t } = useLanguage();
  const list = (items: string[]) => (
    <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
      {items.map((k) => (
        <li key={k}>{renderSub(t(k))}</li>
      ))}
    </ul>
  );
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("tri.theory.badge")}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{t("tri.theory.title")}</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">{t("tri.theory.intro")}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
          >
            <h2 className="text-lg font-semibold">{t(`${n.k}.title`)}</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{t(`${n.k}.desc`)}</p>
          </Link>
        ))}
      </div>

      <Card title={t("tri.theory.objectives.title")}>
        {list(keys("tri.theory.objectives.item", 3))}
      </Card>

      <Card title={t("tri.theory.summary.title")}>
        <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          {keys("tri.theory.summary.p", 4).map((k) => (
            <p key={k}>{renderSub(t(k))}</p>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title={t("tri.theory.circuit.title")}>
          {list(keys("tri.theory.circuit.item", 4))}
        </Card>
        <Card title={t("tri.theory.method.title")}>
          {list(keys("tri.theory.method.item", 3))}
        </Card>
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("tri.theory.source")}</p>
    </main>
  );
}
