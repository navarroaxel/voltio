"use client";

import { useEffect, useRef } from "react";
import { useUI } from "@/store/ui-store";
import type { RLCResult } from "@/lib/types";
import { fmt } from "@/lib/format";

interface PhasorDiagramProps {
  result: RLCResult;
  height?: number;
}

function arrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 2,
  dashed = false,
) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 0.5) return;
  const head = Math.min(9, len * 0.4);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dashed ? [5, 4] : []);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - head * Math.cos(ang - Math.PI / 6),
    y2 - head * Math.sin(ang - Math.PI / 6),
  );
  ctx.lineTo(
    x2 - head * Math.cos(ang + Math.PI / 6),
    y2 - head * Math.sin(ang + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
}

/** Dibuja texto con subíndices (notación "U_L") en canvas, alineado a la izquierda. */
function drawWithSub(ctx: CanvasRenderingContext2D, x: number, y: number, str: string) {
  const baseFont = ctx.font;
  const small = baseFont.replace(/(\d+(?:\.\d+)?)px/, (_, n) => `${+n * 0.72}px`);
  const parts = str.split(/_([A-Za-z0-9]+)/); // [normal, sub, normal, sub, …]
  const prevAlign = ctx.textAlign;
  ctx.textAlign = "left";
  let cx = x;
  parts.forEach((p, i) => {
    if (p === "") return;
    const isSub = i % 2 === 1;
    ctx.font = isSub ? small : baseFont;
    ctx.fillText(p, cx, y + (isSub ? 3 : 0));
    cx += ctx.measureText(p).width;
  });
  ctx.font = baseFont;
  ctx.textAlign = prevAlign;
}

const COL = {
  UR: "#2563eb",
  UL: "#dc2626",
  UC: "#16a34a",
};

export function PhasorDiagram({ result, height = 300 }: PhasorDiagramProps) {
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
    const fg = isDark ? "#e5e5e5" : "#171717";
    const muted = isDark ? "#71717a" : "#a1a1aa";
    const iCol = isDark ? "#f59e0b" : "#d97706";

    const cssW = wrap.clientWidth || 400;
    const cssH = height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI";

    const { I, UR, UC, XL, RL } = result;

    if (!(I > 0)) {
      ctx.fillStyle = muted;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "I = 0 — capacitor abierto, no hay diagrama fasorial",
        cssW / 2,
        cssH / 2,
      );
      return;
    }

    // Vectores de tensión en "espacio de volts" (y hacia arriba = +).
    const ULx = I * RL;
    const ULy = I * XL;
    const O = { x: 0, y: 0 };
    const A = { x: UR, y: 0 }; // tip de UR
    const B = { x: UR + ULx, y: ULy }; // tip de UL
    const Cp = { x: UR + ULx, y: ULy - UC }; // tip de UC = tip de U

    const xs = [O.x, A.x, B.x, Cp.x];
    const ys = [O.y, A.y, B.y, Cp.y];
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    const spanX = xMax - xMin || 1;
    const spanY = yMax - yMin || 1;

    const pad = 46;
    const scale = Math.min((cssW - 2 * pad) / spanX, (cssH - 2 * pad) / spanY);

    // Origen en pixels: centrar el bounding box.
    const ox = pad - xMin * scale + (cssW - 2 * pad - spanX * scale) / 2;
    const oy = cssH - pad + yMin * scale - (cssH - 2 * pad - spanY * scale) / 2;
    const px = (x: number) => ox + x * scale;
    const py = (y: number) => oy - y * scale;

    // Ejes de referencia que pasan por el origen.
    ctx.strokeStyle = isDark ? "#27272a" : "#f1f1f4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad / 2, py(0));
    ctx.lineTo(cssW - pad / 2, py(0));
    ctx.moveTo(px(0), pad / 2);
    ctx.lineTo(px(0), cssH - pad / 2);
    ctx.stroke();

    // Corriente de referencia (eje +x), longitud fija.
    const iLen = Math.min(70, (cssW - 2 * pad) * 0.35);
    arrow(ctx, px(0), py(0), px(0) + iLen, py(0), iCol, 2, true);
    ctx.fillStyle = iCol;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("I (ref)", px(0) + iLen + 4, py(0) + 4);

    // Polígono tip-to-tail: UR → UL → UC.
    arrow(ctx, px(O.x), py(O.y), px(A.x), py(A.y), COL.UR, 2);
    arrow(ctx, px(A.x), py(A.y), px(B.x), py(B.y), COL.UL, 2);
    arrow(ctx, px(B.x), py(B.y), px(Cp.x), py(Cp.y), COL.UC, 2);

    // Resultante U (de origen al tip final), en grueso.
    arrow(ctx, px(O.x), py(O.y), px(Cp.x), py(Cp.y), fg, 3);

    // Etiquetas
    const label = (
      x: number,
      y: number,
      text: string,
      color: string,
      dx = 6,
      dy = -6,
    ) => {
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      drawWithSub(ctx, x + dx, y + dy, text);
    };
    label((px(O.x) + px(A.x)) / 2, py(0), `U_R`, COL.UR, 0, 14);
    label((px(A.x) + px(B.x)) / 2, (py(A.y) + py(B.y)) / 2, `U_L`, COL.UL);
    label((px(B.x) + px(Cp.x)) / 2, (py(B.y) + py(Cp.y)) / 2, `U_C`, COL.UC);

    // Magnitudes en esquina superior izquierda (sin solaparse ni recortarse)
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = fg;
    ctx.fillText(`U = ${fmt(result.Z * I, 1)} V`, 10, 8);
    ctx.fillStyle = COL.UL;
    drawWithSub(ctx, 10, 26, `U_L = ${fmt(result.UL, 1)} V`);
    ctx.fillStyle = COL.UC;
    drawWithSub(ctx, 10, 44, `U_C = ${fmt(result.UC, 1)} V`);

    // φ
    ctx.fillStyle = muted;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(`φ = ${fmt(result.phiDeg, 1)}°`, cssW - 8, cssH - 8);
  }, [result, height, state.theme]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
