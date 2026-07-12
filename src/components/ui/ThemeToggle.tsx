"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/store/ui-store";

export function ThemeToggle() {
  const { state, dispatch } = useUI();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Only after mounting do we avoid the icon's hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = state.theme === "dark";

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "TOGGLE_THEME" })}
      aria-label={
        !mounted
          ? "Cambiar tema"
          : isDark
            ? "Cambiar a modo claro"
            : "Cambiar a modo oscuro"
      }
      className="rounded-lg border border-neutral-300 p-2 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      {/* Avoids hydration mismatch: neutral icon until mounted */}
      {!mounted ? (
        <span className="block h-4 w-4" />
      ) : isDark ? (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
