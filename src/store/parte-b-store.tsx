"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { resonantF } from "@/lib/rlc-engine";
import { PARTE_B, UF } from "@/lib/measured-data";

/** Frecuencia de resonancia teórica de la Parte B (≈ 509 Hz). */
export const PARTE_B_F0 = resonantF(PARTE_B.L, PARTE_B.C * UF);

export type ChartTab = "tensiones" | "iz" | "pq";

interface State {
  fIndex: number; // índice en PARTE_B_MEDIDO
  chartTab: ChartTab;
}

type Action =
  | { type: "SET_F_INDEX"; index: number }
  | { type: "SET_TAB"; tab: ChartTab };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_F_INDEX":
      return { ...state, fIndex: action.index };
    case "SET_TAB":
      return { ...state, chartTab: action.tab };
  }
}

const INITIAL: State = {
  fIndex: 5, // fila 6: f = 509 Hz (resonancia)
  chartTab: "tensiones",
};

const ParteBContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ParteBProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <ParteBContext.Provider value={value}>{children}</ParteBContext.Provider>
  );
}

export function useParteB() {
  const ctx = useContext(ParteBContext);
  if (!ctx) throw new Error("useParteB debe usarse dentro de ParteBProvider");
  return ctx;
}
