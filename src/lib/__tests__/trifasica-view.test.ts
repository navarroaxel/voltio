import { describe, expect, it } from "vitest";
import { abs } from "../three-phase-engine";
import { casoById } from "../trifasica-data";
import { phasorFromCaso } from "../trifasica-view";

describe("phasorFromCaso", () => {
  it("sin neutro y sin ángulo de U_N, el desplazamiento queda desconocido (no se inventa 0)", () => {
    const eqSn = casoById("eq-sn");
    expect(eqSn.UN).toBe(3.5);
    expect(eqSn.phasors.UN).toBeUndefined();
    expect(phasorFromCaso(eqSn).UN).toBeNull();
  });

  it("con neutro N' = n: desplazamiento nulo", () => {
    const d = phasorFromCaso(casoById("des-cn"));
    expect(d.UN).not.toBeNull();
    expect(abs(d.UN!)).toBe(0);
    expect(d.IN).not.toBeNull();
  });

  it("sin neutro con ángulo informado, usa el desplazamiento medido", () => {
    const d = phasorFromCaso(casoById("des-sn"));
    expect(abs(d.UN!)).toBeCloseTo(43, 9);
  });
});
