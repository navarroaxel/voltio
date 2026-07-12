import { describe, it, expect } from "vitest";
import { fmt } from "../format";

describe("fmt", () => {
  it("uses a decimal comma (Spanish convention)", () => {
    expect(fmt(3.14159, 2)).toBe("3,14");
    expect(fmt(1000, 1)).toBe("1000,0");
  });

  it("defaults to 2 decimals", () => {
    expect(fmt(2.5)).toBe("2,50");
  });

  it("returns an em dash for non-finite values", () => {
    expect(fmt(NaN)).toBe("—");
    expect(fmt(Infinity)).toBe("—");
    expect(fmt(-Infinity)).toBe("—");
  });

  it("drops the spurious minus from values that round to zero", () => {
    // A tiny residual reactive power at resonance must not read "-0,000".
    expect(fmt(-1e-15, 3)).toBe("0,000");
    expect(fmt(-0, 2)).toBe("0,00");
    expect(fmt(-0.0004, 3)).toBe("0,000");
  });

  it("keeps the minus on values that do not round to zero", () => {
    expect(fmt(-0.5, 1)).toBe("-0,5");
    expect(fmt(-2.607, 3)).toBe("-2,607");
  });

  it("rounds correctly", () => {
    expect(fmt(2.6065, 3)).toBe("2,607");
    expect(fmt(0.005, 2)).toBe("0,01");
  });
});
