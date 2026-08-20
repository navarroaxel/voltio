"use client";

import { renderSub } from "@/components/ui/Sub";

/** Editable numeric reading (student-entered lab measurement). */
export function NumberField({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-neutral-500 dark:text-neutral-400">
        {renderSub(label)}
        {unit ? ` (${unit})` : ""}
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "—"}
        className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm tabular-nums outline-none focus:border-blue-400 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-blue-600"
      />
    </label>
  );
}
