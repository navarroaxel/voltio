/**
 * TP3 "Circuitos trifásicos" — readings transcribed from the group's report
 * (lab3.pdf, §5.2 table and §6.c phasor tables). Star load fed from a 380 V
 * line network, resistor bank (≈ 123 Ω per phase) and, for the unbalanced
 * case, 2 × 8 µF (16 µF, X_C ≈ 199 Ω) in phase S. Angles use U_RS as the 0°
 * reference. Nothing here is estimated: every number is a reading or a value
 * the report itself derives (U_N, I_N angles come from its phasor diagrams).
 */

export type CasoId = "eq-sn" | "eq-cn" | "des-sn" | "des-cn";

export interface Fasor {
  mag: number;
  deg: number;
}

export interface Caso {
  id: CasoId;
  balanced: boolean;
  neutral: boolean;
  /** Phase voltages U_R', U_S', U_T' [V] (UR, US, UT of the table). */
  U: [number, number, number];
  /** Line voltages U_RS, U_ST, U_TR [V]. */
  Uline: [number, number, number];
  /** Line currents [A]. */
  I: [number, number, number];
  /** Aron wattmeters (R and T, S common) [W]. */
  W1: number;
  W2: number;
  WT: number;
  /** Star-point voltage U_N [V] (no neutral) — the "UN/IN" column. */
  UN: number | null;
  /** Neutral current [A] (with neutral). `approxZero`: reported as ≈ 0. */
  IN: number | null;
  /** Phasors read off the report's diagrams (angle from U_RS). */
  phasors: {
    U: [Fasor, Fasor, Fasor];
    I: [Fasor, Fasor, Fasor];
    UN?: Fasor;
    IN?: Fasor;
  };
}

const f = (mag: number, deg: number): Fasor => ({ mag, deg });

export const CASOS: Caso[] = [
  {
    id: "eq-sn",
    balanced: true,
    neutral: false,
    U: [221, 221, 224],
    Uline: [379, 384, 385],
    I: [1.8, 1.8, 1.8],
    W1: 620,
    W2: 620,
    WT: 1240,
    UN: 3.5,
    IN: null,
    phasors: {
      U: [f(221, -30), f(221, -150), f(224, 90)],
      I: [f(1.8, -30), f(1.8, -150), f(1.8, 90)],
    },
  },
  {
    id: "eq-cn",
    balanced: true,
    neutral: true,
    U: [221, 221, 224],
    Uline: [379, 384, 385],
    I: [1.8, 1.8, 1.8],
    W1: 620,
    W2: 620,
    WT: 1240,
    UN: null,
    IN: 0, // reported as "≅ 0 A"
    phasors: {
      U: [f(221, -30), f(221, -150), f(224, 90)],
      I: [f(1.8, -30), f(1.8, -150), f(1.8, 90)],
    },
  },
  {
    id: "des-sn",
    balanced: false,
    neutral: false,
    U: [191, 218, 264],
    Uline: [379, 384, 385],
    I: [1.65, 2.15, 2.25],
    W1: 580,
    W2: 720,
    WT: 1300,
    UN: 43,
    IN: null,
    phasors: {
      U: [f(191, -21), f(218, -162), f(264, 93)],
      I: [f(1.65, -21), f(2.15, -130), f(2.25, 93)],
      UN: f(43, -72),
    },
  },
  {
    id: "des-cn",
    balanced: false,
    neutral: true,
    U: [221, 221, 224],
    Uline: [379, 384, 385],
    I: [1.9, 2.2, 1.9],
    W1: 620,
    W2: 620,
    WT: 1240,
    UN: null,
    IN: 1.14,
    phasors: {
      U: [f(221, -30), f(221, -150), f(224, 90)],
      I: [f(1.9, -30), f(2.2, -118), f(1.9, 90)],
      IN: f(1.14, -60),
    },
  },
];

export const casoById = (id: CasoId): Caso =>
  CASOS.find((c) => c.id === id) as Caso;

/** Resistance per phase [Ω] taken by the report (≈ 221 V / 1,8 A). */
export const R_FASE = 123;
/** Capacitor bank in phase S: 2 × 8 µF in parallel. */
export const C_BANCO_UF = 16;
/** Its reactance at 50 Hz [Ω] (report: ≈ 199 Ω). */
export const X_BANCO = 199;

/** Source phase-voltage magnitudes with neutral connected (the network's own asymmetry). */
export const U_RED = { R: 221, S: 221, T: 224 } as const;
