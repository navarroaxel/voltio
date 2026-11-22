/**
 * Vista "analizador de calidad de energía" (estilo Fluke 435) del simulador del
 * TP4. Capa pura sobre `harmonics-engine`: toma el resultado de `simulate` y
 * arma los canales L1/L2/L3/N (formas de onda, fasores de la fundamental y
 * espectros con fase) que dibuja la pantalla. No calcula física nueva: las
 * fases L2/L3 son copias desplazadas 120°/240° de L1 (carga equilibrada o
 * desconectada), igual que el neutro del motor.
 */
import {
  analyze,
  SAMPLES_PER_CYCLE,
  type Analysis,
  type SimResult,
} from "./harmonics-engine";

export type FlukeChannelId = "L1" | "L2" | "L3" | "N";
export const FLUKE_PHASES = ["L1", "L2", "L3"] as const;

const DEG = Math.PI / 180;
const N = SAMPLES_PER_CYCLE;

export interface FlukePhase {
  id: "L1" | "L2" | "L3";
  /** ¿Tiene carga conectada? (si no, la corriente es cero). */
  loaded: boolean;
  /** Tensión y corriente, dos ciclos. */
  v: number[];
  i: number[];
  Vrms: number;
  Irms: number;
  /** Fundamental (RMS) y ángulo respecto de V_L1 (°). */
  V1: number;
  I1: number;
  angV: number;
  angI: number;
  thdV: number;
  thdI: number;
  /** RMS por armónica (índice 0 = orden 1) y fase relativa a V_L1 (°). */
  spectrumV: number[];
  spectrumI: number[];
  angHarmV: number[];
  angHarmI: number[];
  P: number;
  S: number;
  pf: number;
  peakI: number;
}

export interface FlukeNeutral {
  i: number[];
  Irms: number;
  I1: number;
  angI: number;
  spectrum: number[];
  angHarm: number[];
  /** THD del neutro (fracción); NaN si no hay fundamental. */
  thd: number;
  peak: number;
}

export interface FlukeModel {
  t: number[];
  phases: FlukePhase[];
  neutral: FlukeNeutral;
  Ptotal: number;
  Stotal: number;
  pfTotal: number;
}

/** Desplaza una señal periódica (2 ciclos) `k` muestras hacia atrás. */
function shiftSignal(x: ArrayLike<number>, k: number): number[] {
  const len = x.length;
  const out = new Array<number>(len);
  for (let n = 0; n < len; n++) out[n] = x[(((n - k) % N) + N) % N + (len - N)];
  return out;
}

function wrap180(a: number): number {
  let x = a;
  while (x > 180) x -= 360;
  while (x <= -180) x += 360;
  return x;
}

export function flukeModel(sim: SimResult): FlukeModel {
  const vAn = analyze(sim.v, sim.v);
  const refPhase = vAn.phases[0];

  const rel = (phaseRad: number, order: number, shiftDeg: number) =>
    wrap180((phaseRad - order * refPhase) / DEG - order * shiftDeg);

  const phases: FlukePhase[] = FLUKE_PHASES.map((id, idx) => {
    const loaded = idx < sim.loadedPhases;
    const shiftDeg = idx * 120;
    const shiftN = idx * (N / 3);
    const v = idx === 0 ? sim.v : shiftSignal(sim.v, shiftN);
    const i = loaded
      ? idx === 0
        ? sim.iPhase
        : shiftSignal(sim.iPhase, shiftN)
      : sim.iPhase.map(() => 0);
    const iAn: Analysis = sim.phase;
    const m = loaded ? 1 : 0;
    return {
      id,
      loaded,
      v,
      i,
      Vrms: sim.Vrms,
      Irms: iAn.Irms * m,
      V1: vAn.spectrum[0],
      I1: iAn.I1 * m,
      angV: rel(vAn.phases[0], 1, shiftDeg),
      angI: rel(iAn.phases[0], 1, shiftDeg),
      thdV: sim.thdV,
      thdI: iAn.thdI * m,
      spectrumV: vAn.spectrum,
      spectrumI: iAn.spectrum.map((x) => x * m),
      angHarmV: vAn.phases.map((p, k) => rel(p, k + 1, shiftDeg)),
      angHarmI: iAn.phases.map((p, k) => rel(p, k + 1, shiftDeg)),
      P: iAn.P * m,
      S: iAn.S * m,
      pf: iAn.pf * m,
      peakI: iAn.peak * m,
    };
  });

  const nAn = analyze(sim.neutral.samples, sim.v);
  const harm = Math.sqrt(
    Math.max(0, sim.neutral.Irms ** 2 - nAn.I1 ** 2),
  );
  const neutral: FlukeNeutral = {
    i: sim.neutral.samples,
    Irms: sim.neutral.Irms,
    I1: nAn.I1,
    angI: rel(nAn.phases[0], 1, 0),
    spectrum: nAn.spectrum,
    angHarm: nAn.phases.map((p, k) => rel(p, k + 1, 0)),
    // Indefinido (NaN → "—") si la fundamental del neutro es nula (carga equilibrada).
    thd: nAn.I1 > 1e-6 ? harm / nAn.I1 : NaN,
    peak: nAn.peak,
  };

  const Ptotal = phases.reduce((s, p) => s + p.P, 0);
  const Stotal = phases.reduce((s, p) => s + p.S, 0);
  return {
    t: sim.t,
    phases,
    neutral,
    Ptotal,
    Stotal,
    pfTotal: Stotal > 1e-9 ? Ptotal / Stotal : 0,
  };
}
