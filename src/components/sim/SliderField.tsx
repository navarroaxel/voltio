"use client";

import { useId } from "react";
import { renderSub } from "@/components/ui/Sub";

/** Control deslizante numérico con valor visible (parámetro del simulador). */
export function SliderField({
  label,
  unit,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Texto del valor (con coma decimal); por defecto el número crudo. */
  display?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="text-xs text-neutral-500 dark:text-neutral-400"
        >
          {renderSub(label)}
        </label>
        <span className="text-sm font-medium tabular-nums">
          {display ?? String(value)}
          {unit ? (
            <span className="ml-1 text-xs font-normal text-neutral-500 dark:text-neutral-400">
              {unit}
            </span>
          ) : null}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-blue-600"
      />
    </div>
  );
}
