"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

type Theme = "light" | "dark";

interface State {
  theme: Theme;
}

type Action = { type: "TOGGLE_THEME" } | { type: "SET_THEME"; theme: Theme };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_THEME":
      return { theme: state.theme === "dark" ? "light" : "dark" };
    case "SET_THEME":
      return { theme: action.theme };
  }
}

const UIContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function initTheme(): State {
  // The inline script in <head> already applied the .dark class based on localStorage / OS.
  if (typeof document !== "undefined") {
    return {
      theme: document.documentElement.classList.contains("dark")
        ? "dark"
        : "light",
    };
  }
  return { theme: "light" };
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    try {
      localStorage.setItem("theme", state.theme);
    } catch {
      // localStorage not available — ignore
    }
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}
