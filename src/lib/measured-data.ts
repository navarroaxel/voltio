import type { RLCInput } from "./types";

/** Factor de conversión µF → F. */
export const UF = 1e-6;

// ===========================================================================
//  PARTE A — circuito RLC serie, se varía C con f = 50 Hz fija (Variac 50 V)
// ===========================================================================

/** Datos del circuito de la Parte A (enunciado, pág. 6). */
export const PARTE_A = {
  U: 50, // V (tensión mantenida constante en el ensayo)
  R: 301, // Ω
  RL: 6.3, // Ω
  L: 0.03, // H
  f: 50, // Hz
} as const;

export interface ParteARow {
  C: number; // µF
  I: number; // A
  UR: number; // V
  UL: number; // V
  UC: number; // V
  P: number; // W
}

/** Tabla de valores medidos en el laboratorio (Parte A). */
export const PARTE_A_MEDIDO: ParteARow[] = [
  { C: 63, I: 0.154, UR: 46.2, UL: 1.69, UC: 7.6, P: 7.5 },
  { C: 55, I: 0.154, UR: 45.9, UL: 1.68, UC: 8.63, P: 7.5 },
  { C: 47, I: 0.152, UR: 45.7, UL: 1.66, UC: 10.04, P: 7.5 },
  { C: 40, I: 0.151, UR: 45.5, UL: 1.65, UC: 11.96, P: 7.5 },
  { C: 32, I: 0.149, UR: 44.9, UL: 1.63, UC: 14.71, P: 7.5 },
  { C: 24, I: 0.145, UR: 43.7, UL: 1.59, UC: 19.13, P: 7 },
  { C: 16, I: 0.134, UR: 40.6, UL: 1.47, UC: 26.46, P: 5.5 },
  { C: 8, I: 0.1, UR: 30.3, UL: 1.07, UC: 39.37, P: 3 },
  { C: 0, I: 0, UR: 0, UL: 0, UC: 50, P: 0 },
];

/** Base del motor para la Parte A (todo fijo salvo C). C se pasa en faradios. */
export const PARTE_A_BASE: Omit<RLCInput, "C"> = {
  U: PARTE_A.U,
  R: PARTE_A.R,
  RL: PARTE_A.RL,
  L: PARTE_A.L,
  f: PARTE_A.f,
};

/** Primer valor de C de la tabla (µF) — usado para el barrido de frecuencia (punto 6d). */
export const PARTE_A_C_PRIMERO = PARTE_A_MEDIDO[0].C; // 63 µF

// ===========================================================================
//  PARTE B — circuito RLC serie, se varía f con R/L/C fijos (GAF ~4 V)
// ===========================================================================

/**
 * Valores de los elementos de la Parte B.
 * El enunciado deja en blanco R/L/C ("Aquí colocar valores medidos"); estos son
 * ESTIMADOS a partir de la curva medida (reproducen f0 ≈ 509 Hz y Q ≈ 10,8).
 * Reemplazar por los valores reales registrados por el grupo.
 */
export const PARTE_B = {
  U: 4, // V (tensión del GAF, nominal constante)
  R: 220, // Ω
  RL: 66, // Ω (resistencia interna de la bobina de décadas)
  L: 0.98, // H
  C: 0.1, // µF
} as const;

/** Marca que los valores R/L/C de la Parte B son estimados, no medidos. */
export const PARTE_B_ESTIMADO = true;

export interface ParteBRow {
  n: number;
  f: number; // Hz
  U: number; // V (fuente)
  URS: number; // V (sobre la resistencia externa R)
  UC: number; // V
  UL: number; // V
}

/** Tabla de valores medidos en el laboratorio (Parte B, enunciado pág. 9). */
export const PARTE_B_MEDIDO: ParteBRow[] = [
  { n: 1, f: 151, U: 4.03, URS: 0.092, UC: 4.4, UL: 0.378 },
  { n: 2, f: 250, U: 4.02, URS: 0.184, UC: 5.27, UL: 1.261 },
  { n: 3, f: 352, U: 4.01, URS: 0.353, UC: 7.35, UL: 3.34 },
  { n: 4, f: 396, U: 3.99, URS: 0.548, UC: 9.96, UL: 6.05 },
  { n: 5, f: 450, U: 3.92, URS: 1.082, UC: 17.36, UL: 13.73 },
  { n: 6, f: 509, U: 3.38, URS: 2.607, UC: 36.57, UL: 37.14 },
  { n: 7, f: 561, U: 3.89, URS: 1.274, UC: 16.4, UL: 19.9 },
  { n: 8, f: 611, U: 3.97, URS: 0.73, UC: 8.6, UL: 12.44 },
  { n: 9, f: 680, U: 3.99, URS: 0.465, UC: 5.02, UL: 9.05 },
  { n: 10, f: 744, U: 4, URS: 0.358, UC: 3.393, UL: 7.4 },
  { n: 11, f: 875, U: 4, URS: 0.246, UC: 2.02, UL: 6.05 },
  { n: 12, f: 1009, U: 4, URS: 0.19, UC: 1.34, UL: 5.35 },
];

/** Fila de resonancia medida de la Parte B (I y U_RS máximas, N°6 ≈ 509 Hz). */
export const PARTE_B_RESONANCIA = PARTE_B_MEDIDO.reduce((a, b) => (b.URS > a.URS ? b : a));

/** Base del motor para la Parte B (todo fijo salvo f). C convertido a faradios. */
export const PARTE_B_BASE: Omit<RLCInput, "f"> = {
  U: PARTE_B.U,
  R: PARTE_B.R,
  RL: PARTE_B.RL,
  L: PARTE_B.L,
  C: PARTE_B.C * UF,
};
