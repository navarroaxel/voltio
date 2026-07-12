import { describe, it, expect } from "vitest";
import { calcRLC, resonantC, resonantF, sweepF, linspace } from "../rlc-engine";
import { PARTE_A_BASE, PARTE_B_BASE, PARTE_B, UF } from "../measured-data";

describe("motor RLC serie — Parte A (varía C, f = 50 Hz)", () => {
  it("reproduce el punto medido C = 8 µF", () => {
    const r = calcRLC({ ...PARTE_A_BASE, C: 8 * UF });
    expect(r.I).toBeCloseTo(0.1, 2); // medido 0,100 A
    expect(r.UC).toBeGreaterThan(38); // medido 39,37 V
    expect(r.UC).toBeLessThan(42);
    expect(r.UR).toBeCloseTo(30.3, 0); // medido 30,3 V
    expect(r.P).toBeCloseTo(3, 0); // medido 3 W
  });

  it("reproduce el punto medido C = 63 µF (dentro de la dispersión del lab)", () => {
    const r = calcRLC({ ...PARTE_A_BASE, C: 63 * UF });
    expect(r.I).toBeGreaterThan(0.15); // medido 0,154 A
    expect(r.I).toBeLessThan(0.165);
    expect(r.P).toBeGreaterThan(7); // medido 7,5 W
    expect(r.P).toBeLessThan(8.1);
  });

  it("C = 0 deja el circuito abierto: I = 0 y UC = U", () => {
    const r = calcRLC({ ...PARTE_A_BASE, C: 0 });
    expect(r.I).toBe(0);
    expect(r.UC).toBe(PARTE_A_BASE.U);
    expect(Number.isFinite(r.Z)).toBe(false);
  });

  it("C de resonancia a 50 Hz es ≈ 337,7 µF (fuera del rango de la caja)", () => {
    const c = resonantC(PARTE_A_BASE.L, 50);
    expect(c / UF).toBeCloseTo(337.7, 0);
  });

  it("f0 para el primer C (63 µF) es ≈ 115,8 Hz", () => {
    const f0 = resonantF(PARTE_A_BASE.L, 63 * UF);
    expect(f0).toBeCloseTo(115.8, 0);
  });
});

describe("motor RLC serie — Parte B (varía f)", () => {
  it("la frecuencia de resonancia es ≈ 509 Hz", () => {
    const f0 = resonantF(PARTE_B.L, PARTE_B.C * UF);
    expect(f0).toBeGreaterThan(504);
    expect(f0).toBeLessThan(514);
  });

  it("en resonancia φ ≈ 0 y UL ≈ UC", () => {
    const f0 = resonantF(PARTE_B.L, PARTE_B.C * UF);
    const r = calcRLC({ ...PARTE_B_BASE, f: f0 });
    expect(Math.abs(r.phiDeg)).toBeLessThan(1);
    expect(r.UL).toBeCloseTo(r.UC, 0);
  });

  it("el factor de mérito Q es ≈ 10,9", () => {
    const f0 = resonantF(PARTE_B.L, PARTE_B.C * UF);
    const r = calcRLC({ ...PARTE_B_BASE, f: f0 });
    expect(r.Qfactor).toBeGreaterThan(10);
    expect(r.Qfactor).toBeLessThan(12);
  });

  it("la corriente es máxima en resonancia (barrido)", () => {
    const fs = linspace(150, 1010, 200);
    const res = sweepF(PARTE_B_BASE, fs);
    const iMax = Math.max(...res.map((r) => r.I));
    const idx = res.findIndex((r) => r.I === iMax);
    expect(fs[idx]).toBeGreaterThan(490);
    expect(fs[idx]).toBeLessThan(525);
  });
});
