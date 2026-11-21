/**
 * Three-phase star load (TP3 "Circuitos trifásicos"), steady state.
 *
 * Source: three phase voltages U_R, U_S, U_T with magnitudes given and
 * angles −30°, −150°, +90° (same reference as the lab report: U_RS on the
 * 0° axis, sequence R-S-T). Load: a resistance R per phase and, optionally,
 * a pure reactance in phase S (capacitor or inductor) in parallel with its
 * resistance. The neutral is either solidly connected (zero impedance) or
 * open.
 *
 * Pure TypeScript, no React. Angles are degrees, impedances ohms.
 */

export interface Complex {
  re: number;
  im: number;
}

export const c = (re: number, im = 0): Complex => ({ re, im });
export const add = (a: Complex, b: Complex): Complex => c(a.re + b.re, a.im + b.im);
export const sub = (a: Complex, b: Complex): Complex => c(a.re - b.re, a.im - b.im);
export const mul = (a: Complex, b: Complex): Complex =>
  c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const div = (a: Complex, b: Complex): Complex => {
  const d = b.re * b.re + b.im * b.im;
  return c((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
};
export const conj = (a: Complex): Complex => c(a.re, -a.im);
export const abs = (a: Complex): number => Math.hypot(a.re, a.im);
export const arg = (a: Complex): number => (Math.atan2(a.im, a.re) * 180) / Math.PI;
export const polar = (mag: number, deg: number): Complex =>
  c(mag * Math.cos((deg * Math.PI) / 180), mag * Math.sin((deg * Math.PI) / 180));

export const F_LINEA = 50; // Hz
export const OMEGA = 2 * Math.PI * F_LINEA;

/** Phase angles of the source with U_RS as the 0° reference. */
export const SOURCE_ANGLES = { R: -30, S: -150, T: 90 } as const;

export type Phase = "R" | "S" | "T";
export const PHASES: Phase[] = ["R", "S", "T"];

export type ReactiveKind = "none" | "capacitor" | "inductor";

export interface StarInput {
  /** Source phase voltage magnitudes [V] (the real network is slightly asymmetric). */
  U: { R: number; S: number; T: number };
  /** Resistance per phase [Ω]. */
  R: number;
  /** Pure reactance added in parallel with the resistance of phase S. */
  reactive: ReactiveKind;
  /** |X| of that element [Ω] (ignored when reactive = "none"). */
  X: number;
  /** Neutral wire connected (zero impedance) between N' and n. */
  neutral: boolean;
}

export interface StarResult {
  /** Source phase voltages (n → R, S, T). */
  Us: Record<Phase, Complex>;
  /** Load phase voltages (N' → R', S', T'). */
  Uload: Record<Phase, Complex>;
  /** Line currents. */
  I: Record<Phase, Complex>;
  /** Star-point displacement N' − n (0 with neutral). */
  UN: Complex;
  /** Neutral current I_R + I_S + I_T (0 without neutral). */
  IN: Complex;
  /** Line voltages U_RS, U_ST, U_TR of the source. */
  Uline: { RS: Complex; ST: Complex; TR: Complex };
  /** Active power per phase and total (Σ Re(U'·I*)). */
  P: Record<Phase, number>;
  PT: number;
  /** Aron: W1 on R, W2 on T, phase S common. */
  W1: number;
  W2: number;
  WT: number;
}

/** Admittance of each phase: G, plus jωC (capacitor) or −j/(ωL) = −j/X (inductor) in S. */
export function admittances(input: StarInput): Record<Phase, Complex> {
  const G = 1 / input.R;
  let B = 0;
  if (input.reactive !== "none" && input.X > 0) {
    B = input.reactive === "capacitor" ? 1 / input.X : -1 / input.X;
  }
  return { R: c(G), S: c(G, B), T: c(G) };
}

/** Capacitance [F] of a capacitor with reactance X at 50 Hz. */
export const capacitanceFor = (X: number): number => 1 / (OMEGA * X);
/** Inductance [H] of an inductor with reactance X at 50 Hz. */
export const inductanceFor = (X: number): number => X / OMEGA;

export function solveStar(input: StarInput): StarResult {
  const Us: Record<Phase, Complex> = {
    R: polar(input.U.R, SOURCE_ANGLES.R),
    S: polar(input.U.S, SOURCE_ANGLES.S),
    T: polar(input.U.T, SOURCE_ANGLES.T),
  };
  const Y = admittances(input);

  // Millman: displacement of the load star point (no neutral).
  const num = add(add(mul(Y.R, Us.R), mul(Y.S, Us.S)), mul(Y.T, Us.T));
  const den = add(add(Y.R, Y.S), Y.T);
  const UN = input.neutral ? c(0) : div(num, den);

  const Uload = {
    R: sub(Us.R, UN),
    S: sub(Us.S, UN),
    T: sub(Us.T, UN),
  };
  const I = {
    R: mul(Y.R, Uload.R),
    S: mul(Y.S, Uload.S),
    T: mul(Y.T, Uload.T),
  };
  const IN = add(add(I.R, I.S), I.T);

  const Uline = {
    RS: sub(Us.R, Us.S),
    ST: sub(Us.S, Us.T),
    TR: sub(Us.T, Us.R),
  };

  const p = (u: Complex, i: Complex) => mul(u, conj(i)).re;
  const P = {
    R: p(Uload.R, I.R),
    S: p(Uload.S, I.S),
    T: p(Uload.T, I.T),
  };
  // Aron with S as the common phase: W1 = Re(U_RS·I_R*), W2 = Re(U_TS·I_T*).
  const W1 = p(Uline.RS, I.R);
  const W2 = p(sub(Us.T, Us.S), I.T);

  return {
    Us,
    Uload,
    I,
    UN,
    IN,
    Uline,
    P,
    PT: P.R + P.S + P.T,
    W1,
    W2,
    WT: W1 + W2,
  };
}
