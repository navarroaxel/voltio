"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

/**
 * Live readings for TP2 Part A (determinación de parámetros). The
 * assignment leaves every cell blank — there is no lab data yet — so the
 * student fills them in here instead of picking a row from a fixed table
 * (contrast with TP1's PartA/PartB stores, which index into measured rows).
 */
export interface State {
  // Conexión I: primary excited at nominal voltage.
  U1: string;
  I10: string;
  U20: string;
  // Conexión II: secondary excited at nominal voltage.
  U2: string;
  I20: string;
  U10: string;
}

type Field = keyof State;

type Action = { type: "SET_FIELD"; field: Field; value: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
  }
}

const INITIAL: State = {
  U1: "",
  I10: "",
  U20: "",
  U2: "",
  I20: "",
  U10: "",
};

const CircuitosAContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function CircuitosAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <CircuitosAContext.Provider value={value}>
      {children}
    </CircuitosAContext.Provider>
  );
}

export function useCircuitosA() {
  const ctx = useContext(CircuitosAContext);
  if (!ctx)
    throw new Error("useCircuitosA must be used inside CircuitosAProvider");
  return ctx;
}

/** Parses a field, returning 0 for blank/invalid input (never NaN). */
export function num(value: string): number {
  const n = parseFloat(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
