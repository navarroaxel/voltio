import { describe, expect, it } from "vitest";
import {
  calcTransformerParams,
  classifyCoupling,
  homologousByCurrent,
  homologousByVoltage,
  mutualsAgree,
} from "../transformer-engine";

const full = { U1: 110, I10: 1, U20: 63.5, U2: 63.5, I20: 2, U10: 55, f: 50 };

describe("calcTransformerParams", () => {
  it("computes every parameter when all six readings exist", () => {
    const r = calcTransformerParams(full);
    expect(r.L1).toBeCloseTo(110 / (2 * Math.PI * 50 * 1), 9);
    expect(r.M12).toBeCloseTo(63.5 / (2 * Math.PI * 50), 9);
    expect(r.K).toBeCloseTo(Math.sqrt((63.5 * 55) / (110 * 63.5)), 9);
  });

  it("does not report K (or M) for incomplete readings", () => {
    const r = calcTransformerParams({ ...full, U20: 0, U10: 0 });
    expect(Number.isNaN(r.K)).toBe(true);
    expect(Number.isNaN(r.M12)).toBe(true);
    expect(Number.isNaN(r.M21)).toBe(true);
    expect(Number.isFinite(r.L1)).toBe(true);
  });

  it("returns NaN for L1 when U1 is blank", () => {
    expect(Number.isNaN(calcTransformerParams({ ...full, U1: 0 }).L1)).toBe(true);
  });
});

describe("classifyCoupling / mutualsAgree", () => {
  it("applies the 0.95 and 0.7 thresholds", () => {
    expect(classifyCoupling(0.97)).toBe("perfect");
    expect(classifyCoupling(0.8)).toBe("strong");
    expect(classifyCoupling(0.5)).toBe("weak");
    expect(classifyCoupling(NaN)).toBeNull();
  });

  it("treats mutuals within 5 % as agreeing, and two zeros as agreeing", () => {
    expect(mutualsAgree(1, 1.04)).toBe(true);
    expect(mutualsAgree(1, 1.2)).toBe(false);
    expect(mutualsAgree(0, 0)).toBe(true);
  });
});

describe("homologousByCurrent", () => {
  it("is pending without both currents or when they tie", () => {
    expect(homologousByCurrent(0, 1).homologous).toBeNull();
    expect(homologousByCurrent(1, 1).homologous).toBeNull();
  });

  it("keeps the verdict for the lower current in Conexión II", () => {
    expect(homologousByCurrent(2, 1).homologous).toBe("I");
    expect(homologousByCurrent(1, 2).homologous).toBe("II");
  });

  it("normalizes by the applied voltage when both are given", () => {
    // Raw currents say II is lower, but II was excited with a lower voltage:
    // per volt, II draws more current.
    expect(homologousByCurrent(1, 0.9, 100, 80).homologous).toBe("II");
    expect(homologousByCurrent(1, 0.9).homologous).toBe("I");
  });
});

describe("homologousByVoltage", () => {
  it("picks homologous when U3 ≈ |U1−U2| and not when U3 ≈ U1+U2", () => {
    expect(homologousByVoltage(110, 63.5, 46.5).homologous).toBe(true);
    expect(homologousByVoltage(110, 63.5, 173.5).homologous).toBe(false);
    expect(homologousByVoltage(110, 63.5, null).homologous).toBeNull();
  });

  it("accepts a measured U3 = 0 when U1 = U2 (in-phase voltages cancel)", () => {
    expect(homologousByVoltage(63.5, 63.5, 0).homologous).toBe(true);
  });
});
