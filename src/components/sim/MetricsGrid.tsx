import { renderSub } from "@/components/ui/Sub";

export interface Metric {
  label: string;
  value: string;
  unit?: string;
  accent?: "blue" | "red" | "green" | "violet" | "amber" | "none";
}

const ACCENT: Record<NonNullable<Metric["accent"]>, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  red: "text-red-600 dark:text-red-400",
  green: "text-green-600 dark:text-green-400",
  violet: "text-violet-600 dark:text-violet-400",
  amber: "text-amber-600 dark:text-amber-400",
  none: "text-neutral-900 dark:text-neutral-100",
};

export function MetricsGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {renderSub(m.label)}
          </div>
          <div
            className={`text-lg font-semibold tabular-nums ${ACCENT[m.accent ?? "none"]}`}
          >
            {m.value}
            {m.unit ? (
              <span className="ml-1 text-xs font-normal text-neutral-500 dark:text-neutral-400">
                {m.unit}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
