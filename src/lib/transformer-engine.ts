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

  const L1 = I10 > 0 ? U1 / (omega * I10) : NaN;
  const M12 = I10 > 0 ? U20 / (omega * I10) : NaN;
  const L2 = I20 > 0 ? U2 / (omega * I20) : NaN;
  const M21 = I20 > 0 ? U10 / (omega * I20) : NaN;
  const K =
    U1 > 0 && U2 > 0 ? Math.sqrt((U20 * U10) / (U1 * U2)) : NaN;

  return { omega, L1, M12, L2, M21, K };
}

type BridgeConnection = "I" | "II";

/**
 * AC method with ammeter (point 5.2.2.1): the primary and secondary
 * windings are put in series and the same voltage is applied to Conexión I
 * and Conexión II (bornes bridged differently). The connection with the
 * LOWER current is the additive one (Xtotal = XL1+XL2−2·XM would be lower
 * only if it were subtractive) — per the assignment: a lower current in II
 * means II is subtractive, so the bridged terminals of Conexión I are the
 * homologous ones (and vice versa).
 */
export function homologousByCurrent(
  currentI: number,
  currentII: number,
): HomologousByCurrentResult {
  if (!(currentI > 0) || !(currentII > 0) || currentI === currentII) {
    return { homologous: null, seriesMode: null };
  }
  if (currentII < currentI) {
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
