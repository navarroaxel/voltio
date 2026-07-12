"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/i18n/LanguageContext";

const OBJETIVOS_KEYS = [
  "theory.objectives.item1",
  "theory.objectives.item2",
  "theory.objectives.item3",
  "theory.objectives.item4",
  "theory.objectives.item5",
];

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.95em] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
      {children}
    </code>
  );
}

export default function ResonanciaHub() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("theory.badge")}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {t("theory.title")}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          {t("theory.intro")}
        </p>
      </header>

      <Card title={t("theory.objectives.title")}>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {OBJETIVOS_KEYS.map((key, i) => (
            <li key={i}>{t(key)}</li>
          ))}
        </ol>
      </Card>

      <Card title={t("theory.summary.title")}>
        <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          <p>
            {t("theory.summary.p1.part1")}
            <strong>{t("theory.summary.p1.rlcSerie")}</strong>
            {t("theory.summary.p1.part2")}{" "}
            <Formula>
              Z = (R + R<sub>L</sub>) + j(X<sub>L</sub> − X<sub>C</sub>)
            </Formula>
            {t("theory.summary.p1.part3")} <Formula>X<sub>L</sub> = ωL</Formula>{" "}
            {t("theory.summary.p1.part4")}{" "}
            <Formula>X<sub>C</sub> = 1/(ωC)</Formula>. {t("theory.summary.p1.part5")}{" "}
            <Formula>
              φ = arctg((X<sub>L</sub> − X<sub>C</sub>)/(R + R<sub>L</sub>))
            </Formula>
            {t("theory.summary.p1.part6")}
          </p>
          <p>
            {t("theory.summary.p2.part1")}
            <strong>{t("theory.summary.p2.resonancia")}</strong>
            {t("theory.summary.p2.part2")}{" "}
            <Formula>
              X<sub>L</sub> = X<sub>C</sub>
            </Formula>
            {t("theory.summary.p2.part3")}{" "}
            <Formula>f₀ = 1/(2π·√(L·C))</Formula>
            {t("theory.summary.p2.part4")}
          </p>
          <p>
            {t("theory.summary.p3.part1")}{" "}
            <Formula>φ = 0</Formula> {t("theory.summary.p3.part2")}{" "}
            <Formula>cos φ = 1</Formula>
            {t("theory.summary.p3.part3")}
            <strong>{t("theory.summary.p3.factorMerito")}</strong>{" "}
            <Formula>
              Q = (1/(R+R<sub>L</sub>))·√(L/C)
            </Formula>
            {t("theory.summary.p3.part4")}{" "}
            <Formula>
              U<sub>L</sub> = U<sub>C</sub> = Q·U
            </Formula>
            {t("theory.summary.p3.part5")}
          </p>
        </div>
      </Card>

      <Card title={t("theory.procedure.title")}>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          {t("theory.procedure.text")}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NavCard
          href="/resonancia/part-a"
          tag={t("theory.nav.partA.tag")}
          title={t("theory.nav.partA.title")}
          desc={t("theory.nav.partA.desc")}
        />
        <NavCard
          href="/resonancia/part-b"
          tag={t("theory.nav.partB.tag")}
          title={t("theory.nav.partB.title")}
          desc={t("theory.nav.partB.desc")}
        />
        <NavCard
          href="/resonancia/questionnaire"
          tag={t("theory.nav.quiz.tag")}
          title={t("theory.nav.quiz.title")}
          desc={t("theory.nav.quiz.desc")}
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
