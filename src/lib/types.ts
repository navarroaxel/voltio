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

/** Input for TP2's transformer-parameter determination (5.1). SI units. */
export interface TransformerParamsInput {
  U1: number; // primary voltage, Conexión I (V)
  I10: number; // primary current, Conexión I (A)
  U20: number; // secondary voltage induced, Conexión I (V)
  U2: number; // secondary voltage, Conexión II (V)
  I20: number; // secondary current, Conexión II (A)
  U10: number; // primary voltage induced, Conexión II (V)
  f: number; // frequency (Hz)
}

/** Result of the transformer-parameter determination. */
export interface TransformerParamsResult {
  omega: number; // angular frequency ω = 2πf (rad/s)
  L1: number; // primary self-inductance (H)
  M12: number; // mutual inductance from Conexión I (H)
  L2: number; // secondary self-inductance (H)
  M21: number; // mutual inductance from Conexión II (H)
  K: number; // coupling coefficient
}

/** Result of the homologous-terminal test with the series-ammeter method. */
export interface HomologousByCurrentResult {
  homologous: "I" | "II" | null; // which bridge connection is homologous
  seriesMode: "additive-in-II" | "subtractive-in-II" | null;
}

/** Result of the homologous-terminal test with the applied-voltage method. */
export interface HomologousByVoltageResult {
  homologous: boolean | null;
  diff: number; // |U1 - U2|
  sum: number; // U1 + U2
}
