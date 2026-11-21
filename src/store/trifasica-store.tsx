"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactiveKind } from "@/lib/three-phase-engine";
import { R_FASE, X_BANCO } from "@/lib/trifasica-data";

/** State of the TP3 simulator: which star-load configuration is solved. */
export interface State {
  neutral: boolean;
  reactive: ReactiveKind;
  /** |X| of the element in phase S [Ω]. */
  X: number;
  /** Resistance per phase [Ω]. */
  R: number;
  /** "ensayo": 221/221/224 V as in the lab; "sym": 3 × 221 V. */
  net: "ensayo" | "sym";
}

type Action =
  | { type: "SET_NEUTRAL"; value: boolean }
  | { type: "SET_REACTIVE"; value: ReactiveKind }
  | { type: "SET_X"; value: number }
  | { type: "SET_R"; value: number }
  | { type: "SET_NET"; value: State["net"] }
  | { type: "PRESET_EQUIL" }
  | { type: "PRESET_BANCO" };

const INITIAL: State = {
  neutral: false,
  reactive: "capacitor",
  X: X_BANCO,
  R: R_FASE,
  net: "ensayo",
};

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "SET_NEUTRAL":
      return { ...state, neutral: a.value };
    case "SET_REACTIVE":
      return { ...state, reactive: a.value };
    case "SET_X":
      return { ...state, X: a.value };
    case "SET_R":
      return { ...state, R: a.value };
    case "SET_NET":
      return { ...state, net: a.value };
    case "PRESET_EQUIL":
      return { ...state, reactive: "none", R: R_FASE, net: "ensayo" };
    case "PRESET_BANCO":
      return { ...state, reactive: "capacitor", X: X_BANCO, R: R_FASE, net: "ensayo" };
  }
}

interface Ctx {
  state: State;
  dispatch: React.Dispatch<Action>;
}
const TrifasicaContext = createContext<Ctx | null>(null);

export function TrifasicaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <TrifasicaContext.Provider value={value}>{children}</TrifasicaContext.Provider>;
}

export function useTrifasica() {
  const ctx = useContext(TrifasicaContext);
  if (!ctx) throw new Error("useTrifasica must be used inside TrifasicaProvider");
  return ctx;
}
