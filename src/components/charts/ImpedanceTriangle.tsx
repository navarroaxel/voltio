"use client";

import { useEffect, useRef } from "react";
import { useUI } from "@/store/ui-store";
import { useLanguage } from "@/i18n/LanguageContext";
import type { RLCResult } from "@/lib/types";
import { fmt } from "@/lib/format";

interface ImpedanceTriangleProps {
  result: RLCResult;
  height?: number;
}

/**
 * Impedance triangle: horizontal leg Rtot, vertical leg X = XL−XC,
 * hypotenuse Z and angle φ. (Assignment objective B: impedance diagrams.)
 */
export function ImpedanceTriangle({
  result,
  height = 240,
}: ImpedanceTriangleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { state } = useUI();
  const { t, language } = useLanguage();

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
      ctx.fillText(t("sim.impedanceTriangle.openCapacitor"), cssW / 2, cssH / 2);
      return;
    }

    const pad = 44;
    const spanX = Math.max(Math.abs(Rtot), 1);
    const spanY = Math.max(Math.abs(X), 1);
    const scale = Math.min((cssW - 2 * pad) / spanX, (cssH - 2 * pad) / spanY);

    // Origin at bottom-left; positive X (inductive) points upward.
    const ox = pad;
    const oy = cssH / 2;
    const px = (x: number) => ox + x * scale;
    const py = (y: number) => oy - y * scale;

    // Legs
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#2563eb"; // Rtot
    ctx.beginPath();
    ctx.moveTo(px(0), py(0));
    ctx.lineTo(px(Rtot), py(0));
    ctx.stroke();

    ctx.strokeStyle = X >= 0 ? "#dc2626" : "#16a34a"; // X (inductive/capacitive)
    ctx.beginPath();
    ctx.moveTo(px(Rtot), py(0));
    ctx.lineTo(px(Rtot), py(X));
    ctx.stroke();

    // Hypotenuse Z
    ctx.strokeStyle = fg;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px(0), py(0));
    ctx.lineTo(px(Rtot), py(X));
    ctx.stroke();

    // Labels in fixed corners (readable regardless of the triangle's shape)
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = fg;
    ctx.fillText(`Z = ${fmt(result.Z, 0)} Ω`, 10, 8);
    ctx.fillStyle = "#2563eb";
    ctx.fillText(`R = ${fmt(Rtot, 0)} Ω`, 10, 26);
    ctx.fillStyle = X >= 0 ? "#dc2626" : "#16a34a";
    ctx.fillText(
      `X = ${fmt(X, 0)} Ω (${
        X >= 0
          ? t("sim.impedanceTriangle.inductive")
          : t("sim.impedanceTriangle.capacitive")
      })`,
      10,
      44,
    );

    ctx.fillStyle = muted;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(`φ = ${fmt(result.phiDeg, 1)}°`, cssW - 10, cssH - 8);
  }, [result, height, state.theme, t, language]);

  const ariaLabel =
    language === "es"
      ? `Triángulo de impedancia: resistencia total R = ${fmt(result.Rtot, 1)} Ω, ` +
        `reactancia X = ${fmt(result.X, 1)} Ω, impedancia Z = ${fmt(result.Z, 1)} Ω, ` +
        `desfasaje φ = ${fmt(result.phiDeg, 1)}°.`
      : `Impedance triangle: total resistance R = ${fmt(result.Rtot, 1)} Ω, ` +
        `reactance X = ${fmt(result.X, 1)} Ω, impedance Z = ${fmt(result.Z, 1)} Ω, ` +
        `phase φ = ${fmt(result.phiDeg, 1)}°.`;

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        className="block"
        role="img"
        aria-label={ariaLabel}
      />
    </div>
  );
}
