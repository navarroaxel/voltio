"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/i18n/LanguageContext";
import { TRANSFORMER_NAMEPLATE } from "@/lib/transformer-data";

const OBJETIVOS_KEYS = [
  "acopl.theory.objectives.item1",
  "acopl.theory.objectives.item2",
  "acopl.theory.objectives.item3",
  "acopl.theory.objectives.item4",
];

const MATERIAL_KEYS = [
  "acopl.theory.material.item1",
  "acopl.theory.material.item2",
  "acopl.theory.material.item3",
  "acopl.theory.material.item4",
  "acopl.theory.material.item5",
  "acopl.theory.material.item6",
];

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.95em] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
      {children}
    </code>
  );
}

export default function CircuitosAcopladosHub() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("acopl.theory.badge")}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {t("acopl.theory.title")}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          {t("acopl.theory.intro")}
        </p>
      </header>

      <Card title={t("acopl.theory.objectives.title")}>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {OBJETIVOS_KEYS.map((key, i) => (
            <li key={i}>{t(key)}</li>
          ))}
        </ol>
      </Card>

      <Card title={t("acopl.theory.summary.title")}>
        <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          <p>{t("acopl.theory.summary.p1")}</p>
          <p>{t("acopl.theory.summary.p2")}</p>
          <p>
            {t("acopl.theory.summary.p3")}{" "}
            <Formula>K = M/√(L₁·L₂)</Formula>
          </p>
          <p>{t("acopl.theory.summary.p4")}</p>
        </div>
      </Card>

      <Card title={t("acopl.theory.material.title")}>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {MATERIAL_KEYS.map((key, i) => (
            <li key={i}>{t(key)}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          {TRANSFORMER_NAMEPLATE.brand} · {TRANSFORMER_NAMEPLATE.power} /{" "}
          {TRANSFORMER_NAMEPLATE.primary} – {TRANSFORMER_NAMEPLATE.secondary}{" "}
          – {TRANSFORMER_NAMEPLATE.current}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NavCard
          href="/circuitos-acoplados/part-a"
          tag={t("acopl.theory.nav.partA.tag")}
          title={t("acopl.theory.nav.partA.title")}
          desc={t("acopl.theory.nav.partA.desc")}
        />
        <NavCard
          href="/circuitos-acoplados/part-b"
          tag={t("acopl.theory.nav.partB.tag")}
          title={t("acopl.theory.nav.partB.title")}
          desc={t("acopl.theory.nav.partB.desc")}
        />
      </div>
    </main>
  );
}

function NavCard({
  href,
  tag,
  title,
  desc,
}: {
  href: string;
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
    >
      <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
        {tag}
      </span>
      <h3 className="mt-1 font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        {desc}
      </p>
    </Link>
  );
}
