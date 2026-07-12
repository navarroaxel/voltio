import type { RLCInput } from "./types";

/** µF → F conversion factor. */
export const UF = 1e-6;

// ===========================================================================
//  PART A — series RLC circuit, C is varied with f = 50 Hz fixed (Variac 50 V)
// ===========================================================================

/** Part A circuit data (assignment sheet, p. 6). */
export const PART_A = {
  U: 50, // V (voltage held constant during the test)
  R: 301, // Ω
  RL: 6.3, // Ω
  L: 0.03, // H
  f: 50, // Hz
} as const;

export interface PartARow {
  C: number; // µF
  I: number; // A
  UR: number; // V
  UL: number; // V
  UC: number; // V
  P: number; // W
}

/** Table of values measured in the lab (Part A). */
export const PART_A_MEASURED: PartARow[] = [
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

/** Engine base for Part A (everything fixed except C). C is passed in farads. */
export const PART_A_BASE: Omit<RLCInput, "C"> = {
  U: PART_A.U,
  R: PART_A.R,
  RL: PART_A.RL,
  L: PART_A.L,
  f: PART_A.f,
};

/** First C value in the table (µF) — used for the frequency sweep (point 6d). */
export const PART_A_FIRST_C = PART_A_MEASURED[0].C; // 63 µF

// ===========================================================================
//  PART B — series RLC circuit, f is varied with fixed R/L/C (GAF ~4 V)
// ===========================================================================

/**
 * Values of the Part B elements.
 * The assignment sheet leaves R/L/C blank ("insert measured values here"); these are
 * ESTIMATED from the measured curve (they reproduce f0 ≈ 509 Hz and Q ≈ 10.8).
 * Replace with the actual values recorded by the group.
 */
export const PART_B = {
  U: 4, // V (GAF voltage, nominally constant)
  R: 220, // Ω
  RL: 66, // Ω (internal resistance of the decade coil)
  L: 0.98, // H
  C: 0.1, // µF
} as const;

/** Marks that the Part B R/L/C values are estimated, not measured. */
export const PART_B_ESTIMATED = true;

export interface PartBRow {
  n: number;
  f: number; // Hz
  U: number; // V (source)
  URS: number; // V (across the external resistance R)
  UC: number; // V
  UL: number; // V
}

/** Table of values measured in the lab (Part B, assignment sheet p. 9). */
export const PART_B_MEASURED: PartBRow[] = [
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

/** Measured resonance row of Part B (maximum I and U_RS, #6 ≈ 509 Hz). */
export const PART_B_RESONANCE = PART_B_MEASURED.reduce((a, b) => (b.URS > a.URS ? b : a));

/** Engine base for Part B (everything fixed except f). C converted to farads. */
export const PART_B_BASE: Omit<RLCInput, "f"> = {
  U: PART_B.U,
  R: PART_B.R,
  RL: PART_B.RL,
  L: PART_B.L,
  C: PART_B.C * UF,
};
