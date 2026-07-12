"use client";

import { useEffect, useRef } from "react";
import { useUI } from "@/store/ui-store";
import type { RLCResult } from "@/lib/types";
import { fmt } from "@/lib/format";

interface ImpedanceTriangleProps {
  result: RLCResult;
  height?: number;
}

/**
 * Triángulo de impedancia: cateto horizontal Rtot, cateto vertical X = XL−XC,
 * hipotenusa Z y ángulo φ. (Objetivo B del TP: diagramas de impedancia.)
 */
export function ImpedanceTriangle({
  result,
  height = 240,
}: ImpedanceTriangleProps) {
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

    const cssW = wrap.clientWidth || 360;
    const cssH = height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI";

    const { Rtot, X } = result;
    if (!Number.isFinite(Rtot) || !Number.isFinite(X)) {
      ctx.fillStyle = muted;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Z → ∞ (capacitor abierto)", cssW / 2, cssH / 2);
      return;
    }

    const pad = 44;
    const spanX = Math.max(Math.abs(Rtot), 1);
    const spanY = Math.max(Math.abs(X), 1);
    const scale = Math.min((cssW - 2 * pad) / spanX, (cssH - 2 * pad) / spanY);

    // Origen abajo-izquierda; X positivo (inductivo) hacia arriba.
    const ox = pad;
    const oy = cssH / 2;
    const px = (x: number) => ox + x * scale;
    const py = (y: number) => oy - y * scale;

    // Catetos
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#2563eb"; // Rtot
    ctx.beginPath();
    ctx.moveTo(px(0), py(0));
    ctx.lineTo(px(Rtot), py(0));
    ctx.stroke();

    ctx.strokeStyle = X >= 0 ? "#dc2626" : "#16a34a"; // X (ind/cap)
    ctx.beginPath();
    ctx.moveTo(px(Rtot), py(0));
    ctx.lineTo(px(Rtot), py(X));
    ctx.stroke();

    // Hipotenusa Z
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px(0), py(0));
    ctx.lineTo(px(Rtot), py(X));
    ctx.stroke();

    // Etiquetas en esquinas fijas (legibles sea cual sea la forma del triángulo)
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = fg;
    ctx.fillText(`Z = ${fmt(result.Z, 0)} Ω`, 10, 8);
    ctx.fillStyle = "#2563eb";
    ctx.fillText(`R = ${fmt(Rtot, 0)} Ω`, 10, 26);
    ctx.fillStyle = X >= 0 ? "#dc2626" : "#16a34a";
    ctx.fillText(
      `X = ${fmt(X, 0)} Ω (${X >= 0 ? "inductivo" : "capacitivo"})`,
      10,
      44,
    );

    ctx.fillStyle = muted;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(`φ = ${fmt(result.phiDeg, 1)}°`, cssW - 10, cssH - 8);
  }, [result, height, state.theme]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
