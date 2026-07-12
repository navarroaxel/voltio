"use client";

import { renderSub } from "@/components/ui/Sub";

interface Tab<T extends string> {
  key: T;
  label: string;
}

interface ChartTabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (key: T) => void;
}

export function ChartTabs<T extends string>({
  tabs,
  active,
  onChange,
}: ChartTabsProps<T>) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={
            active === tab.key
              ? "rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
              : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          }
        >
          {renderSub(tab.label)}
        </button>
      ))}
    </div>
  );
}
