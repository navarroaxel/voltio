import type { RLCInput, RLCResult } from "./types";

/**
 * Resonant frequency f0 = 1 / (2π·√(L·C)).
 * Returns NaN if any reactive component is missing.
 */
export function resonantF(L: number, C: number): number {
  if (L <= 0 || C <= 0) return NaN;
  return 1 / (2 * Math.PI * Math.sqrt(L * C));
}

/**
 * Capacitance needed to resonate at frequency f with inductance L:
 * C = 1 / (ω²·L). Useful for Part A's point 6a.
 */
export function resonantC(L: number, f: number): number {
  if (L <= 0 || f <= 0) return NaN;
  const omega = 2 * Math.PI * f;
  return 1 / (omega * omega * L);
}

/**
 * Solves a series RLC circuit with a real coil (internal resistance RL).
 * Handles C = 0 (open capacitor): I = 0 and the full voltage falls on the capacitor.
 */
export function calcRLC(input: RLCInput): RLCResult {
  const { U, R, RL, L, C, f } = input;
  const omega = 2 * Math.PI * f;
  const XL = omega * L;
  const Rtot = R + RL;
  const f0 = resonantF(L, C);

  // Open capacitor: open circuit, no current flows.
  if (C <= 0) {
    return {
      omega,
      XL,
      XC: Infinity,
      R,
      RL,
      Rtot,
      X: Infinity,
      Z: Infinity,
      phiDeg: -90,
      I: 0,
      UR: 0,
      UL: 0,
      UC: U,
      P: 0,
      Qreact: 0,
      S: 0,
      fp: 0,
      f0,
      Qfactor: NaN,
    };
  }

  const XC = 1 / (omega * C);
  const X = XL - XC;
  const Z = Math.hypot(Rtot, X);
  const phiDeg = (Math.atan2(X, Rtot) * 180) / Math.PI;
  const I = U / Z;
  const UR = I * R;
  const UL = I * Math.hypot(RL, XL); // the real coil drops I·|RL + jXL|
  const UC = I * XC;
  const P = I * I * Rtot;
  const Qreact = I * I * X;
  const S = U * I;
  const fp = S > 0 ? P / S : 1;
  const Qfactor = Rtot > 0 ? (1 / Rtot) * Math.sqrt(L / C) : Infinity;

  return {
    omega,
    XL,
    XC,
    R,
    RL,
    Rtot,
    X,
    Z,
    phiDeg,
    I,
    UR,
    UL,
    UC,
    P,
    Qreact,
    S,
    fp,
    f0,
    Qfactor,
  };
}

/** Sweeps frequency f while keeping everything else fixed. */
export function sweepF(
  base: Omit<RLCInput, "f">,
  fValues: number[],
): RLCResult[] {
  return fValues.map((f) => calcRLC({ ...base, f }));
}

/** Generates `count` evenly spaced frequencies in [from, to] (inclusive). */
export function linspace(from: number, to: number, count: number): number[] {
  if (count <= 1) return [from];
  const step = (to - from) / (count - 1);
  return Array.from({ length: count }, (_, i) => from + i * step);
}
