import type {
  TransformerParamsInput,
  TransformerParamsResult,
  HomologousByCurrentResult,
  HomologousByVoltageResult,
} from "./types";

/**
 * Determination of self/mutual inductances of a two-winding transformer
 * (TP2 "Circuitos Acoplados", point 5.1). The ohmic resistance of the
 * windings is neglected, so each connection behaves as a pure inductance:
 *   L1 = U1/(ω·I10)   M12 = U20/(ω·I10)   (Conexión I: primary excited)
 *   L2 = U2/(ω·I20)   M21 = U10/(ω·I20)   (Conexión II: secondary excited)
 *   K  = M12/√(L1·L2) = √(U20·U10 / (U1·U2))
 * Returns NaN for any quantity whose measured inputs are missing (0).
 */
export function calcTransformerParams(
  input: TransformerParamsInput,
): TransformerParamsResult {
  const { U1, I10, U20, U2, I20, U10, f } = input;
  const omega = 2 * Math.PI * f;

  // Each quantity needs every input of its own formula (and a valid
  // frequency); a blank field is 0, which must not turn into a number.
  const wOk = omega > 0;
  const L1 = wOk && U1 > 0 && I10 > 0 ? U1 / (omega * I10) : NaN;
  const M12 = wOk && U20 > 0 && I10 > 0 ? U20 / (omega * I10) : NaN;
  const L2 = wOk && U2 > 0 && I20 > 0 ? U2 / (omega * I20) : NaN;
  const M21 = wOk && U10 > 0 && I20 > 0 ? U10 / (omega * I20) : NaN;
  const K =
    U1 > 0 && U2 > 0 && U20 > 0 && U10 > 0
      ? Math.sqrt((U20 * U10) / (U1 * U2))
      : NaN;

  return { omega, L1, M12, L2, M21, K };
}

export type CouplingClass = "perfect" | "strong" | "weak";

/** Qualitative reading of the coupling coefficient K (0.95 / 0.7 thresholds). */
export function classifyCoupling(K: number): CouplingClass | null {
  if (!Number.isFinite(K)) return null;
  if (K >= 0.95) return "perfect";
  if (K >= 0.7) return "strong";
  return "weak";
}

/**
 * M12 and M21 must be equal in a reciprocal transformer; here they agree
 * when they differ by less than `tol` (5 % by default) of the larger one.
 * Two zero values trivially agree.
 */
export function mutualsAgree(M12: number, M21: number, tol = 0.05): boolean {
  const big = Math.max(M12, M21);
  if (!(big > 0)) return M12 === M21;
  return Math.abs(M12 - M21) < tol * big;
}

type BridgeConnection = "I" | "II";

/**
 * AC method with ammeter (point 5.2.2.1): primary and secondary windings are
 * put in series and the same voltage is applied in Conexión I and Conexión II
 * (terminals bridged differently). The additive connection has the larger
 * total inductance (L1+L2+2M) and so draws the LOWER current; the subtractive
 * one (L1+L2−2M) draws the higher current. Per the assignment's convention,
 * when Conexión II draws the lower current (additive) the bridged terminals
 * of Conexión I are the homologous ones, and vice versa.
 *
 * If both applied voltages are given they are used to compare admittances
 * (I/U) instead of raw currents, so a small difference in excitation does not
 * flip the verdict. With a missing voltage the raw currents are compared.
 */
export function homologousByCurrent(
  currentI: number,
  currentII: number,
  voltageI = 0,
  voltageII = 0,
): HomologousByCurrentResult {
  if (!(currentI > 0) || !(currentII > 0)) {
    return { homologous: null, seriesMode: null };
  }
  const normalize = voltageI > 0 && voltageII > 0;
  const yI = normalize ? currentI / voltageI : currentI;
  const yII = normalize ? currentII / voltageII : currentII;
  if (yI === yII) {
    return { homologous: null, seriesMode: null };
  }
  if (yII < yI) {
    return { homologous: "I", seriesMode: "additive-in-II" };
  }
  return { homologous: "II", seriesMode: "subtractive-in-II" };
}

/**
 * AC method with the applied-voltage test (point 5.2.2.2): U3 is read across
 * the bridged terminal pair while U1 (primary) and U2 (secondary) are held.
 * If U3 ≈ |U1 − U2| the bridged terminals are homologous (in-phase primary
 * and secondary voltages); if U3 ≈ U1 + U2 they are not (180° out of phase).
 */
export function homologousByVoltage(
  U1: number,
  U2: number,
  U3: number,
): HomologousByVoltageResult {
  if (!(U1 > 0) || !(U2 > 0) || !(U3 > 0)) {
    return { homologous: null, diff: NaN, sum: NaN };
  }
  const diff = Math.abs(U1 - U2);
  const sum = U1 + U2;
  const homologous = Math.abs(U3 - diff) <= Math.abs(U3 - sum);
  return { homologous, diff, sum };
}

export type { BridgeConnection };
