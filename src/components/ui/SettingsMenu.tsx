"use client";

import { useEffect, useRef, useState } from "react";
import { useUI } from "@/store/ui-store";
import { useLanguage, type Language } from "@/i18n/LanguageContext";

function Segmented({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
      {children}
    </div>
  );
}

function Segment({
  active,
  onClick,
  children,
  suppressHydrationWarning,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  suppressHydrationWarning?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      suppressHydrationWarning={suppressHydrationWarning}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-950 dark:text-blue-400"
          : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}

const SunIcon = (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export function SettingsMenu() {
  const { state, dispatch } = useUI();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const isDark = mounted && state.theme === "dark";

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("common.settings.aria")}
        aria-expanded={open}
        title={t("common.settings.aria")}
        className={`inline-flex items-center justify-center rounded-lg border p-2 transition-colors ${
          open
            ? "border-neutral-300 bg-neutral-100 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
            : "border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        }`}
      >
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900 dark:ring-white/10">
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                {t("common.settings.theme")}
              </p>
              <Segmented>
                <Segment
                  active={!isDark}
                  suppressHydrationWarning
                  onClick={() =>
                    dispatch({ type: "SET_THEME", theme: "light" })
                  }
                >
                  {SunIcon}
                  {t("common.theme.light")}
                </Segment>
                <Segment
                  active={isDark}
                  suppressHydrationWarning
                  onClick={() => dispatch({ type: "SET_THEME", theme: "dark" })}
                >
                  {MoonIcon}
                  {t("common.theme.dark")}
                </Segment>
              </Segmented>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                {t("common.settings.language")}
              </p>
              <Segmented>
                {(["es", "en"] as Language[]).map((v) => (
                  <Segment
                    key={v}
                    active={language === v}
                    onClick={() => setLanguage(v)}
                  >
                    <span className="font-mono">{v.toUpperCase()}</span>
                  </Segment>
                ))}
              </Segmented>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
