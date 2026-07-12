"use client";

import { useRef } from "react";
import { renderSub } from "@/components/ui/Sub";

interface Tab<T extends string> {
  key: T;
  label: string;
}

interface ChartTabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (key: T) => void;
  /** Accessible name for the tablist (e.g. "Gráficos"). */
  label?: string;
  /**
   * Maps a tab key to the DOM id of its panel. When provided, each tab gets
   * `aria-controls` and a stable `id` so screen readers link tab↔panel; the
   * panel should set `role="tabpanel"`, `id={getPanelId(key)}` and
   * `aria-labelledby={getTabId(key)}` where getTabId(key) === `${getPanelId(key)}-tab`.
   */
  getPanelId?: (key: T) => string;
}

export function ChartTabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
  getPanelId,
}: ChartTabsProps<T>) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const i = (index + tabs.length) % tabs.length;
    const tab = tabs[i];
    if (!tab) return;
    onChange(tab.key);
    btnRefs.current[i]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800"
    >
      {tabs.map((tab, index) => {
        const isActive = active === tab.key;
        const panelId = getPanelId?.(tab.key);
        return (
          <button
            key={tab.key}
            ref={(el) => {
              btnRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={panelId ? `${panelId}-tab` : undefined}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={
              isActive
                ? "rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            }
          >
            {renderSub(tab.label)}
          </button>
        );
      })}
    </div>
  );
}
