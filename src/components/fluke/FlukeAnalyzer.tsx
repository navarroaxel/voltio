"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { FlukeModel } from "@/lib/fluke-view";
import {
  drawScreen,
  H,
  HARM_ZOOMS,
  INITIAL_SCREEN,
  SCOPE_ZOOMS,
  softKeys,
  softLabel,
  W,
  type ChSel,
  type ScopeMode,
  type ScreenId,
  type ScreenState,
} from "./flukeScreen";
import { MAX_ORDER } from "@/lib/harmonics-engine";

type Action =
  | { type: "SCREEN"; screen: ScreenId }
  | { type: "SOFT"; index: number }
  | { type: "ARROW"; dir: "left" | "right" | "up" | "down" };

const next = <T,>(list: T[], cur: T): T => list[(list.indexOf(cur) + 1) % list.length];
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

function reducer(s: ScreenState, a: Action): ScreenState {
  switch (a.type) {
    case "SCREEN":
      return { ...s, screen: a.screen };
    case "SOFT": {
      const i = a.index;
      if (i === 4) return s.screen === "scope" ? INITIAL_SCREEN : { ...s, screen: "scope" };
      switch (s.screen) {
        case "scope":
          if (i === 0)
            return { ...s, scope: { ...s.scope, mode: next<ScopeMode>(["va", "v", "a", "n"], s.scope.mode) } };
          if (i === 1)
            return { ...s, scope: { ...s.scope, ch: next<ChSel>(["L1", "L2", "L3", "all"], s.scope.ch) } };
          if (i === 2) return { ...s, scope: { ...s.scope, cursor: !s.scope.cursor } };
          if (i === 3)
            return { ...s, scope: { ...s.scope, zoom: (s.scope.zoom + 1) % SCOPE_ZOOMS.length } };
          return s;
        case "phasor":
          if (i === 0) return { ...s, phasor: { show: next(["va", "v", "a"] as const, s.phasor.show) } };
          return s;
        case "harmonics":
          if (i === 0) return { ...s, harm: { ...s.harm, src: next(["v", "a", "n"] as const, s.harm.src) } };
          if (i === 1 && s.harm.src !== "n")
            return { ...s, harm: { ...s.harm, ch: next(["L1", "L2", "L3"] as const, s.harm.ch) } };
          if (i === 2) return { ...s, harm: { ...s.harm, abs: !s.harm.abs } };
          if (i === 3) return { ...s, harm: { ...s.harm, zoom: (s.harm.zoom + 1) % HARM_ZOOMS.length } };
          return s;
        default:
          return s;
      }
    }
    case "ARROW": {
      if (s.screen === "scope") {
        const { dir } = a;
        if ((dir === "left" || dir === "right") && s.scope.cursor)
          return { ...s, scope: { ...s.scope, pos: clamp(s.scope.pos + (dir === "right" ? 0.01 : -0.01), 0, 1) } };
        if (dir === "up" || dir === "down")
          return { ...s, scope: { ...s.scope, zoom: clamp(s.scope.zoom + (dir === "up" ? 1 : -1), 0, SCOPE_ZOOMS.length - 1) } };
      }
      if (s.screen === "harmonics") {
        const { dir } = a;
        if (dir === "left" || dir === "right")
          return { ...s, harm: { ...s.harm, sel: clamp(s.harm.sel + (dir === "right" ? 1 : -1), 0, MAX_ORDER - 1) } };
        return { ...s, harm: { ...s.harm, zoom: clamp(s.harm.zoom + (dir === "up" ? 1 : -1), 0, HARM_ZOOMS.length - 1) } };
      }
      return s;
    }
  }
}

const MODE_KEYS: { id: ScreenId; labelKey: string }[] = [
  { id: "scope", labelKey: "poli.fluke.key.scope" },
  { id: "phasor", labelKey: "poli.fluke.key.phasor" },
  { id: "harmonics", labelKey: "poli.fluke.key.harmonics" },
  { id: "meter", labelKey: "poli.fluke.key.meter" },
];

const keyBase =
  "select-none rounded-md border border-black/40 bg-gradient-to-b from-neutral-600 to-neutral-800 text-[11px] font-bold text-neutral-100 shadow-[0_2px_0_rgba(0,0,0,0.6)] transition active:translate-y-px active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

/**
 * Analizador de calidad de energía estilo Fluke 435: pantalla LCD dibujada en
 * canvas (osciloscopio, fasores, armónicas, medidor) con teclas de función y
 * flechas funcionales. Sólo presenta los resultados del motor; no calcula.
 */
export function FlukeAnalyzer({ model }: { model: FlukeModel }) {
  const { t } = useLanguage();
  const [st, dispatch] = useReducer(reducer, INITIAL_SCREEN);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => setWidth(Math.round(wrap.clientWidth)));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cssW = wrap.clientWidth || W;
    const cssH = (cssW * H) / W;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.height = `${cssH}px`;
    const k = (cssW * dpr) / W;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    drawScreen(ctx, model, st, t);
  }, [model, st, t, width]);

  const keys = softKeys(st, t);
  const screenName = t(`poli.fluke.title.${st.screen}`);
  const p0 = model.phases[0];
  const aria = `${screenName}. ${t("poli.fluke.sim")}: Vrms ${p0.Vrms.toFixed(1)} V, Irms ${p0.Irms.toFixed(3)} A, THD I ${(p0.thdI * 100).toFixed(1)} %.`;

  return (
    <div className="mx-auto w-full max-w-[560px] rounded-[26px] bg-gradient-to-b from-neutral-700 to-neutral-900 p-3 shadow-xl ring-1 ring-black/50 sm:p-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[11px] font-bold tracking-[0.2em] text-amber-400">
          {t("poli.fluke.brand")}
        </span>
        <span className="text-[10px] text-neutral-400">{t("poli.fluke.model")}</span>
      </div>

      <div className="rounded-lg bg-black p-1.5 ring-1 ring-neutral-600">
        <div className="relative" ref={wrapRef}>
          <canvas ref={canvasRef} className="block rounded-sm" role="img" aria-label={aria} />
          {/* Zona táctil sobre las teclas de función dibujadas en pantalla. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 grid grid-cols-5"
            style={{ top: `${(207 / H) * 100}%`, height: `${(31 / H) * 100}%`, gap: `${(3 / W) * 100}%` }}
          >
            {keys.map((_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                className="cursor-pointer rounded hover:bg-white/10"
                onClick={() => dispatch({ type: "SOFT", index: i })}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-2.5 grid grid-cols-5 px-1.5"
        style={{ gap: `${(3 / W) * 100}%` }}
      >
        {keys.map((k, i) => (
          <button
            key={i}
            type="button"
            className={`${keyBase} py-1.5`}
            aria-label={`F${i + 1}${softLabel(k) ? `: ${softLabel(k)}` : ""}`}
            onClick={() => dispatch({ type: "SOFT", index: i })}
          >
            F{i + 1}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <div className="grid grid-cols-2 gap-1.5" role="group" aria-label={t("poli.fluke.keys.modes")}>
          {MODE_KEYS.map((k) => {
            const on = st.screen === k.id;
            return (
              <button
                key={k.id}
                type="button"
                aria-pressed={on}
                onClick={() => dispatch({ type: "SCREEN", screen: k.id })}
                className={`${keyBase} min-w-[88px] px-2 py-2 ${on ? "!from-amber-400 !to-amber-500 !text-neutral-900" : ""}`}
              >
                {t(k.labelKey)}
              </button>
            );
          })}
        </div>

        <div
          className="grid grid-cols-3 grid-rows-3 gap-1"
          role="group"
          aria-label={t("poli.fluke.keys.arrows")}
        >
          {(
            [
              [null, "up", null],
              ["left", null, "right"],
              [null, "down", null],
            ] as const
          ).flat().map((d, i) =>
            d ? (
              <button
                key={i}
                type="button"
                aria-label={t(`poli.fluke.arrow.${d}`)}
                className={`${keyBase} h-9 w-9 text-sm`}
                onClick={() => dispatch({ type: "ARROW", dir: d })}
              >
                {{ up: "▲", down: "▼", left: "◀", right: "▶" }[d]}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
