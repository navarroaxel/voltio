"use client";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/i18n/LanguageContext";
import { renderSub } from "@/components/ui/Sub";

const QA: { q: string; a: string[]; prec?: string[] }[] = [
  { q: "tri.quiz.qa.q", a: ["tri.quiz.qa.a1", "tri.quiz.qa.a2", "tri.quiz.qa.a3"] },
  { q: "tri.quiz.qb.q", a: ["tri.quiz.qb.a1", "tri.quiz.qb.a2", "tri.quiz.qb.a3"] },
  { q: "tri.quiz.qc.q", a: ["tri.quiz.qc.a1", "tri.quiz.qc.a2"] },
  {
    q: "tri.quiz.qd.q",
    a: ["tri.quiz.qd.a1", "tri.quiz.qd.a2"],
    prec: [
      "tri.quiz.qd.prec1",
      "tri.quiz.qd.prec2",
      "tri.quiz.qd.prec3",
      "tri.quiz.qd.prec4",
    ],
  },
];

export default function CuestionarioPage() {
  const { t } = useLanguage();
  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("tri.quiz.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{t("tri.quiz.title")}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t("tri.quiz.intro")}</p>
      </header>
      {QA.map((item) => (
        <Card key={item.q} title={renderSub(t(item.q))}>
          <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
            {item.a.map((k) => (
              <p key={k}>{renderSub(t(k))}</p>
            ))}
            {item.prec ? (
              <>
                <h3 className="font-semibold">{t("tri.quiz.qd.prec.title")}</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {item.prec.map((k) => (
                    <li key={k}>{renderSub(t(k))}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </Card>
      ))}
    </main>
  );
}
