import { describe, expect, it } from "vitest";
import { num, parseReading } from "../parse-number";

describe("parseReading", () => {
  it("accepts decimal comma and dot", () => {
    expect(parseReading("0,5")).toBe(0.5);
    expect(parseReading(" 12.25 ")).toBe(12.25);
    expect(parseReading("0")).toBe(0);
  });

  it("rejects blank and malformed input", () => {
    for (const bad of ["", "  ", "0,5,5", "1.2.3", "-1", "1e3", "abc", "."])
      expect(parseReading(bad), bad).toBeNull();
  });

  it("num maps blank/invalid input to 0", () => {
    expect(num("0,5,5")).toBe(0);
    expect(num("2,5")).toBe(2.5);
  });
});
