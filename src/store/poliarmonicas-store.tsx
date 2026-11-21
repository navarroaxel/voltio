"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import {
  GRID_PRESETS,
  type EnsayoConnection,
  type GridSettings,
  type LoadKey,
} from "@/lib/poliarmonicas-data";

/**
 * Estado del simulador de interferencias (TP4). A diferencia de TP1/TP2, aquí
 * no se cargan lecturas: se eligen una carga, una conexión y las armónicas de
 * la tensión de red, y el motor (`harmonics-engine.ts`) recalcula todo.
 */
export interface State extends GridSettings {
  load: LoadKey;
  connection: EnsayoConnection;
  /** Capacitor en paralelo con los tubos (µF). */
  tubosC: number;
}

export type GridField = keyof GridSettings;

type Action =
  | { type: "SET_LOAD"; load: LoadKey }
  | { type: "SET_CONNECTION"; connection: EnsayoConnection }
  | { type: "SET_GRID"; field: GridField; value: number }
  | { type: "SET_TUBOS_C"; value: number }
  | { type: "PRESET"; grid: GridSettings };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOAD":
      return { ...state, load: action.load };
    case "SET_CONNECTION":
      return { ...state, connection: action.connection };
    case "SET_GRID":
      return { ...state, [action.field]: action.value };
    case "SET_TUBOS_C":
      return { ...state, tubosC: action.value };
    case "PRESET":
      return { ...state, ...action.grid };
  }
}

const INITIAL: State = {
  ...GRID_PRESETS.ideal,
  load: "bajoConsumo",
  connection: "trifasica",
  tubosC: 0,
};

const PoliContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function PoliarmonicasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <PoliContext.Provider value={value}>{children}</PoliContext.Provider>;
}

export function usePoliarmonicas() {
  const ctx = useContext(PoliContext);
  if (!ctx)
    throw new Error("usePoliarmonicas must be used inside PoliarmonicasProvider");
  return ctx;
}
