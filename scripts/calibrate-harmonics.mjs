// Calibra los modelos no lineales del TP4 contra las capturas del laboratorio.
// Uso: node scripts/calibrate-harmonics.mjs
// Minimiza el error relativo en (I_RMS, I₁, φ₁) con Nelder-Mead; la tensión de
// calibración es senoidal pura (el THD de red del día de 2017 no se conoce).
import { loadCurrent, voltageSamples, analyze } from "../src/lib/harmonics-engine.ts";

const TARGETS = {
  // BBCM1/BBCM2 (lámpara de bajo consumo, monofásica)
  bc: { V1: 227.3, Irms: 0.119, I1: 0.09, phi: 25 },
  // BLM1/BLM3 (lámpara LED, monofásica): ΦA1 = −348° ⇒ φ = +12°
  led: { V1: 227.54, Irms: 0.152, I1: 0.083, phi: 12 },
  // BDCVM1/BDCVM2 (trafo convencional en vacío)
  trafo: { V1: 227.2, Irms: 0.076, I1: 0.071, phi: -63 },
};

function evaluate(load, V1) {
  const grid = { V1, harmonics: [] };
  const v = voltageSamples(grid);
  return analyze(loadCurrent(load, grid), v);
}

function cost(res, tg) {
  const e1 = (res.Irms - tg.Irms) / tg.Irms;
  const e2 = (res.I1 - tg.I1) / tg.I1;
  const e3 = (res.phi1Deg - tg.phi) / 25; // 25° ≙ 100 %
  return e1 * e1 + e2 * e2 + e3 * e3;
}

function nelderMead(f, x0, steps = 400) {
  const n = x0.length;
  let simplex = [x0, ...x0.map((_, i) => x0.map((v, j) => (i === j ? v + 0.3 : v)))];
  let vals = simplex.map(f);
  for (let it = 0; it < steps; it++) {
    const idx = vals.map((v, i) => i).sort((a, b) => vals[a] - vals[b]);
    simplex = idx.map((i) => simplex[i]);
    vals = idx.map((i) => vals[i]);
    const cen = Array.from({ length: n }, (_, j) => simplex.slice(0, n).reduce((s, p) => s + p[j], 0) / n);
    const worst = simplex[n];
    const refl = cen.map((c, j) => c + (c - worst[j]));
    const fr = f(refl);
    if (fr < vals[0]) {
      const exp = cen.map((c, j) => c + 2 * (c - worst[j]));
      const fe = f(exp);
      if (fe < fr) { simplex[n] = exp; vals[n] = fe; } else { simplex[n] = refl; vals[n] = fr; }
    } else if (fr < vals[n - 1]) { simplex[n] = refl; vals[n] = fr; }
    else {
      const con = cen.map((c, j) => c + 0.5 * (worst[j] - c));
      const fc = f(con);
      if (fc < vals[n]) { simplex[n] = con; vals[n] = fc; }
      else for (let i = 1; i <= n; i++) {
        simplex[i] = simplex[i].map((v, j) => simplex[0][j] + 0.5 * (v - simplex[0][j]));
        vals[i] = f(simplex[i]);
      }
    }
  }
  const b = vals.indexOf(Math.min(...vals));
  return { x: simplex[b], cost: vals[b] };
}

function fitRectifier(name, guess) {
  const tg = TARGETS[name];
  const mk = (x) => ({ kind: "rectifier", C: Math.exp(x[0]), RL: Math.exp(x[1]), Rs: Math.exp(x[2]) });
  const best = nelderMead((x) => cost(evaluate(mk(x), tg.V1), tg), guess.map(Math.log));
  const load = mk(best.x);
  const r = evaluate(load, tg.V1);
  console.log(`\n${name}:`, { C: load.C, RL: load.RL, Rs: load.Rs });
  console.log(`  modelo   Irms=${r.Irms.toFixed(4)} I1=${r.I1.toFixed(4)} phi=${r.phi1Deg.toFixed(1)} THD=${(100 * r.thdI).toFixed(0)}%`);
  console.log(`  objetivo Irms=${tg.Irms} I1=${tg.I1} phi=${tg.phi} THD=${(100 * Math.sqrt(tg.Irms ** 2 - tg.I1 ** 2) / tg.I1).toFixed(0)}%  (costo ${best.cost.toExponential(2)})`);
}

fitRectifier("bc", [4.7e-6, 6000, 300]);
fitRectifier("led", [2.2e-6, 10000, 300]);

{
  const tg = TARGETS.trafo;
  const mk = (x) => ({ kind: "magnetizing", a: Math.exp(x[0]), b: Math.exp(x[1]), n: 7, Rc: Math.exp(x[2]) });
  const best = nelderMead((x) => cost(evaluate(mk(x), tg.V1), tg), [Math.log(0.09), Math.log(0.03), Math.log(7000)]);
  const load = mk(best.x);
  const r = evaluate(load, tg.V1);
  console.log("\ntrafo:", { a: load.a, b: load.b, n: load.n, Rc: load.Rc });
  console.log(`  modelo   Irms=${r.Irms.toFixed(4)} I1=${r.I1.toFixed(4)} phi=${r.phi1Deg.toFixed(1)} THD=${(100 * r.thdI).toFixed(0)}%`);
  console.log(`  objetivo Irms=${tg.Irms} I1=${tg.I1} phi=${tg.phi} THD=${(100 * Math.sqrt(tg.Irms ** 2 - tg.I1 ** 2) / tg.I1).toFixed(0)}%  (costo ${best.cost.toExponential(2)})`);
}
