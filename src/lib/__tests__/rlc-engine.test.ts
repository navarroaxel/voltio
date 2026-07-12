import { describe, it, expect } from "vitest";
import { calcRLC, resonantC, resonantF, sweepF, linspace } from "../rlc-engine";
import { PART_A_BASE, PART_B_BASE, PART_B, UF } from "../measured-data";

describe("series RLC engine — Part A (varies C, f = 50 Hz)", () => {
  it("reproduces the measured point C = 8 µF", () => {
    const r = calcRLC({ ...PART_A_BASE, C: 8 * UF });
    expect(r.I).toBeCloseTo(0.1, 2); // measured 0.100 A
    expect(r.UC).toBeGreaterThan(38); // measured 39.37 V
    expect(r.UC).toBeLessThan(42);
    expect(r.UR).toBeCloseTo(30.3, 0); // measured 30.3 V
    expect(r.P).toBeCloseTo(3, 0); // measured 3 W
  });

  it("reproduces the measured point C = 63 µF (within lab dispersion)", () => {
    const r = calcRLC({ ...PART_A_BASE, C: 63 * UF });
    expect(r.I).toBeGreaterThan(0.15); // measured 0.154 A
    expect(r.I).toBeLessThan(0.165);
    expect(r.P).toBeGreaterThan(7); // measured 7.5 W
    expect(r.P).toBeLessThan(8.1);
  });

  it("C = 0 leaves the circuit open: I = 0 and UC = U", () => {
    const r = calcRLC({ ...PART_A_BASE, C: 0 });
    expect(r.I).toBe(0);
    expect(r.UC).toBe(PART_A_BASE.U);
    expect(Number.isFinite(r.Z)).toBe(false);
  });

  it("resonant C at 50 Hz is ≈ 337.7 µF (outside the box's range)", () => {
    const c = resonantC(PART_A_BASE.L, 50);
    expect(c / UF).toBeCloseTo(337.7, 0);
  });

  it("f0 for the first C (63 µF) is ≈ 115.8 Hz", () => {
    const f0 = resonantF(PART_A_BASE.L, 63 * UF);
    expect(f0).toBeCloseTo(115.8, 0);
  });
});

describe("series RLC engine — Part B (varies f)", () => {
  it("the resonant frequency is ≈ 509 Hz", () => {
    const f0 = resonantF(PART_B.L, PART_B.C * UF);
    expect(f0).toBeGreaterThan(504);
    expect(f0).toBeLessThan(514);
  });

  it("at resonance φ ≈ 0 and UL ≈ UC", () => {
    const f0 = resonantF(PART_B.L, PART_B.C * UF);
    const r = calcRLC({ ...PART_B_BASE, f: f0 });
    expect(Math.abs(r.phiDeg)).toBeLessThan(1);
    expect(r.UL).toBeCloseTo(r.UC, 0);
  });

  it("the quality factor Q is ≈ 10.9", () => {
    const f0 = resonantF(PART_B.L, PART_B.C * UF);
    const r = calcRLC({ ...PART_B_BASE, f: f0 });
    expect(r.Qfactor).toBeGreaterThan(10);
    expect(r.Qfactor).toBeLessThan(12);
  });

  it("current is maximum at resonance (sweep)", () => {
    const fs = linspace(150, 1010, 200);
    const res = sweepF(PART_B_BASE, fs);
    const iMax = Math.max(...res.map((r) => r.I));
    const idx = res.findIndex((r) => r.I === iMax);
    expect(fs[idx]).toBeGreaterThan(490);
    expect(fs[idx]).toBeLessThan(525);
  });
});
