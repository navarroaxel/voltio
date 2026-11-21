"use client";

import { useEffect, useRef, useState } from "react";
import { useUI } from "@/store/ui-store";
import { useLanguage } from "@/i18n/LanguageContext";
import { fmt } from "@/lib/format";
import { renderSub } from "@/components/ui/Sub";

export interface BarSeries {
  label: string;
  color: string;
  /** Valor de cada armónica; índice 0 = orden 1. */
  values: number[];
}

interface SpectrumChartProps {
  series: BarSeries[];
  xLabel: string;
  yLabel: string;
  height?: number;
  yDecimals?: number;
}

const PAD = { top: 16, right: 16, bottom: 44, left: 56 };

/** Barras agrupadas por orden de armónica (Canvas 2D, sin librerías). */
export function SpectrumChart({
  series,
  xLabel,
  yLabel,
  height = 260,
  yDecimals = 0,
}: SpectrumChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { state } = useUI();
  const { language } = useLanguage();
  // Ancho disponible: se vuelve a medir al redimensionar (p. ej. rotar el
  // teléfono) para que el gráfico nunca desborde su tarjeta.
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

    const isDark = state.theme === "dark";
    const axisColor = isDark ? "#52525b" : "#d4d4d8";
    const gridColor = isDark ? "#27272a" : "#f1f1f4";
    const textColor = isDark ? "#a1a1aa" : "#71717a";
    const tripleBg = isDark ? "rgba(167,139,250,0.10)" : "rgba(124,58,237,0.07)";

    const cssW = wrap.clientWidth || 600;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(height * dpr);
    // 100 % (no px fijos) para que el canvas no fuerce el ancho de la tarjeta.
    canvas.style.width = "100%";
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, height);

    const n = Math.max(...series.map((s) => s.values.length), 0);
    if (n === 0) return;
    const yMax = Math.max(1e-9, ...series.flatMap((s) => s.values)) * 1.1;

    const plotW = cssW - PAD.left - PAD.right;
    const plotH = height - PAD.top - PAD.bottom;
    const slot = plotW / n;
    const sy = (y: number) => PAD.top + plotH - (y / yMax) * plotH;

    ctx.font = "11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";

    // Fondo suave en los órdenes múltiplos de 3 (secuencia homopolar).
    for (let i = 0; i < n; i++) {
      if ((i + 1) % 3 === 0) {
        ctx.fillStyle = tripleBg;
        ctx.fillRect(PAD.left + i * slot, PAD.top, slot, plotH);
      }
    }

    const TICKS = 4;
    ctx.strokeStyle = gridColor;
    ctx.fillStyle = textColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= TICKS; i++) {
      const y = (i / TICKS) * yMax;
      const py = sy(y);
      ctx.beginPath();
      ctx.moveTo(PAD.left, py);
      ctx.lineTo(cssW - PAD.right, py);
      ctx.stroke();
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(fmt(y, yDecimals), PAD.left - 8, py);
    }

    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(PAD.left, PAD.top);
    ctx.lineTo(PAD.left, height - PAD.bottom);
    ctx.lineTo(cssW - PAD.right, height - PAD.bottom);
    ctx.stroke();

    // Barras
    const groupW = slot * 0.8;
    const barW = groupW / series.length;
    series.forEach((s, si) => {
      ctx.fillStyle = s.color;
      s.values.forEach((v, i) => {
        const x = PAD.left + i * slot + (slot - groupW) / 2 + si * barW;
        const y = sy(v);
        ctx.fillRect(x, y, Math.max(1, barW - 1), height - PAD.bottom - y);
      });
    });

    // Etiquetas de orden (impares siempre; pares sólo si hay lugar).
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const labelEvery = slot < 16 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      if (labelEvery === 2 && (i + 1) % 2 === 0) continue;
      ctx.fillText(String(i + 1), PAD.left + i * slot + slot / 2, height - PAD.bottom + 8);
    }

    ctx.textBaseline = "bottom";
    ctx.fillText(xLabel, PAD.left + plotW / 2, height - 6);
    ctx.save();
    ctx.translate(14, PAD.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
  }, [series, xLabel, yLabel, height, yDecimals, state.theme, width]);

  const summary = series
    .map((s) => {
      const top = s.values
        .map((v, i) => ({ v, h: i + 1 }))
        .filter((x) => x.v > 0)
        .sort((a, b) => b.v - a.v)
        .slice(0, 3)
        .map((x) => `h=${x.h}: ${fmt(x.v, yDecimals)}`)
        .join(", ");
      return `${s.label.replace(/_/g, "")}: ${top || "—"}`;
    })
    .join("; ");
  const ariaLabel =
    (language === "es"
      ? `Espectro de armónicas. Mayores componentes: `
      : `Harmonic spectrum. Largest components: `) + summary;

  return (
    <div>
      <div ref={wrapRef} className="w-full">
        <canvas ref={canvasRef} className="block" role="img" aria-label={ariaLabel} />
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {series.map((s, i) => (
          <span
            key={`${s.label}-${i}`}
            className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            {renderSub(s.label)}
          </span>
        ))}
      </div>
    </div>
  );
}
