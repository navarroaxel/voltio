/**
 * Motor del TP4 (régimen poliarmónico). TypeScript puro, sin React.
 *
 * Simula en el dominio del tiempo la corriente que toma una carga cuando la
 * tensión de red tiene armónicas, y la analiza (DFT) para obtener I_RMS,
 * I₁, φ₁, THD_I y el espectro. También calcula la corriente de neutro de un
 * sistema trifásico de tres cargas idénticas.
 *
 * Convenciones (las mismas que el Fluke 435):
 *   - φ₁ = ángulo de la corriente fundamental respecto de la tensión
 *     fundamental; positivo = corriente ADELANTADA, negativo = ATRASADA.
 *   - Todas las magnitudes eléctricas son valores eficaces (RMS), salvo "peak".
 *   - Unidades SI (V, A, Ω, H, F).
 *
 * Los modelos de carga son simplificaciones: sólo son tan buenos como la
 * calibración contra las capturas medidas (ver `poliarmonicas-data.ts`).
 */

export const F_LINEA = 50;
export const OMEGA = 2 * Math.PI * F_LINEA;
/** Muestras por ciclo. Múltiplo de 3 para poder desfasar 120° por índice. */
export const SAMPLES_PER_CYCLE = 1536;
/** Ciclos simulados; se analiza el último (régimen permanente). */
export const CYCLES = 8;
export const MAX_ORDER = 25;
/** Tensión nominal usada para normalizar el flujo del transformador. */
export const V_NOMINAL = 230;

const DEG = Math.PI / 180;

function wrapDeg(a: number): number {
  let x = a;
  while (x > 180) x -= 360;
  while (x <= -180) x += 360;
  return x;
}
const SQRT2 = Math.SQRT2;

// ─── Tensión de red ──────────────────────────────────────────────────────────

export interface VoltageHarmonic {
  order: number;
  /** Amplitud relativa a la fundamental (0.024 = 2,4 % de V₁). */
  relative: number;
  /** Fase respecto de la fundamental, en grados. */
  phaseDeg: number;
}

export interface GridVoltage {
  /** Valor eficaz de la fundamental (V). */
  V1: number;
  harmonics: VoltageHarmonic[];
}

/** THD de tensión (fracción): √(Σ V_h²) / V₁. */
export function thdV(grid: GridVoltage): number {
  return Math.sqrt(
    grid.harmonics.reduce((s, h) => s + h.relative * h.relative, 0),
  );
}

function allVoltageHarmonics(grid: GridVoltage) {
  return [{ order: 1, relative: 1, phaseDeg: 0 }, ...grid.harmonics];
}

/** Muestras de v(t) durante `cycles` ciclos. */
export function voltageSamples(grid: GridVoltage, cycles = CYCLES): Float64Array {
  const total = cycles * SAMPLES_PER_CYCLE;
  const out = new Float64Array(total);
  const hs = allVoltageHarmonics(grid);
  for (let k = 0; k < total; k++) {
    const th = (2 * Math.PI * k) / SAMPLES_PER_CYCLE;
    let v = 0;
    for (const h of hs)
      v += h.relative * Math.sin(h.order * th + h.phaseDeg * DEG);
    out[k] = SQRT2 * grid.V1 * v;
  }
  return out;
}

// ─── Modelos de carga ────────────────────────────────────────────────────────

/**
 * Ruido de la red en la corriente medida (todas las cargas): líneas de igual
 * valor eficaz en armónicas altas NO múltiplo de 3 (así se anulan en el neutro
 * equilibrado). El espectro es una suposición: las capturas no lo tienen.
 */
const NOISE_ORDERS = [11, 13, 17, 19, 23, 25];
/**
 * Valor eficaz del ruido (A) por unidad de THD de tensión. Es un piso ABSOLUTO,
 * igual para toda carga. Calibrado con el trafo electrónico en vacío (BDEM:
 * ≈ 9,3 mA con THD_V = 2,4 %) y consistente con la halógena (AHM: THD_I 4,5 %
 * con I₁ = 0,27 A ⇒ ≈ 10 mA). El informe lo atribuye al ruido o a la red.
 */
export const GRID_NOISE_A_PER_THD = 0.388;

export type Load =
  /**
   * Sin carga: corriente residual. Fuga lineal R ∥ C (responde a la tensión
   * de la red como cualquier carga lineal). El ruido que domina su THD no es
   * propio de esta carga: es el ruido de la red (ver `GRID_NOISE_A_PER_THD`).
   */
  | { kind: "residual"; R: number; C: number }
  /** Resistiva pura (lámpara halógena). */
  | { kind: "resistive"; R: number }
  /** R-L serie con capacitor opcional en paralelo (tubos fluorescentes). */
  | { kind: "rl"; R: number; L: number; C: number }
  /**
   * Capacitor puro (banco de capacitores). La forma de onda es la ideal
   * (90° exactos, sin potencia activa). El Fluke midió 95° con una red
   * distorsionada (THD_V 2,4 %): artefacto de medición, no física del
   * capacitor, así que se aplica sólo al ángulo que muestra el analizador
   * (`phaseArtifactDeg`), en `phaseErrDegPerThd` grados por unidad de THD de
   * tensión (0° con red ideal). Calibrado con la captura.
   */
  | { kind: "capacitor"; C: number; phaseErrDegPerThd?: number }
  /** Puente rectificador + capacitor de filtro + carga (bajo consumo, LED). */
  | { kind: "rectifier"; C: number; RL: number; Rs: number }
  /**
   * Transformador en vacío: rama de magnetización saturable
   * i_m = a·λ + b·λⁿ (λ en p.u.) en paralelo con pérdidas en el hierro Rc.
   */
  | { kind: "magnetizing"; a: number; b: number; n: number; Rc: number };

/** Admitancia (parte real, imaginaria) de una carga lineal en la armónica h. */
function linearAdmittance(load: Load, h: number): [number, number] {
  const w = h * OMEGA;
  switch (load.kind) {
    case "resistive":
      return [1 / load.R, 0];
    case "residual":
      return [1 / load.R, w * load.C];
    case "capacitor":
      return [0, w * load.C];
    case "rl": {
      // Y = 1/(R + jX) + jωC
      const X = w * load.L;
      const d = load.R * load.R + X * X;
      return [load.R / d, -X / d + w * load.C];
    }
    default:
      throw new Error("not a linear load");
  }
}

/**
 * Corriente medida de una carga: la de la carga (`loadCurrentClean`) más el
 * ruido de la red, que es el mismo piso absoluto para toda carga y vale 0 con
 * red ideal.
 */
export function loadCurrent(
  load: Load,
  grid: GridVoltage,
  cycles = CYCLES,
): Float64Array {
  const out = loadCurrentClean(load, grid, cycles);
  const rms = GRID_NOISE_A_PER_THD * thdV(grid);
  if (rms <= 0) return out;
  const per = rms / Math.sqrt(NOISE_ORDERS.length);
  for (let k = 0; k < out.length; k++) {
    const th = (2 * Math.PI * k) / SAMPLES_PER_CYCLE;
    let n = 0;
    NOISE_ORDERS.forEach((o, j) => {
      n += Math.sin(o * th + j * 2.399963);
    });
    out[k] += SQRT2 * per * n;
  }
  return out;
}

/** Muestras de la corriente de una carga para la tensión dada (sin ruido). */
export function loadCurrentClean(
  load: Load,
  grid: GridVoltage,
  cycles = CYCLES,
): Float64Array {
  const total = cycles * SAMPLES_PER_CYCLE;
  const out = new Float64Array(total);
  const hs = allVoltageHarmonics(grid);

  if (
    load.kind === "resistive" ||
    load.kind === "rl" ||
    load.kind === "capacitor" ||
    load.kind === "residual"
  ) {
    // Carga lineal: se resuelve armónica por armónica (exacto).
    const terms = hs.map((h) => {
      const [g, b] = linearAdmittance(load, h.order);
      return {
        order: h.order,
        mag: grid.V1 * h.relative * Math.hypot(g, b),
        phase: h.phaseDeg * DEG + Math.atan2(b, g),
      };
    });
    for (let k = 0; k < total; k++) {
      const th = (2 * Math.PI * k) / SAMPLES_PER_CYCLE;
      let i = 0;
      for (const t of terms) i += t.mag * Math.sin(t.order * th + t.phase);
      out[k] = SQRT2 * i;
    }
    return out;
  }

  if (load.kind === "magnetizing") {
    // v = dλ/dt  ⇒  λ = Σ −(√2 V_h / hω)·cos(hωt + θ_h)  (sin media nula).
    const lamN = (SQRT2 * V_NOMINAL) / OMEGA;
    for (let k = 0; k < total; k++) {
      const th = (2 * Math.PI * k) / SAMPLES_PER_CYCLE;
      let lam = 0;
      let v = 0;
      for (const h of hs) {
        const arg = h.order * th + h.phaseDeg * DEG;
        lam -= (SQRT2 * grid.V1 * h.relative * Math.cos(arg)) / (h.order * OMEGA);
        v += SQRT2 * grid.V1 * h.relative * Math.sin(arg);
      }
      const lp = lam / lamN;
      const im =
        load.a * lp + load.b * Math.sign(lp) * Math.pow(Math.abs(lp), load.n);
      out[k] = im + v / load.Rc;
    }
    return out;
  }

  // Rectificador con capacitor de filtro (paso temporal, semi-implícito).
  const v = voltageSamples(grid, cycles);
  const dt = 1 / (F_LINEA * SAMPLES_PER_CYCLE);
  const g = load.C / dt;
  let vC = SQRT2 * grid.V1 * 0.9;
  for (let k = 0; k < total; k++) {
    const vin = Math.abs(v[k]);
    const vCc =
      (g * vC + vin / load.Rs) / (g + 1 / load.Rs + 1 / load.RL);
    if (vin > vCc) {
      vC = vCc;
      out[k] = Math.sign(v[k]) * ((vin - vCc) / load.Rs);
    } else {
      vC = (g * vC) / (g + 1 / load.RL);
      out[k] = 0;
    }
  }
  return out;
}

// ─── Análisis (DFT sobre un ciclo) ───────────────────────────────────────────

export interface Analysis {
  Irms: number;
  /** Fundamental (A RMS). */
  I1: number;
  /** Ángulo corriente−tensión de la fundamental (°). + adelanto, − atraso. */
  phi1Deg: number;
  /** THD de corriente (fracción). */
  thdI: number;
  /** RMS de cada armónica, índice 0 = orden 1, … hasta MAX_ORDER. */
  spectrum: number[];
  /** Fase absoluta de cada armónica (rad, sen-referida); índice 0 = orden 1. */
  phases: number[];
  /** Pico (A). */
  peak: number;
  /** Potencia activa (W) y aparente (VA) y factor de potencia. */
  P: number;
  S: number;
  pf: number;
}

function dft(x: ArrayLike<number>, start: number, order: number) {
  let a = 0;
  let b = 0;
  const N = SAMPLES_PER_CYCLE;
  for (let k = 0; k < N; k++) {
    const th = (2 * Math.PI * order * k) / N;
    a += x[start + k] * Math.sin(th);
    b += x[start + k] * Math.cos(th);
  }
  a *= 2 / N;
  b *= 2 / N;
  return { mag: Math.hypot(a, b) / SQRT2, phase: Math.atan2(b, a) };
}

/** Analiza el ÚLTIMO ciclo de una corriente y su tensión. */
export function analyze(i: ArrayLike<number>, v: ArrayLike<number>): Analysis {
  const N = SAMPLES_PER_CYCLE;
  const start = i.length - N;
  let sumI = 0;
  let sumI2 = 0;
  let sumV2 = 0;
  let sumP = 0;
  let peak = 0;
  for (let k = 0; k < N; k++) {
    const ik = i[start + k];
    const vk = v[start + k];
    sumI += ik;
    sumI2 += ik * ik;
    sumV2 += vk * vk;
    sumP += ik * vk;
    peak = Math.max(peak, Math.abs(ik));
  }
  const Irms = Math.sqrt(sumI2 / N);
  const Vrms = Math.sqrt(sumV2 / N);
  const P = sumP / N;
  const S = Vrms * Irms;

  const spectrum: number[] = [];
  const phases: number[] = [];
  let phaseI1 = 0;
  for (let h = 1; h <= MAX_ORDER; h++) {
    const d = dft(i, start, h);
    spectrum.push(d.mag);
    phases.push(d.phase);
    if (h === 1) phaseI1 = d.phase;
  }
  const phaseV1 = dft(v, start, 1).phase;
  let phi = (phaseI1 - phaseV1) / DEG;
  while (phi > 180) phi -= 360;
  while (phi <= -180) phi += 360;

  const I1 = spectrum[0];
  // Harmonic content from all sampled energy (not just the plotted orders
  // ≤ MAX_ORDER): I_RMS² = I_dc² + I₁² + Σ_{h≥2} I_h².
  const mean = sumI / N;
  const harm = Math.sqrt(Math.max(0, Irms * Irms - mean * mean - I1 * I1));
  return {
    Irms,
    I1,
    phi1Deg: phi,
    thdI: I1 > 1e-12 ? harm / I1 : 0,
    spectrum,
    phases,
    peak,
    P,
    S,
    pf: S > 1e-12 ? P / S : 0,
  };
}

// ─── Simulación completa (una fase + neutro) ─────────────────────────────────

export type Connection = "mono" | "bifasica" | "trifasica";

export interface SimInput {
  grid: GridVoltage;
  load: Load;
  connection: Connection;
}

export interface NeutralResult {
  Irms: number;
  /** Cociente I_N / I_fase (RMS). */
  ratio: number;
  /** RMS de cada armónica del neutro (índice 0 = orden 1). */
  spectrum: number[];
  /** Muestras de las dos últimas ciclos (A). */
  samples: number[];
}

/** Artefacto de medición del ángulo de I₁ (°): sólo afecta a lo que se muestra. */
export function phaseArtifactDeg(load: Load, grid: GridVoltage): number {
  return load.kind === "capacitor"
    ? (load.phaseErrDegPerThd ?? 0) * thdV(grid)
    : 0;
}

export interface SimResult {
  /** Dos últimos ciclos, tiempo en ms. */
  t: number[];
  v: number[];
  iPhase: number[];
  phase: Analysis;
  thdV: number;
  /** Tensión: RMS total. */
  Vrms: number;
  neutral: NeutralResult;
  /** Cantidad de fases con carga. */
  loadedPhases: number;
  /** Artefacto de medición a sumar al ángulo mostrado de la fundamental (°). */
  phaseArtifactDeg: number;
}

export function simulate(input: SimInput): SimResult {
  const { grid, load, connection } = input;
  const v = voltageSamples(grid);
  const iR = loadCurrent(load, grid);
  const art = phaseArtifactDeg(load, grid);
  const phaseIdeal = analyze(iR, v);
  const phase = {
    ...phaseIdeal,
    phi1Deg: wrapDeg(phaseIdeal.phi1Deg + art),
  };

  const loadedPhases =
    connection === "mono" ? 1 : connection === "bifasica" ? 2 : 3;
  const shift = SAMPLES_PER_CYCLE / 3;
  const total = iR.length;
  const iN = new Float64Array(total);
  for (let k = 0; k < total; k++) {
    let s = iR[k];
    if (loadedPhases >= 2) s += iR[(k - shift + total) % total];
    if (loadedPhases >= 3) s += iR[(k - 2 * shift + total) % total];
    iN[k] = s;
  }
  const nAnalysis = analyze(iN, v);

  const show = 2 * SAMPLES_PER_CYCLE;
  const from = total - show;
  const t: number[] = [];
  const vv: number[] = [];
  const ii: number[] = [];
  const nn: number[] = [];
  for (let k = 0; k < show; k++) {
    t.push((k / SAMPLES_PER_CYCLE) * (1000 / F_LINEA));
    vv.push(v[from + k]);
    ii.push(iR[from + k]);
    nn.push(iN[from + k]);
  }
  return {
    t,
    v: vv,
    iPhase: ii,
    phase,
    thdV: thdV(grid),
    Vrms: Math.sqrt(
      Array.from(v.slice(total - SAMPLES_PER_CYCLE)).reduce(
        (s, x) => s + x * x,
        0,
      ) / SAMPLES_PER_CYCLE,
    ),
    neutral: {
      Irms: nAnalysis.Irms,
      ratio: phase.Irms > 1e-12 ? nAnalysis.Irms / phase.Irms : 0,
      spectrum: nAnalysis.spectrum,
      samples: nn,
    },
    loadedPhases,
    phaseArtifactDeg: art,
  };
}
