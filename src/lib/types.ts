/** Input for the series RLC engine. SI units: L in henries, C in farads. */
export interface RLCInput {
  U: number; // source voltage (V)
  R: number; // external resistance (Ω)
  RL: number; // coil's internal resistance (Ω)
  L: number; // inductance (H)
  C: number; // capacitance (F)
  f: number; // frequency (Hz)
}

/** Result of computing a series RLC circuit at a given frequency. */
export interface RLCResult {
  omega: number; // angular frequency ω = 2πf (rad/s)
  XL: number; // inductive reactance (Ω)
  XC: number; // capacitive reactance (Ω); Infinity if C = 0
  R: number; // external resistance (Ω)
  RL: number; // coil's internal resistance (Ω)
  Rtot: number; // R + RL (Ω)
  X: number; // net reactance XL − XC (Ω)
  Z: number; // impedance magnitude (Ω)
  phiDeg: number; // phase angle φ (degrees)
  I: number; // current (A)
  UR: number; // drop across the external resistance (V)
  UL: number; // drop across the physical coil, includes RL (V)
  UC: number; // drop across the capacitor (V)
  P: number; // active power (W)
  Qreact: number; // reactive power (VAR)
  S: number; // apparent power (VA)
  fp: number; // power factor (cos φ)
  f0: number; // resonant frequency (Hz)
  Qfactor: number; // quality factor Q
}
