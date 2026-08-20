"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

export type Method = "dc" | "ac-ammeter" | "ac-voltmeter";

/** Live readings for TP2 Part B (determinación de bornes homólogos). */
export interface State {
  method: Method;

  // 5.2.1 — DC method: does the ammeter needle deflect in the reading
  // direction when the switch closes? null = not tested yet.
  dcDeflectsForward: boolean | null;

  // 5.2.2.1 — AC method with ammeter, Conexión I / Conexión II.
  I2I: string;
  UI: string;
  I2II: string;
  UII: string;

  // 5.2.2.2 — AC method with voltmeters, Conexión I / Conexión II.
  connI_U1: string;
  connI_U2: string;
  connI_U3: string;
  connII_U1: string;
  connII_U2: string;
  connII_U3: string;
}

type Field = keyof Omit<State, "method" | "dcDeflectsForward">;

type Action =
  | { type: "SET_METHOD"; method: Method }
  | { type: "SET_DC_DEFLECTS"; value: boolean | null }
  | { type: "SET_FIELD"; field: Field; value: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_METHOD":
      return { ...state, method: action.method };
    case "SET_DC_DEFLECTS":
      return { ...state, dcDeflectsForward: action.value };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
  }
}

const INITIAL: State = {
  method: "dc",
  dcDeflectsForward: null,
  I2I: "",
  UI: "",
  I2II: "",
  UII: "",
  connI_U1: "",
  connI_U2: "",
  connI_U3: "",
  connII_U1: "",
  connII_U2: "",
  connII_U3: "",
};

const CircuitosBContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function CircuitosBProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <CircuitosBContext.Provider value={value}>
      {children}
    </CircuitosBContext.Provider>
  );
}

export function useCircuitosB() {
  const ctx = useContext(CircuitosBContext);
  if (!ctx)
    throw new Error("useCircuitosB must be used inside CircuitosBProvider");
  return ctx;
}

/** Parses a field, returning 0 for blank/invalid input (never NaN). */
export function num(value: string): number {
  const n = parseFloat(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
