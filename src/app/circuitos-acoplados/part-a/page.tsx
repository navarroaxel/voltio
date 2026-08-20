"use client";

import { Card } from "@/components/ui/Card";
import { TransformerSchematic } from "@/components/sim/TransformerSchematic";
import { MetricsGrid, type Metric } from "@/components/sim/MetricsGrid";
import { NumberField } from "@/components/sim/NumberField";
import { useCircuitosA, num } from "@/store/circuitos-a-store";
import { calcTransformerParams } from "@/lib/transformer-engine";
import { F_LINEA } from "@/lib/transformer-data";
import { fmt } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";

export default function PartAPage() {
  const { t } = useLanguage();
  const { state, dispatch } = useCircuitosA();

  const set = (field: keyof typeof state) => (value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  const U1 = num(state.U1);
  const I10 = num(state.I10);
  const U20 = num(state.U20);
  const U2 = num(state.U2);
  const I20 = num(state.I20);
  const U10 = num(state.U10);

  const result = calcTransformerParams({
    U1,
    I10,
    U20,
    U2,
    I20,
    U10,
    f: F_LINEA,
  });

  const hasReadings = I10 > 0 && I20 > 0 && U1 > 0 && U2 > 0;

  const metrics: Metric[] = [
    { label: "L1", value: fmt(result.L1 * 1000, 2), unit: "mH", accent: "blue" },
    { label: "L2", value: fmt(result.L2 * 1000, 2), unit: "mH", accent: "red" },
    { label: "M12", value: fmt(result.M12 * 1000, 2), unit: "mH", accent: "violet" },
    { label: "M21", value: fmt(result.M21 * 1000, 2), unit: "mH", accent: "violet" },
    { label: "K", value: fmt(result.K, 3), accent: "amber" },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("acopl.parta.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {t("acopl.parta.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {t("acopl.parta.intro")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title={t("acopl.parta.connI.title")}>
          <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">
            {t("acopl.parta.connI.desc")}
          </p>
          <TransformerSchematic variant="parteA-I" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <NumberField label="U₁" unit="V" value={state.U1} onChange={set("U1")} />
            <NumberField label="I₁₀" unit="A" value={state.I10} onChange={set("I10")} />
            <NumberField label="U₂₀" unit="V" value={state.U20} onChange={set("U20")} />
          </div>
        </Card>

        <Card title={t("acopl.parta.connII.title")}>
          <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">
            {t("acopl.parta.connII.desc")}
          </p>
          <TransformerSchematic variant="parteA-II" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <NumberField label="U₂" unit="V" value={state.U2} onChange={set("U2")} />
            <NumberField label="I₂₀" unit="A" value={state.I20} onChange={set("I20")} />
            <NumberField label="U₁₀" unit="V" value={state.U10} onChange={set("U10")} />
          </div>
        </Card>
      </div>

      <Card title={t("acopl.parta.results.title")}>
        {hasReadings ? (
          <>
            <MetricsGrid metrics={metrics} />
            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {t("acopl.parta.results.check")}
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("acopl.parta.results.pending")}
          </p>
        )}
      </Card>

      <Card title={t("acopl.parta.card.conclusions")}>
        {hasReadings ? (
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {t("acopl.parta.conclusions.text")}{" "}
            <strong>K = {fmt(result.K, 3)}</strong>
            {" ("}
            {result.K >= 0.95
              ? t("acopl.parta.conclusions.kPerfect")
              : result.K >= 0.7
                ? t("acopl.parta.conclusions.kStrong")
                : t("acopl.parta.conclusions.kWeak")}
            ), {t("acopl.parta.conclusions.with")} M₁₂ ={" "}
            {fmt(result.M12 * 1000, 2)} mH {t("acopl.parta.conclusions.and")}{" "}
            M₂₁ = {fmt(result.M21 * 1000, 2)} mH
            {Math.abs(result.M12 - result.M21) <
            0.05 * Math.max(result.M12, result.M21)
              ? t("acopl.parta.conclusions.mConsistent")
              : t("acopl.parta.conclusions.mInconsistent")}
          </p>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("acopl.parta.conclusions.pending")}
          </p>
        )}
      </Card>
    </main>
  );
}
