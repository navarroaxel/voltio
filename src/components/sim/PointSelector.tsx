"use client";

interface PointSelectorProps {
  count: number;
  index: number;
  onChange: (index: number) => void;
  label: string; // text for the current point
  hint?: string; // auxiliary description
}

export function PointSelector({
  count,
  index,
  onChange,
  label,
  hint,
}: PointSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {label}
        </span>
        {hint ? (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, index - 1))}
          disabled={index === 0}
          aria-label="Punto anterior"
          className="rounded-lg border border-neutral-300 px-2.5 py-1 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          ←
        </button>
        <input
          type="range"
          min={0}
          max={count - 1}
          value={index}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer accent-blue-600"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(count - 1, index + 1))}
          disabled={index === count - 1}
          aria-label="Punto siguiente"
          className="rounded-lg border border-neutral-300 px-2.5 py-1 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          →
        </button>
      </div>
    </div>
  );
}
