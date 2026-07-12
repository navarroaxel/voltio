"use client";

import { useEffect, useRef } from "react";
import { useUI } from "@/store/ui-store";
import { fmt } from "@/lib/format";
import { renderSub } from "@/components/ui/Sub";

export interface Point {
  x: number;
  y: number;
}

export interface Series {
  label: string;
  color: string;
  points: Point[];
  /** "line" = continuous theoretical curve; "scatter" = measured points. */
  kind?: "line" | "scatter";
  dashed?: boolean;
}

export interface Marker {
  x: number;
  label?: string;
  color?: string;
}

interface LineChartProps {
  series: Series[];
  xLabel: string;
  yLabel: string;
  markers?: Marker[];
  height?: number;
  /** Force y minimum to 0 (defaults to true). */
  yFromZero?: boolean;
  /** Decimal places on the Y-axis ticks. */
  yDecimals?: number;
  xDecimals?: number;
}

const PAD = { top: 16, right: 16, bottom: 44, left: 56 };

export function LineChart({
  series,
  xLabel,
  yLabel,
  markers = [],
  height = 280,
  yFromZero = true,
  yDecimals = 1,
  xDecimals = 0,
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { state } = useUI();

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

    const cssW = wrap.clientWidth || 600;
    const cssH = height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const allPts = series.flatMap((s) => s.points);
    if (allPts.length === 0) return;

    let xMin = Math.min(...allPts.map((p) => p.x));
    let xMax = Math.max(...allPts.map((p) => p.x));
    const yMin = yFromZero ? 0 : Math.min(...allPts.map((p) => p.y));
    let yMax = Math.max(...allPts.map((p) => p.y));
    if (xMin === xMax) {
      xMin -= 1;
      xMax += 1;
    }
    if (yMin === yMax) {
      yMax += 1;
    }
    // 8% top margin.
    yMax += (yMax - yMin) * 0.08;

    const plotW = cssW - PAD.left - PAD.right;
    const plotH = cssH - PAD.top - PAD.bottom;
    const sx = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW;
    const sy = (y: number) =>
      PAD.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

    // Grid + ticks
    const TICKS = 5;
    ctx.font = "11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillStyle = textColor;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let i = 0; i <= TICKS; i++) {
      const t = i / TICKS;
      const y = yMin + t * (yMax - yMin);
      const py = sy(y);
      ctx.beginPath();
      ctx.moveTo(PAD.left, py);
      ctx.lineTo(cssW - PAD.right, py);
      ctx.stroke();
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(fmt(y, yDecimals), PAD.left - 8, py);
    }
    for (let i = 0; i <= TICKS; i++) {
      const t = i / TICKS;
      const x = xMin + t * (xMax - xMin);
      const px = sx(x);
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(fmt(x, xDecimals), px, cssH - PAD.bottom + 8);
    }

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(PAD.left, PAD.top);
    ctx.lineTo(PAD.left, cssH - PAD.bottom);
    ctx.lineTo(cssW - PAD.right, cssH - PAD.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(xLabel, PAD.left + plotW / 2, cssH - 6);
    ctx.save();
    ctx.translate(14, PAD.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Vertical markers
    for (const m of markers) {
      const px = sx(m.x);
      ctx.strokeStyle = m.color ?? (isDark ? "#a78bfa" : "#7c3aed");
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(px, PAD.top);
      ctx.lineTo(px, cssH - PAD.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      if (m.label) {
        ctx.fillStyle = m.color ?? (isDark ? "#a78bfa" : "#7c3aed");
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(m.label, px, PAD.top + 2);
      }
    }

    // Series
    for (const s of series) {
      const pts = s.points;
      if (pts.length === 0) continue;
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      if (s.kind === "scatter") {
        for (const p of pts) {
          ctx.beginPath();
          ctx.arc(sx(p.x), sy(p.y), 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.lineWidth = 2;
        ctx.setLineDash(s.dashed ? [5, 4] : []);
        ctx.beginPath();
        pts.forEach((p, i) => {
          const px = sx(p.x);
          const py = sy(p.y);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [
    series,
    xLabel,
    yLabel,
    markers,
    height,
    yFromZero,
    yDecimals,
    xDecimals,
    state.theme,
  ]);

  return (
    <div>
      <div ref={wrapRef} className="w-full">
        <canvas ref={canvasRef} className="block" />
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {series.map((s, i) => (
          <span
            key={`${s.label}-${s.kind ?? "line"}-${i}`}
            className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {renderSub(s.label)}
            {s.kind === "scatter" ? " (medido)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
