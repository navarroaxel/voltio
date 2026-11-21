import type { PhasorData } from "@/components/sim/PhasorDiagram";
import { add, c, polar, type StarResult } from "@/lib/three-phase-engine";
import type { Caso } from "@/lib/trifasica-data";

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
  const un = caso.phasors.UN ? polar(caso.phasors.UN.mag, caso.phasors.UN.deg) : c(0);
  const u = caso.phasors.U.map((p) => polar(p.mag, p.deg));
  const i = caso.phasors.I.map((p) => polar(p.mag, p.deg));
  return {
    vertices: { R: add(un, u[0]), S: add(un, u[1]), T: add(un, u[2]) },
    UN: un,
    I: { R: i[0], S: i[1], T: i[2] },
    IN: caso.phasors.IN ? polar(caso.phasors.IN.mag, caso.phasors.IN.deg) : null,
    Uline: caso.Uline,
  };
}
