import { describe, expect, it } from "vitest";
import {
  analyze,
  loadCurrent,
  loadCurrentClean,
  simulate,
  thdV,
  voltageSamples,
  type GridVoltage,
} from "../harmonics-engine";
import { flukeModel } from "../fluke-view";
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
  tubosPreset,
  measuredReference,
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
    // 90° ideales + 5° de artefacto de medición con THD_V = 2,4 % (foto: +95°).
    expect(r.phi1Deg).toBeCloseTo(95, 1);
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

describe("THD con armónicas fuera del espectro graficado", () => {
  it("una 27.ª armónica de tensión (> orden 25) cuenta en el THD de una carga resistiva", () => {
    const grid: GridVoltage = {
      V1: 230,
      harmonics: [{ order: 27, relative: 0.1, phaseDeg: 0 }],
    };
    // Sin el ruido de la red: se prueba sólo el contenido armónico de la carga.
    const r = analyze(
      loadCurrentClean(buildLoad("halogena"), grid),
      voltageSamples(grid),
    );
    expect(r.thdI).toBeCloseTo(0.1, 3);
  });
});

describe("preselección de capacitor de los tubos", () => {
  it("una sola tolerancia para la pestaña y la referencia medida", () => {
    expect(tubosPreset(0)).toBe("none");
    expect(tubosPreset(TUBOS_C1_UF)).toBe("c1");
    expect(tubosPreset(15.8)).toBe("c2");
    expect(tubosPreset(11)).toBe("custom");
    expect(measuredReference("tubos", "mono", 15.8)?.id).toBe("CTC2");
  });
});

describe("flukeModel (vista analizador)", () => {
  const grid: GridVoltage = {
    V1: 230,
    harmonics: [{ order: 5, relative: 0.03, phaseDeg: 0 }],
  };
  const sim3 = simulate({
    grid,
    load: buildLoad("bajoConsumo", 0),
    connection: "trifasica",
  });
  const m = flukeModel(sim3);

  it("L2 y L3 son L1 desplazadas 120° y 240° en la fundamental", () => {
    const [l1, l2, l3] = m.phases;
    const d = (a: number, b: number) => {
      let x = a - b;
      while (x > 180) x -= 360;
      while (x <= -180) x += 360;
      return x;
    };
    expect(d(l2.angV, l1.angV)).toBeCloseTo(-120, 3);
    expect(d(l3.angV, l1.angV)).toBeCloseTo(-240 + 360, 3);
    expect(d(l2.angI, l1.angI)).toBeCloseTo(-120, 3);
  });

  it("una fase sin carga tiene corriente cero pero tensión presente", () => {
    const mono = flukeModel(
      simulate({ grid, load: buildLoad("bajoConsumo", 0), connection: "mono" }),
    );
    expect(mono.phases[1].loaded).toBe(false);
    expect(mono.phases[1].Irms).toBe(0);
    expect(mono.phases[1].Vrms).toBeGreaterThan(200);
    expect(mono.neutral.Irms).toBeCloseTo(mono.phases[0].Irms, 6);
  });

  it("la señal desplazada conserva el RMS", () => {
    const rms = (x: number[]) =>
      Math.sqrt(x.reduce((s, y) => s + y * y, 0) / x.length);
    expect(rms(m.phases[1].i)).toBeCloseTo(rms(m.phases[0].i), 6);
  });
});

describe("sin carga (corriente residual, BDEM)", () => {
  const dia: GridVoltage = {
    V1: 230.54,
    harmonics: [
      { order: 5, relative: 0.02, phaseDeg: 0 },
      { order: 7, relative: 0.013, phaseDeg: 0 },
    ],
  };
  const ideal = sine(230.54);
  const load = buildLoad("sinCarga");

  it("con la red del día reproduce I_RMS ≈ 17 mA, φ ≈ +5° y THD ≈ 65 % (BDEM)", () => {
    const r = analyze(loadCurrent(load, dia), voltageSamples(dia));
    expect(r.Irms).toBeCloseTo(0.017, 3);
    expect(r.phi1Deg).toBeCloseTo(5, 0);
    expect(r.thdI).toBeCloseTo(0.655, 1);
  });

  it("con red ideal no hay ruido: sin armónicas (en particular, nada en h11)", () => {
    const r = analyze(loadCurrent(load, ideal), voltageSamples(ideal));
    expect(r.thdI).toBeLessThan(1e-6);
    expect(r.spectrum[10]).toBeLessThan(1e-9);
    expect(r.I1).toBeCloseTo(0.0142, 3);
  });

  it("el ruido de la red es el mismo piso absoluto para toda carga (h11)", () => {
    const h11 = (key: Parameters<typeof buildLoad>[0]) =>
      analyze(loadCurrent(buildLoad(key), dia), voltageSamples(dia)).spectrum[10];
    const ref = h11("sinCarga");
    expect(ref).toBeGreaterThan(0.003);
    // Cargas lineales: el h11 es sólo ruido de la red, igual al de sin carga.
    for (const k of ["halogena", "bancoCapacitores"] as const)
      expect(h11(k)).toBeCloseTo(ref, 3);
  });

  it("halógena con la red del día: THD ≈ 4,5 % (AHM), no 2,4 %", () => {
    const r = analyze(loadCurrent(buildLoad("halogena"), dia), voltageSamples(dia));
    expect(r.thdI).toBeGreaterThan(0.035);
    expect(r.thdI).toBeLessThan(0.055);
  });

  it("la tensión sigue distorsionada y se ve en los canales V", () => {
    const m = flukeModel(simulate({ grid: dia, load, connection: "mono" }));
    expect(m.phases[0].thdV).toBeGreaterThan(0.02);
    expect(m.phases[0].Irms).toBeLessThan(0.03);
  });
});

describe("banco de capacitores: ángulo medido", () => {
  it("red ideal: φ = 90° exactos", () => {
    const r = run("bancoCapacitores", sine(BANCO_CAPACITORES_2026.V));
    expect(r.phi1Deg).toBeCloseTo(90, 3);
    expect(r.I1).toBeCloseTo(2.17, 3);
  });

  it("con el THD_V del día (2,4 %) reproduce φ ≈ +95° de la foto", () => {
    const grid: GridVoltage = {
      V1: BANCO_CAPACITORES_2026.V,
      harmonics: [{ order: 5, relative: 0.024, phaseDeg: 0 }],
    };
    expect(run("bancoCapacitores", grid).phi1Deg).toBeCloseTo(95, 1);
  });
});
