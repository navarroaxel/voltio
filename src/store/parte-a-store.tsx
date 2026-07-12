"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { resonantF } from "@/lib/rlc-engine";
import { PARTE_A_BASE, PARTE_A_C_PRIMERO, UF } from "@/lib/measured-data";

/** Frecuencia de resonancia para el primer C de la tabla (63 µF) — punto 6c. */
export const PARTE_A_F0 = resonantF(PARTE_A_BASE.L, PARTE_A_C_PRIMERO * UF);

/**
 * 11 frecuencias para el barrido del punto 6d: f0 en el centro, 5 por debajo y
 * 5 por encima, con paso Δf = 15 Hz (tabla de la pág. 9 del enunciado).
 */
export const PARTE_A_FREQS: number[] = Array.from(
  { length: 11 },
  (_, i) => PARTE_A_F0 + (i - 5) * 15,
);
/** Índice de f0 dentro de PARTE_A_FREQS (el del medio). */
export const PARTE_A_F0_INDEX = 5;

export type ViewMode = "barridoC" | "barridoF";
export type ChartTab = "tensiones" | "iz" | "pq";

interface State {
  viewMode: ViewMode;
  cIndex: number; // índice en PARTE_A_MEDIDO
  fIndex: number; // índice en PARTE_A_FREQS
  chartTab: ChartTab;
}

type Action =
  | { type: "SET_VIEW"; viewMode: ViewMode }
  | { type: "SET_C_INDEX"; index: number }
  | { type: "SET_F_INDEX"; index: number }
  | { type: "SET_TAB"; tab: ChartTab };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, viewMode: action.viewMode };
    case "SET_C_INDEX":
      return { ...state, cIndex: action.index };
    case "SET_F_INDEX":
      return { ...state, fIndex: action.index };
    case "SET_TAB":
      return { ...state, chartTab: action.tab };
  }
}

const INITIAL: State = {
  viewMode: "barridoC",
  cIndex: 0,
  fIndex: PARTE_A_F0_INDEX,
  chartTab: "tensiones",
};

const ParteAContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ParteAProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <ParteAContext.Provider value={value}>{children}</ParteAContext.Provider>
  );
}

export function useParteA() {
  const ctx = useContext(ParteAContext);
  if (!ctx) throw new Error("useParteA debe usarse dentro de ParteAProvider");
  return ctx;
}
