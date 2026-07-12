"use client";

import { Card } from "@/components/ui/Card";
import { calcRLC, resonantF } from "@/lib/rlc-engine";
import {
  PART_B,
  PART_B_BASE,
  PART_B_RESONANCE,
  UF,
} from "@/lib/measured-data";
import { fmt } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";

const f0 = resonantF(PART_B.L, PART_B.C * UF);
const r50 = calcRLC({ ...PART_B_BASE, f: 50 }); // at 50 Hz (hypothetical)
const rz = PART_B_RESONANCE; // measured resonance (Part B)

function QA({
  letter,
  question,
  children,
}: {
  letter: string;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {letter}
        </span>
        <div className="space-y-2">
          <h2 className="font-semibold text-neutral-800 dark:text-neutral-100">
            {question}
          </h2>
          <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-blue-600 tabular-nums dark:text-blue-400">
      {children}
    </span>
  );
}

export default function CuestionarioPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("quiz.title")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {t("quiz.heading")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {t("quiz.intro.p1")} {fmt(rz.f, 0)} {t("quiz.intro.p2")}
        </p>
      </header>

      <QA letter="a" question={t("quiz.q1.question")}>
        <p>
          {t("quiz.q1.p1")} <strong>{t("quiz.q1.strong1")}</strong>{" "}
          {t("quiz.q1.p2")} <strong>{t("quiz.q1.strong2")}</strong>{" "}
          {t("quiz.q1.p3")} <strong>{t("quiz.q1.strong3")}</strong>{" "}
          {t("quiz.q1.p4")} <strong>{t("quiz.q1.strong4")}</strong>{" "}
          {t("quiz.q1.p5")}
        </p>
      </QA>

      <QA letter="b" question={t("quiz.q2.question")}>
        <p>
          {t("quiz.q2.p1a")}{" "}
          <Num>
            X<sub>L</sub> = X<sub>C</sub>
          </Num>
          {t("quiz.q2.p1b")}{" "}
          <Num>
            U<sub>L</sub> = {fmt(rz.UL, 2)} V
          </Num>{" "}
          {t("quiz.q2.p1c")}{" "}
          <Num>
            U<sub>C</sub> = {fmt(rz.UC, 2)} V
          </Num>
          {t("quiz.q2.p1d")}
          <Num>{fmt(rz.U, 1)} V</Num>
          {t("quiz.q2.p1e")}{" "}
          <Num>
            Q = U<sub>L</sub>/U ≈ {fmt(rz.UL / rz.U, 1)}
          </Num>
          {t("quiz.q2.p1f")}
        </p>
        <p>
          <strong>{t("quiz.q2.strong1")}</strong> {t("quiz.q2.p2a")}{" "}
          <Num>
            Q = U<sub>C</sub>/U<sub>RS</sub> ≈ {fmt(rz.UC / rz.URS, 1)}
          </Num>
          {t("quiz.q2.p2b")}
          {fmt(rz.UL / rz.U, 1)}) {t("quiz.q2.p2c")}{" "}
          <strong>{t("quiz.q2.strong2")}</strong>
          <sub>L</sub> <strong>{t("quiz.q2.strong3")}</strong>
          {t("quiz.q2.p2d")}{" "}
          <Num>
            U − U<sub>RS</sub> ≈ {fmt(rz.U - rz.URS, 2)} V
          </Num>{" "}
          {t("quiz.q2.p2e")}{" "}
          <Num>Q ≈ {fmt(rz.UL / rz.U, 0)}</Num>
          {t("quiz.q2.p2f")}
        </p>
      </QA>

      <QA letter="c" question={t("quiz.q3.question")}>
        <p>
          {t("quiz.q3.p1")}{" "}
          <Num>
            X<sub>L</sub> = X<sub>C</sub>
          </Num>
          {t("quiz.q3.p2")} <Num>cos φ = 1</Num> {t("quiz.q3.p3")}{" "}
          <Num>φ = 0°</Num>
          {t("quiz.q3.p4")}
        </p>
        <p>
          <strong>{t("quiz.q3.strongActive")}</strong> {t("quiz.q3.p5")}{" "}
          <Num>
            P = U·I = I²(R + R<sub>L</sub>)
          </Num>
          {t("quiz.q3.p6")}
        </p>
        <p>
          <strong>{t("quiz.q3.strongReactive")}</strong> {t("quiz.q3.p7")}{" "}
          <Num>
            Q<sub>L</sub> = U<sub>L</sub>·I
          </Num>
          ,{" "}
          <Num>
            Q<sub>C</sub> = U<sub>C</sub>·I
          </Num>
          {t("quiz.q3.p8")}{" "}
          <Num>
            U<sub>L</sub> = {fmt(rz.UL, 2)} V ≈ U<sub>C</sub> = {fmt(rz.UC, 2)}{" "}
            V
          </Num>
          {t("quiz.q3.p9")}
        </p>
      </QA>

      <QA letter="d" question={t("quiz.q4.question")}>
        <p>
          {t("quiz.q4.p1")}
          {rz.n}
          {t("quiz.q4.p2")}
          {fmt(rz.f, 0)} {t("quiz.q4.p3")} <strong>{t("quiz.q4.strong1")}</strong>{" "}
          {t("quiz.q4.p4")} <strong>{t("quiz.q4.strong2")}</strong>
          {t("quiz.q4.p5")}
          <Num>
            U<sub>RS</sub> = {fmt(rz.URS, 3)} V
          </Num>
          {t("quiz.q4.p6")}{" "}
          <Num>
            I = U<sub>RS</sub>/R
          </Num>
          {t("quiz.q4.p7")}
        </p>
      </QA>

      <QA letter="e" question={t("quiz.q5.question")}>
        <p>
          {t("quiz.q5.p1")}{" "}
          <strong>{t("quiz.q5.strong1")}</strong> {t("quiz.q5.p2")}
          {fmt(f0, 0)} {t("quiz.q5.p3")} <strong>{t("quiz.q5.strong2")}</strong>
          {t("quiz.q5.p4")}{" "}
          <Num>
            X<sub>C</sub> = {fmt(r50.XC, 0)} Ω
          </Num>{" "}
          {t("quiz.q5.p5")}{" "}
          <Num>
            X<sub>L</sub> = {fmt(r50.XL, 0)} Ω
          </Num>
          {t("quiz.q5.p6")}
          <Num>Z = {fmt(r50.Z, 0)} Ω</Num>
          {t("quiz.q5.p7")}
          <Num>I = {fmt(r50.I * 1000, 3)} mA</Num>
          {t("quiz.q5.p8")}{" "}
          <Num>φ = {fmt(r50.phiDeg, 1)}°</Num>{" "}
          {t("quiz.q5.p9")}
        </p>
      </QA>
    </main>
  );
}
