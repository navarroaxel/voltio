import type { RLCInput, RLCResult } from "./types";

/**
 * Frecuencia de resonancia f0 = 1 / (2π·√(L·C)).
 * Devuelve NaN si falta algún componente reactivo.
 */
export function resonantF(L: number, C: number): number {
  if (L <= 0 || C <= 0) return NaN;
  return 1 / (2 * Math.PI * Math.sqrt(L * C));
}

/**
 * Capacidad necesaria para resonar a la frecuencia f con la inductancia L:
 * C = 1 / (ω²·L). Útil para el punto 6a de la Parte A.
 */
export function resonantC(L: number, f: number): number {
  if (L <= 0 || f <= 0) return NaN;
  const omega = 2 * Math.PI * f;
  return 1 / (omega * omega * L);
}

/**
 * Resuelve un circuito RLC serie con bobina real (resistencia interna RL).
 * Maneja C = 0 (capacitor abierto): I = 0 y toda la tensión cae sobre el capacitor.
 */
export function calcRLC(input: RLCInput): RLCResult {
  const { U, R, RL, L, C, f } = input;
  const omega = 2 * Math.PI * f;
  const XL = omega * L;
  const Rtot = R + RL;
  const f0 = resonantF(L, C);

  // Capacitor abierto: circuito abierto, no circula corriente.
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
  const UL = I * Math.hypot(RL, XL); // la bobina real cae I·|RL + jXL|
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

/** Barre la frecuencia f manteniendo el resto fijo. */
export function sweepF(
  base: Omit<RLCInput, "f">,
  fValues: number[],
): RLCResult[] {
  return fValues.map((f) => calcRLC({ ...base, f }));
}

/** Genera `count` frecuencias equiespaciadas en [from, to] (inclusive). */
export function linspace(from: number, to: number, count: number): number[] {
  if (count <= 1) return [from];
  const step = (to - from) / (count - 1);
  return Array.from({ length: count }, (_, i) => from + i * step);
}
