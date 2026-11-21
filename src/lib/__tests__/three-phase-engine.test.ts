import { describe, expect, it } from "vitest";
import {
  abs,
  arg,
  capacitanceFor,
  inductanceFor,
  solveStar,
  type StarInput,
} from "../three-phase-engine";
import { C_BANCO_UF, CASOS, R_FASE, U_RED, X_BANCO, casoById } from "../trifasica-data";

const base: StarInput = {
  U: { ...U_RED },
  R: R_FASE,
  reactive: "none",
  X: X_BANCO,
  neutral: false,
};
const sym: StarInput["U"] = { R: 221, S: 221, T: 221 };
const within = (v: number, ref: number, tol: number) =>
  Math.abs(v - ref) / ref <= tol;

describe("carga equilibrada (resistiva pura)", () => {
  it("no hay desplazamiento relevante ni corriente de neutro, con o sin neutro", () => {
    const sn = solveStar(base);
    const cn = solveStar({ ...base, neutral: true });
    expect(abs(sn.UN)).toBeLessThan(2); // asimetría de la red (224 V en T)
    expect(abs(cn.IN)).toBeLessThan(0.03); // sólo la asimetría de la red
    expect(abs(cn.UN)).toBe(0);
  });

  it("corrientes iguales ≈ 1,8 A en fase con sus tensiones", () => {
    const r = solveStar({ ...base, neutral: true });
    for (const p of ["R", "S"] as const) {
      expect(within(abs(r.I[p]), 1.8, 0.02)).toBe(true);
      expect(Math.abs(arg(r.I[p]) - arg(r.Uload[p]))).toBeLessThan(1e-9);
    }
  });
});

describe("desequilibrio capacitivo en S: modelo vs lecturas del informe (sin ajustar)", () => {
  const sim = (neutral: boolean) =>
    solveStar({ ...base, reactive: "capacitor", X: X_BANCO, neutral });

  it("sin neutro: desplazamiento ≈ 43 V ∠ −72° (Millman)", () => {
    const m = casoById("des-sn");
    const r = sim(false);
    expect(within(abs(r.UN), m.UN!, 0.05)).toBe(true);
    expect(Math.abs(arg(r.UN) - m.phasors.UN!.deg)).toBeLessThan(3);
  });

  it("sin neutro: tensiones de fase ≈ 191 / 218 / 264 V (±3 %)", () => {
    const m = casoById("des-sn");
    const r = sim(false);
    (["R", "S", "T"] as const).forEach((p, k) =>
      expect(within(abs(r.Uload[p]), m.U[k], 0.03), p).toBe(true),
    );
  });

  it("sin neutro: la fase T (la que sigue a S) recibe la mayor tensión", () => {
    const r = sim(false);
    expect(abs(r.Uload.T)).toBeGreaterThan(abs(r.Uload.S));
    expect(abs(r.Uload.S)).toBeGreaterThan(abs(r.Uload.R));
  });

  it("con neutro: tensiones fijas y I_N = jωC·U_S ≈ 1,1 A ∠ −60° (adelanta 90° a U_S)", () => {
    const r = solveStar({ ...base, U: sym, reactive: "capacitor", X: X_BANCO, neutral: true });
    expect(abs(r.Uload.R)).toBeCloseTo(221, 9);
    expect(within(abs(r.IN), 1.14, 0.06)).toBe(true);
    expect(Math.abs(arg(r.IN) - -60)).toBeLessThan(3);
    // en cuadratura con U_S: Re(U_S·I_N*) ≈ 0
    const q = r.Uload.S.re * r.IN.re + r.Uload.S.im * r.IN.im;
    expect(Math.abs(q)).toBeLessThan(1e-6);
  });
});

describe("método de Aron", () => {
  it("equilibrado: W1 ≈ W2 y W1 + W2 = potencia total", () => {
    const r = solveStar({ ...base, U: sym, neutral: true });
    expect(Math.abs(r.W1 - r.W2) / r.W1).toBeLessThan(1e-9);
    expect(r.WT).toBeCloseTo(r.PT, 6);
  });

  it("sin neutro es exacto aun desequilibrado (tres conductores)", () => {
    const r = solveStar({ ...base, reactive: "capacitor", neutral: false });
    expect(r.WT).toBeCloseTo(r.PT, 6);
  });

  it("con neutro y desequilibrio: WT = PT − Re(U_S·I_N*); con capacitor el error es nulo", () => {
    const r = solveStar({ ...base, U: sym, reactive: "capacitor", neutral: true });
    expect(r.WT).toBeCloseTo(r.PT, 6);
    // WT = PT − Re(U_S·I_N*) en general
    const x = r.Uload.S.re * r.IN.re + r.Uload.S.im * r.IN.im;
    expect(r.WT).toBeCloseTo(r.PT - x, 6);
  });

  it("con neutro y una componente de I_N en fase con U_S, Aron deja de valer", () => {
    // Tensión de la fase T 20 % alta: I_N tiene parte activa y WT ≠ PT.
    const r = solveStar({ ...base, U: { R: 221, S: 221, T: 265 }, neutral: true });
    expect(Math.abs(r.WT - r.PT)).toBeGreaterThan(5);
  });
});

describe("desequilibrio inductivo (pregunta c)", () => {
  it("invierte los papeles de R y T respecto del capacitor", () => {
    const cap = solveStar({ ...base, U: { R: 221, S: 221, T: 221 }, reactive: "capacitor" });
    const ind = solveStar({ ...base, U: { R: 221, S: 221, T: 221 }, reactive: "inductor" });
    expect(abs(cap.Uload.T)).toBeGreaterThan(abs(cap.Uload.R));
    expect(abs(ind.Uload.R)).toBeGreaterThan(abs(ind.Uload.T));
  });

  it("con neutro: |I_N| ≈ 1,1 A, atrasada 90° de U_S", () => {
    const ind = solveStar({ ...base, U: sym, reactive: "inductor", neutral: true });
    expect(within(abs(ind.IN), 1.1, 0.06)).toBe(true);
    const cap = solveStar({ ...base, U: sym, reactive: "capacitor", neutral: true });
    const d = arg(ind.IN) - arg(cap.IN);
    expect(Math.abs(Math.abs(d) - 180)).toBeLessThan(1);
  });
});

describe("datos transcriptos", () => {
  it("el banco de 16 µF tiene X_C ≈ 199 Ω", () => {
    expect(within(1 / (2 * Math.PI * 50 * C_BANCO_UF * 1e-6), X_BANCO, 0.01)).toBe(true);
    expect(capacitanceFor(X_BANCO) * 1e6).toBeCloseTo(C_BANCO_UF, 0);
    expect(inductanceFor(X_BANCO)).toBeCloseTo(0.633, 2);
  });

  it("W1 + W2 = WT en las cuatro filas", () => {
    for (const c of CASOS) expect(c.W1 + c.W2).toBe(c.WT);
  });

  it("los fasores de tensión del caso sin neutro reconstruyen la fuente (N' + U')", () => {
    const m = casoById("des-sn");
    const pol = (x: { mag: number; deg: number }) => ({
      re: x.mag * Math.cos((x.deg * Math.PI) / 180),
      im: x.mag * Math.sin((x.deg * Math.PI) / 180),
    });
    const un = pol(m.phasors.UN!);
    // U_R = U_N + U_R' debe quedar cerca de 221 V ∠ −30°
    const r = pol(m.phasors.U[0]);
    expect(within(Math.hypot(un.re + r.re, un.im + r.im), 221, 0.02)).toBe(true);
  });
});
