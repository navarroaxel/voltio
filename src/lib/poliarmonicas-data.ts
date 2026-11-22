/**
 * Datos del TP4 (poliarmónicas): lecturas transcriptas de las capturas del
 * Fluke 435 del laboratorio (09/11/2017, carpeta `public/poliarmonicas/
 * capturas/`) y parámetros de los modelos de carga del simulador.
 *
 * Qué es medido y qué no:
 *   - `ENSAYOS`: lecturas del encabezado/pantalla de cada captura. Son
 *     medidas. Un `null` significa "no se lee en ninguna captura".
 *   - No existe espectro de armónicos (ni tablas de armónicos) en las
 *     capturas: el THD de cada ensayo es una ESTIMACIÓN a partir de
 *     I_RMS e I₁ de la misma pantalla (`estimateThd`).
 *   - Los modelos de carga son simplificaciones calibradas con estas
 *     lecturas (ver `scripts/calibrate-harmonics.mjs`). Lo que se simula
 *     nunca debe presentarse como medido.
 */

import {
  GRID_NOISE_A_PER_THD,
  OMEGA,
  type GridVoltage,
  type Load,
} from "./harmonics-engine";

// ─── Ensayos medidos ─────────────────────────────────────────────────────────

export type Part = "A" | "B" | "C";
export type EnsayoConnection = "mono" | "bifasica" | "trifasica";
export type CaptureKind = "osc-ui" | "osc-fases" | "osc-neutro" | "fasorial";

export interface Capture {
  /** Nombre de archivo sin extensión (== código de la cátedra). */
  file: string;
  kind: CaptureKind;
}

export interface Ensayo {
  /** Código sin número de captura, p. ej. "AHM". */
  id: string;
  part: Part;
  connection: EnsayoConnection;
  captures: Capture[];
  /** Tensión (V RMS) del encabezado de la captura; null si no se lee. */
  U: number | null;
  /** Corrientes RMS de L1, L2, L3 (A); null si la fase no se mide. */
  I: [number, number | null, number | null];
  /** Fundamental de L1 (A) del fasorial; null si no se lee. */
  I1: number | null;
  /** Ángulo corriente−tensión de L1 (°); + adelanto, − atraso. */
  phiDeg: number | null;
  /** Corriente de neutro (A); null si no se lee. */
  IN: number | null;
}

const c = (file: string, kind: CaptureKind): Capture => ({ file, kind });

export const ENSAYOS: Ensayo[] = [
  // ── Parte A: cargas lineales ──
  {
    id: "AHM", part: "A", connection: "mono",
    captures: [c("AHM1", "osc-ui"), c("AHM2", "osc-fases"), c("AHM3", "fasorial")],
    U: 227.39, I: [0.27, 0.001, 0.002], I1: 0.27, phiDeg: 2, IN: 0.277,
  },
  {
    id: "AHB", part: "A", connection: "bifasica",
    captures: [c("AHB1", "osc-fases"), c("AHB2", "fasorial")],
    U: null, I: [0.27, 0.258, 0.002], I1: 0.27, phiDeg: 2, IN: 0.264,
  },
  {
    id: "AHT", part: "A", connection: "trifasica",
    captures: [c("AHT1", "osc-fases"), c("AHT2", "fasorial")],
    U: null, I: [0.27, 0.257, 0.262], I1: 0.27, phiDeg: 2, IN: 0.015,
  },
  {
    id: "ATM", part: "A", connection: "mono",
    captures: [c("ATM1", "osc-ui"), c("ATM2", "fasorial")],
    U: 226.19, I: [0.823, null, null], I1: 0.818, phiDeg: -57, IN: null,
  },
  {
    id: "ADCM", part: "A", connection: "mono",
    captures: [c("ADCM1", "osc-ui"), c("ADCM2", "fasorial")],
    U: 226.94, I: [0.263, null, null], I1: 0.263, phiDeg: -7, IN: null,
  },
  // ── Parte B: cargas alineales ──
  {
    id: "BDCVM", part: "B", connection: "mono",
    captures: [c("BDCVM1", "osc-ui"), c("BDCVM2", "fasorial")],
    U: 227.11, I: [0.076, null, null], I1: 0.071, phiDeg: -63, IN: null,
  },
  {
    id: "BDEM", part: "B", connection: "mono",
    captures: [c("BDEM1", "osc-ui"), c("BDEM2", "osc-fases"), c("BDEM3", "fasorial")],
    U: 230.54, I: [0.017, 0.001, 0.002], I1: 0.017, phiDeg: 5, IN: 0.018,
  },
  {
    id: "BBCM", part: "B", connection: "mono",
    captures: [c("BBCM1", "osc-ui"), c("BBCM2", "fasorial")],
    U: 227.39, I: [0.119, null, null], I1: 0.09, phiDeg: 25, IN: null,
  },
  {
    id: "BBCB", part: "B", connection: "bifasica",
    captures: [c("BBCB1", "osc-fases"), c("BBCB2", "osc-neutro"), c("BBCB3", "fasorial")],
    U: 227.44, I: [0.125, 0.112, 0.002], I1: null, phiDeg: null, IN: 0.166,
  },
  {
    id: "BBCT", part: "B", connection: "trifasica",
    captures: [c("BBCT1", "osc-neutro"), c("BBCT2", "osc-fases"), c("BBCT3", "fasorial")],
    U: 227.4, I: [0.125, 0.115, 0.115], I1: null, phiDeg: null, IN: 0.206,
  },
  {
    id: "BLM", part: "B", connection: "mono",
    captures: [c("BLM1", "osc-ui"), c("BLM2", "osc-fases"), c("BLM3", "fasorial")],
    U: 227.54, I: [0.152, 0.001, 0.002], I1: 0.083, phiDeg: 12, IN: 0.159,
  },
  {
    id: "BLB", part: "B", connection: "bifasica",
    captures: [c("BLB1", "osc-fases"), c("BLB2", "osc-neutro"), c("BLB3", "fasorial")],
    U: null, I: [0.149, 0.133, 0.002], I1: 0.083, phiDeg: 12, IN: 0.205,
  },
  {
    id: "BLT", part: "B", connection: "trifasica",
    captures: [c("BLT1", "osc-fases"), c("BLT2", "osc-neutro"), c("BLT3", "fasorial")],
    U: null, I: [0.152, 0.133, 0.148], I1: 0.082, phiDeg: 12, IN: 0.259,
  },
  // ── Parte C: cargas mixtas ──
  {
    id: "CTC1", part: "C", connection: "mono",
    captures: [c("CTC1M1", "osc-ui"), c("CTC1M2", "osc-fases"), c("CTC1M3", "fasorial")],
    U: 229.58, I: [0.479, 0.001, 0.002], I1: 0.461, phiDeg: -16, IN: 0.5,
  },
  {
    id: "CTC2", part: "C", connection: "mono",
    captures: [c("CTC2M1", "osc-ui"), c("CTC2M2", "osc-fases"), c("CTC2M3", "fasorial")],
    U: 230.45, I: [0.653, 0.001, 0.002], I1: 0.625, phiDeg: 45, IN: 0.694,
  },
  {
    id: "CTCL", part: "C", connection: "mono",
    captures: [c("CTCLM1", "osc-ui"), c("CTCLM2", "osc-fases"), c("CTCLM3", "fasorial")],
    U: 229.24, I: [1.012, 0.003, 0.003], I1: 0.959, phiDeg: -46, IN: 1.043,
  },
];

export function ensayoById(id: string): Ensayo | undefined {
  return ENSAYOS.find((e) => e.id === id);
}

/**
 * THD_I MEDIDO por el analizador, registrado a mano por un compañero durante el
 * laboratorio (no figura en las capturas del profesor). Sólo se conocen el THD
 * y, a veces, los órdenes de armónica dominantes: no hay el espectro completo.
 *
 * `note`:
 *   - "idem": anotado como «idem»/comillas (igual al ensayo monofásico);
 *   - "noise": trafo electrónico en vacío: no toma corriente, el valor es ruido;
 *   - "mapping": correspondencia supuesta con el ensayo (la anotación dice
 *     «compensado», sin distinguir TC1 de TC2).
 */
export interface ThdMeasured {
  pct: number;
  orders: number[] | null;
  note: "idem" | "noise" | "mapping" | null;
}

export const THD_MEASURED: Record<string, ThdMeasured> = {
  AHM: { pct: 4.5, orders: [3, 5], note: null },
  AHB: { pct: 4.7, orders: [3, 5, 7], note: null },
  AHT: { pct: 4.6, orders: null, note: null },
  ATM: { pct: 10.9, orders: [3, 5, 7, 9, 11], note: null },
  ADCM: { pct: 4.6, orders: [3, 5], note: null },
  BDCVM: { pct: 55.3, orders: [3, 5, 7, 9], note: null },
  BDEM: { pct: 65.5, orders: null, note: "noise" },
  BBCM: { pct: 77.2, orders: [3, 5, 7, 9], note: null },
  BBCB: { pct: 77.2, orders: null, note: "idem" },
  BBCT: { pct: 77.8, orders: null, note: null },
  BLM: { pct: 93.8, orders: [3, 5, 7, 9], note: null },
  BLB: { pct: 93.8, orders: null, note: "idem" },
  BLT: { pct: 93.8, orders: null, note: "idem" },
  CTC1: { pct: 23.7, orders: null, note: "mapping" },
  CTCL: { pct: 22.2, orders: null, note: null },
};

/**
 * THD_I estimado (fracción) = √(I_RMS² − I₁²)/I₁ con ambos valores de la misma
 * pantalla. null si falta I₁. Resolución de 3 dígitos ⇒ sólo orientativo.
 */
/** Por debajo de esta corriente (A) la resolución de 3 dígitos del Fluke hace inútil el cociente. */
const ESTIMATE_MIN_CURRENT = 0.03;

export function estimateThd(irms: number, i1: number | null): number | null {
  if (i1 === null || i1 <= 0) return null;
  if (irms < ESTIMATE_MIN_CURRENT) return null;
  const d = irms * irms - i1 * i1;
  return d > 0 ? Math.sqrt(d) / i1 : 0;
}

/** I_N / I_L1; null si no hay neutro leído. */
export function neutralRatio(e: Ensayo): number | null {
  return e.IN === null || e.I[0] <= 0 ? null : e.IN / e.I[0];
}

// ─── Datos de la sesión de 2026 (fotos, Fluke 430 Serie II) ─────────────────

/**
 * Banco de capacitores (foto del Fluke, 19/11/26). Sólo se usa para calibrar
 * el modelo del capacitor y como referencia del efecto de la red.
 * El THD de tensión (2,4 %) lo informó el propio analizador; el reparto
 * entre 5.ª y 7.ª armónica NO se midió.
 */
export const BANCO_CAPACITORES_2026 = {
  V: 219.3,
  Irms: 2.19,
  I1: 2.17,
  /** φ(A-V) del fasorial: +95° (adelanto). Un capacitor ideal da 90°. */
  phiDeg: 95,
  thdVPct: 2.4,
};

// ─── Modelos de carga (parámetros) ──────────────────────────────────────────

export type LoadKey =
  | "sinCarga"
  | "halogena"
  | "tubos"
  | "bajoConsumo"
  | "led"
  | "trafoVacio"
  | "bancoCapacitores";

export const LOAD_KEYS: LoadKey[] = [
  "sinCarga",
  "halogena",
  "tubos",
  "bajoConsumo",
  "led",
  "trafoVacio",
  "bancoCapacitores",
];

const HALOGENA = ensayoById("AHM")!;
// Resistencia: R = U / I (AHM1: 227,39 V; 0,270 A).
const R_HALOGENA = (HALOGENA.U as number) / HALOGENA.I[0];

// Tubos sin compensar (ATM2): Z₁ = U/I₁, φ = −57° ⇒ R + jX serie.
const ATM = ensayoById("ATM")!;
const U_TUBOS = ATM.U as number; // ATM2: 226,19 V
const Z_TUBOS = U_TUBOS / ATM.I1!;
const PHI_TUBOS = ((ATM.phiDeg as number) * Math.PI) / 180;
const R_TUBOS = Z_TUBOS * Math.cos(PHI_TUBOS);
const L_TUBOS = (Z_TUBOS * Math.sin(-PHI_TUBOS)) / OMEGA;

/**
 * Capacitor que lleva los tubos al ángulo medido en cada ensayo compensado:
 * I_C = I_q,tubos(U) + I₁·sin φ  ⇒  C = I_C /(U·ω).
 * (la reactiva de los tubos se escala linealmente con U.)
 */
function capacitorForTarget(target: Ensayo): number {
  const u = target.U as number;
  const iqTubos = ATM.I1! * Math.sin(-PHI_TUBOS) * (u / U_TUBOS);
  const phi = ((target.phiDeg as number) * Math.PI) / 180;
  const ic = iqTubos + target.I1! * Math.sin(phi);
  return ic / (u * OMEGA);
}

/** Capacitores equivalentes de las dos condiciones compensadas (µF). */
export const TUBOS_C1_UF = capacitorForTarget(ensayoById("CTC1")!) * 1e6;
export const TUBOS_C2_UF = capacitorForTarget(ensayoById("CTC2")!) * 1e6;

/** The slider moves in 0,1 µF steps, so a value within half a step of a preset is that preset. */
const TUBOS_PRESET_TOL_UF = 0.05;

export type TubosPreset = "none" | "c1" | "c2" | "custom";

/** Which measured tube configuration a capacitor value corresponds to (if any). */
export function tubosPreset(cuF: number): TubosPreset {
  if (cuF === 0) return "none";
  if (Math.abs(cuF - TUBOS_C1_UF) < TUBOS_PRESET_TOL_UF) return "c1";
  if (Math.abs(cuF - TUBOS_C2_UF) < TUBOS_PRESET_TOL_UF) return "c2";
  return "custom";
}
export const TUBOS_C_MAX_UF = 20;

/**
 * Los capacitores (banco y compensación de los tubos) sólo se ensayaron
 * conectados en la fase R (L1): con ellos el simulador es monofásico.
 */
export function capacitorsOnlyInR(key: LoadKey, tubosCuF: number): boolean {
  return key === "bancoCapacitores" || (key === "tubos" && tubosCuF > 0);
}

// Banco de capacitores: X_C = U/I₁ (foto de 2026).
const C_BANCO =
  BANCO_CAPACITORES_2026.I1 / (BANCO_CAPACITORES_2026.V * OMEGA);

/**
 * Sin carga = lo que midió el Fluke con el trafo electrónico en vacío (BDEM):
 * I_RMS = 0,017 A, THD ≈ 65,5 % (el informe lo atribuye a ruido), φ = +5°.
 * Ese THD sale casi todo del ruido de la red (`GRID_NOISE_A_PER_THD`, ≈ 9,3 mA
 * con THD_V = 2,4 %, igual para toda carga); la fuga R ∥ C aporta el resto:
 * I₁ = √(I_RMS² − I_ruido²) ≈ 14 mA y φ = +5°. (La lectura I₁ = 0,017 A del
 * informe está al límite de la resolución y no es compatible con ese THD; se
 * respetan I_RMS y THD. El THD_V de 2017 no se registró: se supone 2,4 %.)
 */
const BDEM_REF = ensayoById("BDEM")!;
const RESIDUAL = (() => {
  const U = BDEM_REF.U as number;
  const noise = GRID_NOISE_A_PER_THD * (BANCO_CAPACITORES_2026.thdVPct / 100);
  const I1 = Math.sqrt(BDEM_REF.I[0] ** 2 - noise ** 2);
  const Y = I1 / U;
  const phi = ((BDEM_REF.phiDeg as number) * Math.PI) / 180;
  return { R: 1 / (Y * Math.cos(phi)), C: (Y * Math.sin(phi)) / OMEGA };
})();

/** Parámetros ajustados con scripts/calibrate-harmonics.mjs (ver allí). */
const RECT_BC = { C: 3.567e-6, RL: 3912, Rs: 75.0 };
const RECT_LED = { C: 15.88e-6, RL: 5139, Rs: 19.0 };
const TRAFO = { a: 0.02926, b: 0.1207, n: 7, Rc: 7049 };

/** Carga del simulador. `tubosCuF` sólo aplica a "tubos". */
export function buildLoad(key: LoadKey, tubosCuF = 0): Load {
  switch (key) {
    case "sinCarga":
      return { kind: "residual", ...RESIDUAL };
    case "halogena":
      return { kind: "resistive", R: R_HALOGENA };
    case "tubos":
      return { kind: "rl", R: R_TUBOS, L: L_TUBOS, C: tubosCuF * 1e-6 };
    case "bajoConsumo":
      return { kind: "rectifier", ...RECT_BC };
    case "led":
      return { kind: "rectifier", ...RECT_LED };
    case "trafoVacio":
      return { kind: "magnetizing", ...TRAFO };
    case "bancoCapacitores":
      return {
        kind: "capacitor",
        C: C_BANCO,
        // 5° de más sobre los 90° ideales con THD_V = 2,4 %: proporcional a la
        // distorsión de la red (0° con red ideal).
        phaseErrDegPerThd:
          (BANCO_CAPACITORES_2026.phiDeg - 90) /
          (BANCO_CAPACITORES_2026.thdVPct / 100),
      };
  }
}

/** Qué ensayo medido corresponde a cada configuración del simulador. */
export function measuredReference(
  key: LoadKey,
  connection: EnsayoConnection,
  tubosCuF: number,
): Ensayo | null {
  const trio = (m: string, b: string, t: string) =>
    ensayoById(connection === "mono" ? m : connection === "bifasica" ? b : t) ?? null;
  switch (key) {
    case "sinCarga":
      // La corriente residual está calibrada con el trafo electrónico en vacío.
      return connection === "mono" ? (ensayoById("BDEM") ?? null) : null;
    case "halogena":
      return trio("AHM", "AHB", "AHT");
    case "bajoConsumo":
      return trio("BBCM", "BBCB", "BBCT");
    case "led":
      return trio("BLM", "BLB", "BLT");
    case "tubos":
      if (connection !== "mono") return null;
      switch (tubosPreset(tubosCuF)) {
        case "none":
          return ensayoById("ATM") ?? null;
        case "c1":
          return ensayoById("CTC1") ?? null;
        case "c2":
          return ensayoById("CTC2") ?? null;
        default:
          return null;
      }
    case "trafoVacio":
      return connection === "mono" ? (ensayoById("BDCVM") ?? null) : null;
    case "bancoCapacitores":
      return null; // sólo hay la foto de 2026, sin código de ensayo
  }
}

// ─── Presets de tensión de red ───────────────────────────────────────────────

export interface GridSettings {
  V1: number;
  /** Armónicas de tensión en % de la fundamental. */
  v3: number;
  v5: number;
  v7: number;
  /** Fase común de las armónicas (°). */
  theta: number;
}

export const GRID_PRESETS: Record<"ideal" | "dia" | "distorsionada", GridSettings> = {
  ideal: { V1: 230, v3: 0, v5: 0, v7: 0, theta: 0 },
  // THD_V = 2,4 % (informado por el Fluke); el reparto 5.ª/7.ª es supuesto.
  dia: { V1: 219.3, v3: 0, v5: 2.0, v7: 1.3, theta: 0 },
  distorsionada: { V1: 230, v3: 3, v5: 5, v7: 3, theta: 0 },
};

/** Convierte los sliders (% de armónicas) en la tensión del motor. */
export function gridFromSettings(g: GridSettings): GridVoltage {
  const harmonics = [
    { order: 3, relative: g.v3 / 100, phaseDeg: g.theta },
    { order: 5, relative: g.v5 / 100, phaseDeg: g.theta },
    { order: 7, relative: g.v7 / 100, phaseDeg: g.theta },
  ].filter((h) => h.relative > 0);
  return { V1: g.V1, harmonics };
}
