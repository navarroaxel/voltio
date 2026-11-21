import type { PhasorData } from "../components/sim/PhasorDiagram";
import { add, c, polar, type StarResult } from "./three-phase-engine";
import type { Caso } from "./trifasica-data";

/** Phasor diagram of a simulated state. */
export function phasorFromResult(r: StarResult): PhasorData {
  return {
    vertices: r.Us,
    UN: r.UN,
    I: r.I,
    IN: r.IN.re === 0 && r.IN.im === 0 ? null : r.IN,
    Uline: [
      Math.hypot(r.Uline.RS.re, r.Uline.RS.im),
      Math.hypot(r.Uline.ST.re, r.Uline.ST.im),
      Math.hypot(r.Uline.TR.re, r.Uline.TR.im),
    ],
  };
}

/**
 * Phasor diagram of a measured state. The report gives the load phase voltages
 * (N' → R', S', T') and, without neutral, the displacement n → N'; the source
 * vertices are rebuilt as N' + U'. Line-voltage magnitudes are the readings.
 */
export function phasorFromCaso(caso: Caso): PhasorData {
  // With the neutral connected N' = n (zero displacement). Without it, the
  // displacement is only known when the report gives its angle; otherwise it
  // stays unknown (null) instead of being drawn as zero.
  const un: ReturnType<typeof c> | null = caso.neutral
    ? c(0)
    : caso.phasors.UN
      ? polar(caso.phasors.UN.mag, caso.phasors.UN.deg)
      : null;
  const base = un ?? c(0);
  const u = caso.phasors.U.map((p) => polar(p.mag, p.deg));
  const i = caso.phasors.I.map((p) => polar(p.mag, p.deg));
  return {
    vertices: { R: add(base, u[0]), S: add(base, u[1]), T: add(base, u[2]) },
    UN: un,
    I: { R: i[0], S: i[1], T: i[2] },
    IN: caso.phasors.IN ? polar(caso.phasors.IN.mag, caso.phasors.IN.deg) : null,
    Uline: caso.Uline,
  };
}
