/**
 * Dibujo de la pantalla LCD del analizador (estilo Fluke 435) en Canvas 2D.
 * Funciones puras de dibujo: reciben el modelo (`flukeModel`), el estado de la
 * interfaz y un traductor. Coordenadas lógicas 320×240 (la pantalla real);
 * el componente escala el contexto al ancho disponible.
 */
import { fmt } from "@/lib/format";
import {
  F_LINEA,
  SAMPLES_PER_CYCLE,
  MAX_ORDER,
} from "@/lib/harmonics-engine";
import type { FlukeModel, FlukePhase } from "@/lib/fluke-view";

export const W = 320;
export const H = 240;

export type ScreenId = "scope" | "phasor" | "harmonics" | "meter";
export type ScopeMode = "va" | "v" | "a" | "n";
export type ChSel = "L1" | "L2" | "L3" | "all";
export type PhaseId = "L1" | "L2" | "L3";

export interface ScreenState {
  screen: ScreenId;
  scope: { mode: ScopeMode; ch: ChSel; cursor: boolean; pos: number; zoom: number };
  phasor: { show: "va" | "v" | "a" };
  harm: { src: "v" | "a" | "n"; ch: PhaseId; abs: boolean; zoom: number; sel: number };
}

export const INITIAL_SCREEN: ScreenState = {
  screen: "scope",
  scope: { mode: "va", ch: "L1", cursor: false, pos: 0.3, zoom: 0 },
  phasor: { show: "va" },
  harm: { src: "a", ch: "L1", abs: false, zoom: 0, sel: 2 },
};

export const SCOPE_ZOOMS = [1, 2, 4, 8];
export const HARM_ZOOMS = [1, 2, 5, 10];

type T = (key: string) => string;

// Colores de canal (convención de las capturas: L1 amarillo, L2 gris, L3 rojo, N azul).
const COL = {
  L1: { v: "#8a5a00", i: "#f2b705" },
  L2: { v: "#222222", i: "#8d9299" },
  L3: { v: "#8a1410", i: "#e0302a" },
  N: { v: "#2b4de0", i: "#2b4de0" },
} as const;
const ORANGE = "#f7a21b";
const NAVY = "#243153";
const PLOT_TOP = 46;
const PLOT_BOT = 188;

const FONT = "Arial, Helvetica, sans-serif";

interface TextOpts {
  size?: number;
  bold?: boolean;
  color?: string;
  align?: CanvasTextAlign;
  base?: CanvasTextBaseline;
}
function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, o: TextOpts = {}) {
  ctx.font = `${o.bold ? "bold " : ""}${o.size ?? 9}px ${FONT}`;
  ctx.fillStyle = o.color ?? "#111";
  ctx.textAlign = o.align ?? "left";
  ctx.textBaseline = o.base ?? "middle";
  ctx.fillText(s, x, y);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ─── Soft keys ───────────────────────────────────────────────────────────────

export interface Soft {
  title?: string;
  parts?: string[];
  active?: number;
}

export const SOFT_W = (W - 4 * 3) / 5;

export function softLabel(s: Soft | null): string {
  if (!s) return "";
  return [s.title, ...(s.parts ?? [])].filter(Boolean).join(" ");
}

export function softKeys(st: ScreenState, t: T, hasN = true): (Soft | null)[] {
  const back: Soft = { title: t("poli.fluke.soft.back") };
  switch (st.screen) {
    case "scope": {
      const modes: ScopeMode[] = ["v", "a", "n"];
      const chs: ChSel[] = ["L1", "L2", "L3", "all"];
      return [
        {
          parts: ["V", "A", "N"],
          active: st.scope.mode === "va" ? -1 : modes.indexOf(st.scope.mode),
        },
        { parts: ["L1", "L2", "L3"], active: chs.indexOf(st.scope.ch) },
        {
          title: t("poli.fluke.soft.cursor"),
          parts: [t("poli.fluke.soft.on"), t("poli.fluke.soft.off")],
          active: st.scope.cursor ? 0 : 1,
        },
        { title: t("poli.fluke.soft.zoom"), parts: [`×${SCOPE_ZOOMS[st.scope.zoom]}`] },
        back,
      ];
    }
    case "phasor":
      return [
        {
          parts: ["V", "A"],
          active: st.phasor.show === "va" ? -1 : st.phasor.show === "v" ? 0 : 1,
        },
        null,
        null,
        null,
        back,
      ];
    case "harmonics":
      return [
        {
          parts: ["V", "A", "N"],
          active: ["v", "a", "n"].indexOf(st.harm.src),
        },
        {
          parts: ["L1", "L2", "L3"],
          active: st.harm.src === "n" ? -1 : ["L1", "L2", "L3"].indexOf(st.harm.ch),
        },
        {
          parts: ["%", "ABS"],
          active: st.harm.abs ? 1 : 0,
        },
        { title: t("poli.fluke.soft.zoom"), parts: [`×${HARM_ZOOMS[st.harm.zoom]}`] },
        back,
      ];
    case "meter":
      return [null, null, null, null, back].map((s, i) =>
        i === 0 && !hasN ? null : s,
      );
  }
}

function drawSoftKeys(ctx: CanvasRenderingContext2D, keys: (Soft | null)[]) {
  const y = 207;
  const h = 31;
  keys.forEach((k, i) => {
    const x = i * (SOFT_W + 3);
    roundRect(ctx, x, y, SOFT_W, h, 4);
    ctx.fillStyle = k ? "#2f4f9d" : "#59627a";
    ctx.fill();
    if (!k) return;
    const mid = x + SOFT_W / 2;
    if (k.title && k.parts) {
      text(ctx, k.title, mid, y + 9, { size: 8, bold: true, color: "#fff", align: "center" });
      drawParts(ctx, k.parts, k.active ?? -1, mid, y + 22);
    } else if (k.title) {
      text(ctx, k.title, mid, y + h / 2, { size: 9.5, bold: true, color: "#fff", align: "center" });
    } else if (k.parts) {
      drawParts(ctx, k.parts, k.active ?? -1, mid, y + h / 2);
    }
  });
}

function drawParts(ctx: CanvasRenderingContext2D, parts: string[], active: number, cx: number, cy: number) {
  ctx.font = `bold 9px ${FONT}`;
  const gap = 6;
  const widths = parts.map((p) => ctx.measureText(p).width + 5);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
  let x = cx - total / 2;
  parts.forEach((p, i) => {
    if (i === active) {
      roundRect(ctx, x, cy - 6.5, widths[i], 13, 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }
    text(ctx, p, x + widths[i] / 2, cy + 0.5, {
      size: 9,
      bold: true,
      color: i === active ? "#1d2b52" : "#fff",
      align: "center",
    });
    x += widths[i] + gap;
  });
}

// ─── Marco común (cabecera, estado, pie) ─────────────────────────────────────

interface Chip {
  value: string;
  unit: string;
  color: string;
}

function drawFrame(ctx: CanvasRenderingContext2D, t: T, title: string, chips: Chip[], hz: number) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, W, 16);
  const cw = (W - 4) / Math.max(chips.length, 1);
  chips.forEach((c, i) => {
    const x = 2 + i * cw;
    roundRect(ctx, x, 1.5, cw - 3, 13, 2);
    ctx.fillStyle = "#4a3200";
    ctx.fill();
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 1;
    ctx.stroke();
    text(ctx, c.value, x + cw - 24, 8.5, { size: 9.5, bold: true, color: "#fff", align: "right" });
    text(ctx, c.unit, x + cw - 20, 8.5, { size: 9, bold: true, color: "#ffd27a" });
  });

  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 16, W, 13);
  text(ctx, title, 4, 22.8, { size: 8.5, bold: true, color: "#fff" });

  text(ctx, `${fmt(hz, 3)} Hz`, 4, 37, { size: 9, bold: true });
  ctx.font = `bold 8px ${FONT}`;
  const tag = t("poli.fluke.sim");
  const tw = ctx.measureText(tag).width + 8;
  roundRect(ctx, W - tw - 4, 31, tw, 12, 2);
  ctx.fillStyle = "#c62828";
  ctx.fill();
  text(ctx, tag, W - 4 - tw / 2, 37.3, { size: 8, bold: true, color: "#fff", align: "center" });

  text(ctx, "230V   50Hz   3Ø WYE   EN50160", W / 2, 198, { size: 8, bold: true, align: "center" });
}

function chIds(sel: ChSel): PhaseId[] {
  return sel === "all" ? ["L1", "L2", "L3"] : [sel];
}
const idx = (id: PhaseId) => ["L1", "L2", "L3"].indexOf(id);

// ─── Osciloscopio ────────────────────────────────────────────────────────────

const CYCLES_SHOWN = 4;
const V_NOM_PEAK = 230 * Math.SQRT2;

function drawScope(ctx: CanvasRenderingContext2D, m: FlukeModel, st: ScreenState, t: T) {
  const { mode, ch, cursor, pos, zoom } = st.scope;
  const ids = chIds(ch);
  const showV = mode === "va" || mode === "v";
  const showA = mode === "va" || mode === "a";
  const showN = mode === "n";

  const chips: Chip[] = [];
  if (showV) ids.forEach((id) => chips.push({ value: fmt(m.phases[idx(id)].Vrms, 2), unit: "V", color: COL[id].i }));
  if (showA) ids.forEach((id) => chips.push({ value: fmt(m.phases[idx(id)].Irms, 3), unit: "A", color: COL[id].i }));
  if (showN) chips.push({ value: fmt(m.neutral.Irms, 3), unit: "A", color: COL.N.i });
  const chipList = chips.slice(0, 4);
  drawFrame(ctx, t, t("poli.fluke.title.scope"), chipList, F_LINEA);

  const x0 = 6;
  const x1 = W - 6;
  const yc = (PLOT_TOP + PLOT_BOT) / 2;
  const half = (PLOT_BOT - PLOT_TOP) / 2 - 2;

  // Cuadrícula tenue y línea cero.
  ctx.strokeStyle = "#e3e3e3";
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= CYCLES_SHOWN; c++) {
    const x = x0 + ((x1 - x0) * c) / CYCLES_SHOWN;
    ctx.beginPath();
    ctx.moveTo(x, PLOT_TOP);
    ctx.lineTo(x, PLOT_BOT);
    ctx.stroke();
  }
  ctx.strokeStyle = "#bbb";
  ctx.beginPath();
  ctx.moveTo(x0, yc);
  ctx.lineTo(x1, yc);
  ctx.stroke();

  // Escalas: la tensión se auto-escala; la corriente según el ZOOM.
  const vTraces: { v: number[]; color: string }[] = [];
  const iTraces: { v: number[]; color: string }[] = [];
  if (showV) ids.forEach((id) => vTraces.push({ v: m.phases[idx(id)].v, color: COL[id].v }));
  if (showA) ids.forEach((id) => iTraces.push({ v: m.phases[idx(id)].i, color: COL[id].i }));
  if (showN) iTraces.push({ v: m.neutral.i, color: COL.N.i });
  const vMax = Math.max(V_NOM_PEAK * 1.15, ...vTraces.flatMap((s) => s.v.map(Math.abs))) * 1.05;
  const iPeak = Math.max(...iTraces.flatMap((s) => s.v.map(Math.abs)), 0);
  const iRange = Math.max(iPeak * 1.15, 0.02) / SCOPE_ZOOMS[zoom];

  if (showV) {
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 0.6;
    for (const sgn of [1, -1]) {
      const y = yc - sgn * (V_NOM_PEAK / vMax) * half;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    text(ctx, "230V", x0 + 2, yc - (V_NOM_PEAK / vMax) * half - 5, { size: 8.5, bold: true });
  }

  const N = SAMPLES_PER_CYCLE;
  const step = 6;
  const plot = (s: { v: number[]; color: string }, range: number, lw: number) => {
    const len = s.v.length;
    ctx.beginPath();
    const total = CYCLES_SHOWN * N;
    for (let k = 0; k <= total; k += step) {
      const x = x0 + ((x1 - x0) * k) / total;
      const raw = s.v[k % len];
      const y = yc - Math.max(-1.1, Math.min(1.1, raw / range)) * half;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = s.color;
    ctx.lineWidth = lw;
    ctx.lineJoin = "round";
    ctx.stroke();
  };
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, PLOT_TOP, x1 - x0, PLOT_BOT - PLOT_TOP);
  ctx.clip();
  vTraces.forEach((s) => plot(s, vMax, 1.2));
  iTraces.forEach((s) => plot(s, iRange, 1.4));
  ctx.restore();

  if (cursor) {
    const k = Math.round(pos * (CYCLES_SHOWN * N - 1));
    const x = x0 + ((x1 - x0) * k) / (CYCLES_SHOWN * N);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(x, PLOT_TOP);
    ctx.lineTo(x, PLOT_BOT);
    ctx.stroke();
    ctx.setLineDash([]);
    const ms = (k / N) * (1000 / F_LINEA);
    const rows: { s: string; c: string }[] = [{ s: `${fmt(ms, 1)} ms`, c: "#111" }];
    vTraces.forEach((s) => rows.push({ s: `${fmt(s.v[k % s.v.length], 1)} V`, c: s.color }));
    iTraces.forEach((s) => rows.push({ s: `${fmt(s.v[k % s.v.length], 3)} A`, c: s.color }));
    const bw = 62;
    const bh = rows.length * 10 + 4;
    const bx = x + 4 + bw > x1 ? x - bw - 4 : x + 4;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillRect(bx, PLOT_TOP + 2, bw, bh);
    ctx.strokeStyle = "#777";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, PLOT_TOP + 2, bw, bh);
    rows.forEach((r, i) =>
      text(ctx, r.s, bx + 3, PLOT_TOP + 8 + i * 10, { size: 8.5, bold: true, color: r.c }),
    );
  }
}

// ─── Fasores ─────────────────────────────────────────────────────────────────

function arrow(ctx: CanvasRenderingContext2D, cx: number, cy: number, len: number, angDeg: number, color: string, label: string, dashed = false) {
  const a = (angDeg * Math.PI) / 180;
  const ex = cx + len * Math.cos(a);
  const ey = cy - len * Math.sin(a);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.setLineDash(dashed ? [3, 2] : []);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.setLineDash([]);
  const hd = 6;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - hd * Math.cos(a - 0.4), ey + hd * Math.sin(a - 0.4));
  ctx.lineTo(ex - hd * Math.cos(a + 0.4), ey + hd * Math.sin(a + 0.4));
  ctx.closePath();
  ctx.fill();
  text(ctx, label, cx + (len + 9) * Math.cos(a), cy - (len + 9) * Math.sin(a), {
    size: 8,
    bold: true,
    color,
    align: "center",
  });
}

function drawPhasor(ctx: CanvasRenderingContext2D, m: FlukeModel, st: ScreenState, t: T) {
  const { show } = st.phasor;
  const showV = show !== "a";
  const showA = show !== "v";
  const chips: Chip[] = m.phases.map((p) => ({
    value: fmt(showV ? p.Vrms : p.Irms, showV ? 1 : 3),
    unit: showV ? "V" : "A",
    color: COL[p.id].i,
  }));
  drawFrame(ctx, t, t("poli.fluke.title.phasor"), chips, F_LINEA);

  const cx = 88;
  const cy = (PLOT_TOP + PLOT_BOT) / 2;
  const R = 62;
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, R / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - R, cy);
  ctx.lineTo(cx + R, cy);
  ctx.moveTo(cx, cy - R);
  ctx.lineTo(cx, cy + R);
  ctx.stroke();

  if (showV) m.phases.forEach((p) => arrow(ctx, cx, cy, R, p.angV, COL[p.id].v === "#222222" ? "#444" : COL[p.id].v, p.id));
  if (showA) {
    const mx = Math.max(...m.phases.map((p) => p.I1), m.neutral.I1, 1e-9);
    const len = (v: number) => (v / mx) * R * 0.82;
    m.phases.forEach((p) => {
      if (p.I1 > 1e-6) arrow(ctx, cx, cy, len(p.I1), p.angI, COL[p.id].i, p.id);
    });
    if (m.neutral.I1 > 1e-6) arrow(ctx, cx, cy, len(m.neutral.I1), m.neutral.angI, COL.N.i, "N", true);
  }

  // Tabla de valores (fundamental).
  const tx = 168;
  let y = PLOT_TOP + 4;
  text(ctx, t("poli.fluke.phasor.fund"), tx, y, { size: 8, bold: true, color: "#555" });
  y += 12;
  const row = (label: string, color: string, val: string, ang: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(tx, y - 4, 4, 8);
    text(ctx, label, tx + 8, y, { size: 8.5, bold: true });
    text(ctx, val, tx + 88, y, { size: 8.5, align: "right" });
    text(ctx, ang, tx + 148, y, { size: 8.5, align: "right" });
    y += 11.5;
  };
  if (showV) {
    m.phases.forEach((p) => row(`V ${p.id}`, COL[p.id].v, `${fmt(p.V1, 1)} V`, `${fmt(p.angV, 1)}°`));
    y += 3;
  }
  if (showA) {
    m.phases.forEach((p) => row(`A ${p.id}`, COL[p.id].i, `${fmt(p.I1, 3)} A`, p.I1 > 1e-6 ? `${fmt(p.angI, 1)}°` : "—"));
    row("A N", COL.N.i, `${fmt(m.neutral.I1, 3)} A`, m.neutral.I1 > 1e-6 ? `${fmt(m.neutral.angI, 1)}°` : "—");
  }
}

// ─── Armónicas ───────────────────────────────────────────────────────────────

export interface HarmSeries {
  values: number[];
  angles: number[];
  fund: number;
  rms: number;
  thd: number;
  unit: string;
  color: string;
  ref: number;
}

export function harmSeries(m: FlukeModel, h: ScreenState["harm"]): HarmSeries {
  const p: FlukePhase = m.phases[idx(h.ch)];
  const n = MAX_ORDER;
  if (h.src === "v")
    return { values: p.spectrumV.slice(0, n), angles: p.angHarmV, fund: p.V1, rms: p.Vrms, thd: p.thdV, unit: "V", color: COL[h.ch].v, ref: p.V1 };
  if (h.src === "a")
    return { values: p.spectrumI.slice(0, n), angles: p.angHarmI, fund: p.I1, rms: p.Irms, thd: p.thdI, unit: "A", color: COL[h.ch].i, ref: p.I1 };
  return {
    values: m.neutral.spectrum.slice(0, n),
    angles: m.neutral.angHarm,
    fund: m.neutral.I1,
    rms: m.neutral.Irms,
    thd: m.neutral.thd,
    unit: "A",
    color: COL.N.i,
    // El neutro se expresa respecto de la fundamental de la corriente de fase.
    ref: m.phases[0].I1,
  };
}

function drawHarmonics(ctx: CanvasRenderingContext2D, m: FlukeModel, st: ScreenState, t: T) {
  const h = st.harm;
  const s = harmSeries(m, h);
  const unitRms = s.unit;
  drawFrame(ctx, t, `${t("poli.fluke.title.harmonics")} - ${h.src === "n" ? "N" : `${h.src.toUpperCase()} ${h.ch}`}`, [
    { value: fmt(s.rms, unitRms === "V" ? 2 : 3), unit: unitRms, color: s.color },
    { value: `THD ${fmt(s.thd * 100, 1)}`, unit: "%", color: s.color },
  ], F_LINEA);

  const px0 = 34;
  const px1 = W - 6;
  const top = PLOT_TOP + 4;
  const bot = PLOT_BOT - 30;
  const ph = bot - top;

  const pct = (v: number) => (s.ref > 1e-9 ? (v / s.ref) * 100 : 0);
  const shown = s.values.map((v) => (h.abs ? v : pct(v)));
  const zf = HARM_ZOOMS[h.zoom];
  const autoMax = h.abs ? Math.max(...shown, 1e-9) * 1.05 : 100;
  const yMax = autoMax / zf;

  // Ejes y grilla.
  ctx.lineWidth = 0.5;
  for (let g = 0; g <= 4; g++) {
    const y = bot - (g / 4) * ph;
    ctx.strokeStyle = g === 0 ? "#666" : "#e3e3e3";
    ctx.beginPath();
    ctx.moveTo(px0, y);
    ctx.lineTo(px1, y);
    ctx.stroke();
    const val = (g / 4) * yMax;
    text(ctx, fmt(val, yMax < 10 ? 2 : yMax < 100 ? 1 : 0), px0 - 3, y, { size: 7.5, color: "#555", align: "right" });
  }
  text(ctx, h.abs ? unitRms : "%", 2, top - 1, { size: 7.5, bold: true, color: "#555" });

  const n = shown.length;
  const slot = (px1 - px0) / n;
  shown.forEach((v, i) => {
    const x = px0 + i * slot;
    if ((i + 1) % 3 === 0) {
      ctx.fillStyle = "rgba(0,0,0,0.045)";
      ctx.fillRect(x, top, slot, ph);
    }
    const bh = Math.min(1, v / yMax) * ph;
    ctx.fillStyle = s.color;
    ctx.fillRect(x + 1, bot - bh, Math.max(1, slot - 2), bh);
    if (v / yMax > 1) {
      ctx.fillStyle = "#c62828";
      ctx.fillRect(x + 1, top, Math.max(1, slot - 2), 2);
    }
    if (i + 1 === h.sel + 1 || (i + 1) % 2 === 1) {
      text(ctx, String(i + 1), x + slot / 2, bot + 6, {
        size: 7,
        bold: i === h.sel,
        color: i === h.sel ? "#c62828" : "#444",
        align: "center",
      });
    }
  });
  // Cursor de armónica.
  const sx = px0 + h.sel * slot;
  ctx.strokeStyle = "#c62828";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(sx, top, slot, ph);

  const ord = h.sel + 1;
  const v = s.values[h.sel] ?? 0;
  const ang = s.angles[h.sel] ?? 0;
  text(ctx, `h${String(ord).padStart(2, "0")}`, px0, bot + 21, { size: 9, bold: true, color: "#c62828" });
  text(ctx, `${fmt(pct(v), 1)} %`, px0 + 34, bot + 21, { size: 9, bold: true });
  const small = unitRms === "A" && v < 0.1;
  text(ctx, small ? `${fmt(v * 1000, 1)} mA` : `${fmt(v, unitRms === "V" ? 2 : 3)} ${unitRms}`, px0 + 92, bot + 21, { size: 9, bold: true });
  text(ctx, v > 1e-6 ? `${fmt(ang, 0)}°` : "—", px1, bot + 21, { size: 9, bold: true, align: "right" });
}

// ─── Medidor ─────────────────────────────────────────────────────────────────

function drawMeter(ctx: CanvasRenderingContext2D, m: FlukeModel, t: T) {
  drawFrame(ctx, t, t("poli.fluke.title.meter"), [
    { value: fmt(m.phases[0].Vrms, 2), unit: "V", color: COL.L1.i },
    { value: fmt(m.phases[0].Irms, 3), unit: "A", color: COL.L1.i },
  ], F_LINEA);
  const cols = [
    { id: "L1", x: 150, c: COL.L1.i },
    { id: "L2", x: 200, c: COL.L2.i },
    { id: "L3", x: 250, c: COL.L3.i },
    { id: "N", x: 304, c: COL.N.i },
  ];
  let y = PLOT_TOP + 3;
  cols.forEach((c) => {
    ctx.fillStyle = c.c;
    ctx.fillRect(c.x - 30, y - 5, 34, 11);
    text(ctx, c.id, c.x - 13, y + 0.5, { size: 8.5, bold: true, color: c.id === "L1" ? "#111" : "#fff", align: "center" });
  });
  y += 13;
  const crest = (pk: number, rms: number) => (rms > 1e-9 ? pk / rms : NaN);
  const vpk = m.phases.map((p) => Math.max(...p.v.map(Math.abs)));
  const rows: [string, (string)[]][] = [
    ["Vrms (V)", [...m.phases.map((p) => fmt(p.Vrms, 1)), "—"]],
    ["Arms (A)", [...m.phases.map((p) => fmt(p.Irms, 3)), fmt(m.neutral.Irms, 3)]],
    [t("poli.fluke.row.vpk"), [...vpk.map((x) => fmt(x, 1)), "—"]],
    [t("poli.fluke.row.apk"), [...m.phases.map((p) => fmt(p.peakI, 3)), fmt(m.neutral.peak, 3)]],
    [t("poli.fluke.row.cfV"), [...m.phases.map((p, i) => fmt(crest(vpk[i], p.Vrms), 2)), "—"]],
    [t("poli.fluke.row.cfA"), [...m.phases.map((p) => fmt(crest(p.peakI, p.Irms), 2)), fmt(crest(m.neutral.peak, m.neutral.Irms), 2)]],
    ["THD V (%)", [...m.phases.map((p) => fmt(p.thdV * 100, 1)), "—"]],
    ["THD A (%)", [...m.phases.map((p) => (p.loaded ? fmt(p.thdI * 100, 1) : "—")), fmt(m.neutral.thd * 100, 1)]],
    ["P (W)", [...m.phases.map((p) => fmt(p.P, 1)), "—"]],
    [t("poli.fluke.row.pf"), [...m.phases.map((p) => (p.loaded ? fmt(p.pf, 2) : "—")), "—"]],
  ];
  rows.forEach(([label, vals], r) => {
    if (r % 2 === 0) {
      ctx.fillStyle = "#f3f3f3";
      ctx.fillRect(4, y - 6, W - 8, 13);
    }
    text(ctx, label, 8, y + 0.5, { size: 8.5, bold: true });
    vals.forEach((v, i) => text(ctx, v, cols[i].x + 2, y + 0.5, { size: 8.5, align: "right" }));
    y += 13.2;
  });
}

// ─── Entrada ─────────────────────────────────────────────────────────────────

export function drawScreen(ctx: CanvasRenderingContext2D, m: FlukeModel, st: ScreenState, t: T) {
  switch (st.screen) {
    case "scope":
      drawScope(ctx, m, st, t);
      break;
    case "phasor":
      drawPhasor(ctx, m, st, t);
      break;
    case "harmonics":
      drawHarmonics(ctx, m, st, t);
      break;
    case "meter":
      drawMeter(ctx, m, t);
      break;
  }
  drawSoftKeys(ctx, softKeys(st, t));
}

// ─── Descripción accesible ───────────────────────────────────────────────────

/**
 * Resumen en texto de lo que muestra la pantalla (para lectores de pantalla):
 * depende de la pantalla, los canales y la armónica seleccionados.
 */
export function describeScreen(m: FlukeModel, st: ScreenState, t: T): string {
  const title = t(`poli.fluke.title.${st.screen}`);
  const parts: string[] = [`${title}.`, `${t("poli.fluke.sim")}.`];
  const ph = (id: PhaseId) => m.phases[idx(id)];
  switch (st.screen) {
    case "scope": {
      const { mode, ch, cursor, pos } = st.scope;
      const ids = chIds(ch);
      if (mode === "va" || mode === "v")
        ids.forEach((id) => parts.push(`V ${id} ${fmt(ph(id).Vrms, 2)} V.`));
      if (mode === "va" || mode === "a")
        ids.forEach((id) => parts.push(`A ${id} ${fmt(ph(id).Irms, 3)} A.`));
      if (mode === "n") parts.push(`A N ${fmt(m.neutral.Irms, 3)} A.`);
      if (cursor) {
        const N = SAMPLES_PER_CYCLE;
        const k = Math.round(pos * (CYCLES_SHOWN * N - 1));
        const at = (x: number[]) => x[k % x.length];
        const rd: string[] = [`${fmt((k / N) * (1000 / F_LINEA), 1)} ms`];
        if (mode === "va" || mode === "v")
          ids.forEach((id) => rd.push(`V ${id} ${fmt(at(ph(id).v), 1)} V`));
        if (mode === "va" || mode === "a")
          ids.forEach((id) => rd.push(`A ${id} ${fmt(at(ph(id).i), 3)} A`));
        if (mode === "n") rd.push(`A N ${fmt(at(m.neutral.i), 3)} A`);
        parts.push(`${t("poli.fluke.soft.cursor")}: ${rd.join(", ")}.`);
      }
      break;
    }
    case "phasor": {
      const { show } = st.phasor;
      m.phases.forEach((p) => {
        if (show !== "a") parts.push(`V ${p.id} ${fmt(p.V1, 1)} V, ${fmt(p.angV, 1)}°.`);
      });
      m.phases.forEach((p) => {
        if (show !== "v")
          parts.push(`A ${p.id} ${fmt(p.I1, 3)} A, ${p.I1 > 1e-6 ? `${fmt(p.angI, 1)}°` : "—"}.`);
      });
      if (show !== "v")
        parts.push(`A N ${fmt(m.neutral.I1, 3)} A, ${m.neutral.I1 > 1e-6 ? `${fmt(m.neutral.angI, 1)}°` : "—"}.`);
      break;
    }
    case "harmonics": {
      const s = harmSeries(m, st.harm);
      const v = s.values[st.harm.sel] ?? 0;
      const pct = s.ref > 1e-9 ? (v / s.ref) * 100 : 0;
      parts.push(
        `${st.harm.src === "n" ? "N" : `${st.harm.src.toUpperCase()} ${st.harm.ch}`}. THD ${fmt(s.thd * 100, 1)} %. ${s.unit === "A" ? `${fmt(s.rms, 3)} A` : `${fmt(s.rms, 2)} V`}.`,
        `${t("poli.fluke.aria.harmonic")} ${st.harm.sel + 1}: ${fmt(pct, 1)} %, ${fmt(v, s.unit === "V" ? 2 : 4)} ${s.unit}, ${v > 1e-6 ? `${fmt(s.angles[st.harm.sel] ?? 0, 0)}°` : "—"}.`,
      );
      break;
    }
    case "meter":
      m.phases.forEach((p) =>
        parts.push(
          `${p.id}: ${fmt(p.Vrms, 1)} V, ${fmt(p.Irms, 3)} A, THD V ${fmt(p.thdV * 100, 1)} %, THD A ${p.loaded ? fmt(p.thdI * 100, 1) : "—"} %, P ${fmt(p.P, 1)} W.`,
        ),
      );
      parts.push(`N: ${fmt(m.neutral.Irms, 3)} A.`);
      break;
  }
  const soft = softKeys(st, t)
    .map((k, i) => (k ? `F${i + 1} ${softLabel(k)}` : ""))
    .filter(Boolean)
    .join(", ");
  parts.push(soft);
  return parts.join(" ");
}
