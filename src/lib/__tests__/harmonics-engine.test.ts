import { describe, expect, it } from "vitest";
import {
  analyze,
  loadCurrent,
  simulate,
  thdV,
  voltageSamples,
  type GridVoltage,
} from "../harmonics-engine";
import {
  BANCO_CAPACITORES_2026,
  buildLoad,
  ENSAYOS,
  ensayoById,
  estimateThd,
  THD_MEASURED,
  neutralRatio,
  TUBOS_C1_UF,
  TUBOS_C2_UF,
} from "../poliarmonicas-data";

const sine = (V1: number): GridVoltage => ({ V1, harmonics: [] });

function run(key: Parameters<typeof buildLoad>[0], grid: GridVoltage, tubosC = 0) {
  const load = buildLoad(key, tubosC);
  return analyze(loadCurrent(load, grid), voltageSamples(grid));
}

describe("análisis (DFT)", () => {
  it("recupera RMS y THD de una tensión con armónicas conocidas", () => {
    const grid: GridVoltage = {
      V1: 230,
      harmonics: [{ order: 5, relative: 0.03, phaseDeg: 0 }],
    };
    const v = voltageSamples(grid);
    const a = analyze(v, v);
    expect(a.I1).toBeCloseTo(230, 1);
    expect(a.thdI).toBeCloseTo(0.03, 4);
    expect(thdV(grid)).toBeCloseTo(0.03, 10);
    expect(a.spectrum[4]).toBeCloseTo(230 * 0.03, 1);
  });
});

describe("cargas lineales (Parte A)", () => {
  it("halógena: en fase, sin armónicas, I = 0,270 A", () => {
    const r = run("halogena", sine(227.39));
    expect(r.Irms).toBeCloseTo(0.27, 3);
    expect(Math.abs(r.phi1Deg)).toBeLessThan(0.1);
    expect(r.thdI).toBeLessThan(1e-6);
    expect(r.pf).toBeCloseTo(1, 4);
  });

  it("tubos sin compensar: φ = −57° e I₁ = 0,818 A (ATM2)", () => {
    const r = run("tubos", sine(226.19));
    expect(r.phi1Deg).toBeCloseTo(-57, 1);
    expect(r.I1).toBeCloseTo(0.818, 3);
  });
});

/**
 * Los tubos se modelan como impedancia constante (R+jX medidos a 226,19 V).
 * Una lámpara con balasto se parece más a potencia constante, así que a
 * 229,6–230,5 V el modelo da ≈ 2 % más de corriente activa que la medida. Eso
 * mueve φ ≲ 1° e I₁ ≲ 3 %: las tolerancias reflejan esa limitación del modelo,
 * no un ajuste a los datos.
 */
describe("compensación de los tubos (Parte C)", () => {
  it("el capacitor de TC1 reproduce φ ≈ −16° e I₁ ≈ 0,461 A (CTC1M3)", () => {
    const r = run("tubos", sine(229.58), TUBOS_C1_UF);
    expect(Math.abs(r.phi1Deg - -16)).toBeLessThan(1);
    expect(Math.abs(r.I1 - 0.461) / 0.461).toBeLessThan(0.03);
  });

  it("el capacitor de TC2 reproduce φ ≈ +45° e I₁ ≈ 0,625 A (CTC2M3)", () => {
    const r = run("tubos", sine(230.45), TUBOS_C2_UF);
    expect(Math.abs(r.phi1Deg - 45)).toBeLessThan(1);
    expect(Math.abs(r.I1 - 0.625) / 0.625).toBeLessThan(0.03);
  });

  it("C₂ ≈ 2·C₁: coherente con un segundo capacitor en paralelo", () => {
    expect(TUBOS_C2_UF / TUBOS_C1_UF).toBeGreaterThan(1.9);
    expect(TUBOS_C2_UF / TUBOS_C1_UF).toBeLessThan(2.1);
  });
});

describe("cargas alineales calibradas (Parte B, tensión senoidal)", () => {
  it("bajo consumo: I_RMS 0,119 A, I₁ 0,090 A, φ +25° (BBCM2)", () => {
    const r = run("bajoConsumo", sine(227.3));
    expect(r.Irms).toBeCloseTo(0.119, 2);
    expect(r.I1).toBeCloseTo(0.09, 2);
    expect(r.phi1Deg).toBeGreaterThan(23);
    expect(r.phi1Deg).toBeLessThan(27);
  });

  it("LED: I_RMS 0,152 A, I₁ 0,083 A, φ +12° (BLM)", () => {
    const r = run("led", sine(227.54));
    expect(r.Irms).toBeCloseTo(0.152, 2);
    expect(r.I1).toBeCloseTo(0.083, 2);
    expect(r.phi1Deg).toBeGreaterThan(10);
    expect(r.phi1Deg).toBeLessThan(14);
  });

  it("trafo convencional en vacío: 0,076 A, φ −63° (BDCVM2)", () => {
    const r = run("trafoVacio", sine(227.2));
    expect(r.Irms).toBeCloseTo(0.076, 2);
    expect(r.I1).toBeCloseTo(0.071, 2);
    expect(r.phi1Deg).toBeGreaterThan(-65);
    expect(r.phi1Deg).toBeLessThan(-61);
  });
});

/**
 * Validación NO ajustada: la calibración sólo usa I_RMS, I₁ y φ de la lectura
 * monofásica. La corriente de neutro (que depende de la forma de onda, no de
 * esos tres números) se compara con la medida en los ensayos trifásicos.
 */
describe("corriente de neutro: simulado vs medido (sin ajustar)", () => {
  const cases: Array<[Parameters<typeof buildLoad>[0], number, string]> = [
    ["bajoConsumo", 227.4, "BBCB"],
    ["bajoConsumo", 227.4, "BBCT"],
    ["led", 227.54, "BLB"],
    ["led", 227.54, "BLT"],
  ];
  for (const [key, V1, id] of cases) {
    it(`${key} ${id}: I_N dentro de ±10 % de lo medido`, () => {
      const e = ensayoById(id)!;
      const sim = simulate({
        grid: sine(V1),
        load: buildLoad(key),
        connection: e.connection,
      });
      expect(Math.abs(sim.neutral.Irms - e.IN!) / e.IN!).toBeLessThan(0.1);
    });
  }

  it("halógena balanceada: neutro nulo; bifásica: neutro ≈ una fase", () => {
    const g = sine(227.1);
    const bal = simulate({ grid: g, load: buildLoad("halogena"), connection: "trifasica" });
    const two = simulate({ grid: g, load: buildLoad("halogena"), connection: "bifasica" });
    expect(bal.neutral.Irms).toBeLessThan(1e-9);
    expect(two.neutral.ratio).toBeCloseTo(1, 2);
  });

  it("con carga alineal balanceada el neutro supera a la fase", () => {
    const r = simulate({
      grid: sine(227.4),
      load: buildLoad("bajoConsumo"),
      connection: "trifasica",
    });
    expect(r.neutral.ratio).toBeGreaterThan(1.5);
    // En el neutro sólo sobreviven las armónicas múltiplos de 3.
    const sp = r.neutral.spectrum;
    expect(sp[0]).toBeLessThan(1e-6); // 1.ª
    expect(sp[1]).toBeLessThan(1e-6); // 2.ª
    expect(sp[2]).toBeGreaterThan(0.05); // 3.ª
  });
});

describe("efecto de la tensión de red sobre el capacitor", () => {
  it("I_h/I₁ = h·V_h/V₁: 2,4 % de 5.ª ⇒ THD_I ≈ 12 %", () => {
    const grid: GridVoltage = {
      V1: BANCO_CAPACITORES_2026.V,
      harmonics: [{ order: 5, relative: 0.024, phaseDeg: 0 }],
    };
    const r = run("bancoCapacitores", grid);
    expect(r.thdI).toBeCloseTo(5 * 0.024, 3);
    expect(r.phi1Deg).toBeCloseTo(90, 1);
  });

  it("con tensión senoidal el capacitor toma I₁ = 2,17 A y no distorsiona", () => {
    const r = run("bancoCapacitores", sine(BANCO_CAPACITORES_2026.V));
    expect(r.I1).toBeCloseTo(BANCO_CAPACITORES_2026.I1, 3);
    expect(r.thdI).toBeLessThan(1e-6);
  });
});

describe("datos medidos", () => {
  it("todas las capturas referenciadas existen en el catálogo (42)", () => {
    const files = ENSAYOS.flatMap((e) => e.captures.map((c) => c.file));
    expect(new Set(files).size).toBe(files.length);
    expect(files.length).toBe(42);
  });

  it("THD estimado del bajo consumo ≈ 87 % y del LED ≈ 153 %", () => {
    const bc = ensayoById("BBCM")!;
    const led = ensayoById("BLM")!;
    expect(estimateThd(bc.I[0], bc.I1)!).toBeCloseTo(0.87, 1);
    expect(estimateThd(led.I[0], led.I1)!).toBeCloseTo(1.53, 1);
  });

  it("estimateThd devuelve null sin I₁ y 0 si I_RMS ≤ I₁", () => {
    expect(estimateThd(1, null)).toBeNull();
    expect(estimateThd(0.27, 0.27)).toBe(0);
  });

  it("no estima el THD con corrientes en el piso de resolución (trafo electrónico, 0,017 A)", () => {
    const e = ensayoById("BDEM")!;
    expect(estimateThd(e.I[0], e.I1)).toBeNull();
  });

  it("relación de neutro medida: BC 1,65 y LED 1,70 (trifásico balanceado)", () => {
    expect(neutralRatio(ensayoById("BBCT")!)!).toBeCloseTo(1.65, 1);
    expect(neutralRatio(ensayoById("BLT")!)!).toBeCloseTo(1.7, 1);
  });
});

describe("THD medido (registro de un compañero)", () => {
  it("cada THD medido corresponde a un ensayo existente", () => {
    for (const id of Object.keys(THD_MEASURED)) {
      expect(ensayoById(id), id).toBeDefined();
    }
  });

  it("las cargas lineales dan THD de pocos puntos y las alineales mucho más", () => {
    for (const id of ["AHM", "AHB", "AHT", "ADCM"])
      expect(THD_MEASURED[id].pct).toBeLessThan(5);
    for (const id of ["BDCVM", "BBCM", "BBCT", "BLM"])
      expect(THD_MEASURED[id].pct).toBeGreaterThan(50);
  });

  it("BBCB anotado con comillas = BBCM; BLB/BLT = BLM", () => {
    expect(THD_MEASURED.BBCB.pct).toBe(THD_MEASURED.BBCM.pct);
    expect(THD_MEASURED.BLB.pct).toBe(THD_MEASURED.BLM.pct);
    expect(THD_MEASURED.BLT.pct).toBe(THD_MEASURED.BLM.pct);
    expect(THD_MEASURED.BBCB.note).toBe("idem");
  });

  it("los valores dudosos llevan su advertencia", () => {
    expect(THD_MEASURED.BDEM.note).toBe("noise");
    expect(THD_MEASURED.CTC1.note).toBe("mapping");
  });

  it("no inventa THD para ensayos sin dato (TC2)", () => {
    expect(THD_MEASURED.CTC2).toBeUndefined();
    expect(ENSAYOS.filter((e) => !(e.id in THD_MEASURED)).map((e) => e.id)).toEqual(["CTC2"]);
  });
});
