/** Entrada del motor RLC serie. Unidades SI: L en henrios, C en faradios. */
export interface RLCInput {
  U: number; // tensión de la fuente (V)
  R: number; // resistencia externa (Ω)
  RL: number; // resistencia interna de la bobina (Ω)
  L: number; // inductancia (H)
  C: number; // capacidad (F)
  f: number; // frecuencia (Hz)
}

/** Resultado del cálculo de un circuito RLC serie a una frecuencia dada. */
export interface RLCResult {
  omega: number; // pulsación ω = 2πf (rad/s)
  XL: number; // reactancia inductiva (Ω)
  XC: number; // reactancia capacitiva (Ω); Infinity si C = 0
  R: number; // resistencia externa (Ω)
  RL: number; // resistencia interna de la bobina (Ω)
  Rtot: number; // R + RL (Ω)
  X: number; // reactancia neta XL − XC (Ω)
  Z: number; // módulo de la impedancia (Ω)
  phiDeg: number; // ángulo de fase φ (grados)
  I: number; // corriente (A)
  UR: number; // caída sobre la resistencia externa (V)
  UL: number; // caída sobre la bobina física, incluye RL (V)
  UC: number; // caída sobre el capacitor (V)
  P: number; // potencia activa (W)
  Qreact: number; // potencia reactiva (VAR)
  S: number; // potencia aparente (VA)
  fp: number; // factor de potencia (cos φ)
  f0: number; // frecuencia de resonancia (Hz)
  Qfactor: number; // factor de mérito Q
}
