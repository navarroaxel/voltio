"use client";

import { Card } from "@/components/ui/Card";
import { TransformerSchematic } from "@/components/sim/TransformerSchematic";
import { NumberField } from "@/components/sim/NumberField";
import { useCircuitosB, num, type Method } from "@/store/circuitos-b-store";
import { homologousByCurrent, homologousByVoltage } from "@/lib/transformer-engine";
import { fmt } from "@/lib/format";
import { useLanguage } from "@/i18n/LanguageContext";

const METHODS: { key: Method; labelKey: string }[] = [
  { key: "dc", labelKey: "acopl.partb.method.dc" },
  { key: "ac-ammeter", labelKey: "acopl.partb.method.acAmmeter" },
  { key: "ac-voltmeter", labelKey: "acopl.partb.method.acVoltmeter" },
];

export default function PartBPage() {
  const { t } = useLanguage();
  const { state, dispatch } = useCircuitosB();

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          {t("acopl.partb.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {t("acopl.partb.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {t("acopl.partb.intro")}
        </p>
      </header>

      <div className="inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => dispatch({ type: "SET_METHOD", method: m.key })}
            className={
              state.method === m.key
                ? "rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm dark:bg-neutral-700"
                : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400"
            }
          >
            {t(m.labelKey)}
          </button>
        ))}
      </div>

      {state.method === "dc" && <DCMethod />}
      {state.method === "ac-ammeter" && <ACAmmeterMethod />}
      {state.method === "ac-voltmeter" && <ACVoltmeterMethod />}
    </main>
  );
}

function DCMethod() {
  const { t } = useLanguage();
  const { state, dispatch } = useCircuitosB();

  return (
    <Card title={t("acopl.partb.dc.title")}>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {t("acopl.partb.dc.desc")}
      </p>
      <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        {t("acopl.partb.dc.rule")}
      </div>
      <div className="mt-4">
        <TransformerSchematic variant="dc" />
      </div>

      <p className="mt-4 text-sm font-medium">{t("acopl.partb.dc.question")}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_DC_DEFLECTS", value: true })}
          className={
            state.dcDeflectsForward === true
              ? "rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
              : "rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          }
        >
          {t("acopl.partb.dc.yes")}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_DC_DEFLECTS", value: false })}
          className={
            state.dcDeflectsForward === false
              ? "rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
              : "rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          }
        >
          {t("acopl.partb.dc.no")}
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        {state.dcDeflectsForward === null
          ? t("acopl.partb.dc.pending")
          : state.dcDeflectsForward
            ? t("acopl.partb.dc.resultYes")
            : t("acopl.partb.dc.resultNo")}
      </div>
    </Card>
  );
}

function ACAmmeterMethod() {
  const { t } = useLanguage();
  const { state, dispatch } = useCircuitosB();
  const set = (field: "I2I" | "UI" | "I2II" | "UII") => (value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  const I2I = num(state.I2I);
  const I2II = num(state.I2II);
  const { homologous } = homologousByCurrent(I2I, I2II);

  return (
    <Card title={t("acopl.partb.acAmmeter.title")}>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {t("acopl.partb.acAmmeter.desc")}
      </p>
      <div className="mt-3 space-y-1 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <p>{t("acopl.partb.acAmmeter.case1")}</p>
        <p>{t("acopl.partb.acAmmeter.case2")}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">
            {t("acopl.common.connection")} I
          </h3>
          <TransformerSchematic variant="ac-ammeter-I" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <NumberField label="I_2I" unit="A" value={state.I2I} onChange={set("I2I")} />
            <NumberField label="U_I" unit="V" value={state.UI} onChange={set("UI")} />
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">
            {t("acopl.common.connection")} II
          </h3>
          <TransformerSchematic variant="ac-ammeter-II" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <NumberField label="I_2II" unit="A" value={state.I2II} onChange={set("I2II")} />
            <NumberField label="U_II" unit="V" value={state.UII} onChange={set("UII")} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        {homologous === null ? (
          I2I > 0 && I2II > 0
            ? t("acopl.partb.acAmmeter.tie")
            : t("acopl.partb.acAmmeter.pending")
        ) : (
          <>
            {t("acopl.partb.acAmmeter.result.prefix")}{" "}
            <strong>
              {t("acopl.common.connection")} {homologous}
            </strong>{" "}
            ({fmt(I2I, 3)} A vs {fmt(I2II, 3)} A).
          </>
        )}
      </div>
    </Card>
  );
}

function ACVoltmeterMethod() {
  const { t } = useLanguage();
  const { state, dispatch } = useCircuitosB();
  const set =
    (
      field:
        | "connI_U1"
        | "connI_U2"
        | "connI_U3"
        | "connII_U1"
        | "connII_U2"
        | "connII_U3",
    ) =>
    (value: string) =>
      dispatch({ type: "SET_FIELD", field, value });

  const connI = homologousByVoltage(
    num(state.connI_U1),
    num(state.connI_U2),
    num(state.connI_U3),
  );
  const connII = homologousByVoltage(
    num(state.connII_U1),
    num(state.connII_U2),
    num(state.connII_U3),
  );

  return (
    <Card title={t("acopl.partb.acVoltmeter.title")}>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {t("acopl.partb.acVoltmeter.desc")}
      </p>
      <div className="mt-3 space-y-1 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <p>{t("acopl.partb.acVoltmeter.case1")}</p>
        <p>{t("acopl.partb.acVoltmeter.case2")}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ConnectionBlock
          title={`${t("acopl.common.connection")} I`}
          variant="ac-voltmeter-I"
          u1={state.connI_U1}
          u2={state.connI_U2}
          u3={state.connI_U3}
          onU1={set("connI_U1")}
          onU2={set("connI_U2")}
          onU3={set("connI_U3")}
          result={connI}
        />
        <ConnectionBlock
          title={`${t("acopl.common.connection")} II`}
          variant="ac-voltmeter-II"
          u1={state.connII_U1}
          u2={state.connII_U2}
          u3={state.connII_U3}
          onU1={set("connII_U1")}
          onU2={set("connII_U2")}
          onU3={set("connII_U3")}
          result={connII}
        />
      </div>
    </Card>
  );
}

function ConnectionBlock({
  title,
  variant,
  u1,
  u2,
  u3,
  onU1,
  onU2,
  onU3,
  result,
}: {
  title: string;
  variant: "ac-voltmeter-I" | "ac-voltmeter-II";
  u1: string;
  u2: string;
  u3: string;
  onU1: (v: string) => void;
  onU2: (v: string) => void;
  onU3: (v: string) => void;
  result: ReturnType<typeof homologousByVoltage>;
}) {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <TransformerSchematic variant={variant} />
      <div className="mt-3 grid grid-cols-3 gap-3">
        <NumberField label="U₁" unit="V" value={u1} onChange={onU1} />
        <NumberField label="U₂" unit="V" value={u2} onChange={onU2} />
        <NumberField label="U₃" unit="V" value={u3} onChange={onU3} />
      </div>
      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        {result.homologous === null ? (
          t("acopl.partb.acVoltmeter.pending")
        ) : (
          <>
            {result.homologous
              ? t("acopl.partb.acVoltmeter.result.homologous")
              : t("acopl.partb.acVoltmeter.result.notHomologous")}{" "}
            (|U₁−U₂| = {fmt(result.diff, 1)} V, U₁+U₂ = {fmt(result.sum, 1)} V)
          </>
        )}
      </div>
    </div>
  );
}
