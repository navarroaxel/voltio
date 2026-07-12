"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { resonantF } from "@/lib/rlc-engine";
import { PART_B, UF } from "@/lib/measured-data";

/** Theoretical resonant frequency for Part B (≈ 509 Hz). */
export const PART_B_F0 = resonantF(PART_B.L, PART_B.C * UF);

export type ChartTab = "voltages" | "iz" | "pq";

interface State {
  fIndex: number; // index in PART_B_MEASURED
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
  fIndex: 5, // row 6: f = 509 Hz (resonance)
  chartTab: "voltages",
};

const PartBContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function PartBProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <PartBContext.Provider value={value}>{children}</PartBContext.Provider>
  );
}

export function usePartB() {
  const ctx = useContext(PartBContext);
  if (!ctx) throw new Error("usePartB must be used inside PartBProvider");
  return ctx;
}
