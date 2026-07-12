"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { resonantF } from "@/lib/rlc-engine";
import { PART_A_BASE, PART_A_FIRST_C, UF } from "@/lib/measured-data";

/** Resonant frequency for the table's first C (63 µF) — point 6c. */
export const PART_A_F0 = resonantF(PART_A_BASE.L, PART_A_FIRST_C * UF);

/**
 * 11 frequencies for point 6d's sweep: f0 in the center, 5 below and
 * 5 above, with step Δf = 15 Hz (table on p. 9 of the assignment sheet).
 */
export const PART_A_FREQS: number[] = Array.from(
  { length: 11 },
  (_, i) => PART_A_F0 + (i - 5) * 15,
);
/** Index of f0 within PART_A_FREQS (the middle one). */
export const PART_A_F0_INDEX = 5;

export type ViewMode = "sweepC" | "sweepF";
export type ChartTab = "voltages" | "iz" | "pq";

interface State {
  viewMode: ViewMode;
  cIndex: number; // index in PART_A_MEASURED
  fIndex: number; // index in PART_A_FREQS
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
  viewMode: "sweepC",
  cIndex: 0,
  fIndex: PART_A_F0_INDEX,
  chartTab: "voltages",
};

const PartAContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function PartAProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <PartAContext.Provider value={value}>{children}</PartAContext.Provider>
  );
}

export function usePartA() {
  const ctx = useContext(PartAContext);
  if (!ctx) throw new Error("usePartA must be used inside PartAProvider");
  return ctx;
}
