"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import type { ReactiveKind } from "@/lib/three-phase-engine";

/**
 * Star load schematic (TP3): one resistor per phase, an optional reactive
 * element across phase S, Aron wattmeters W1 (phase R) and W2 (phase T) with S
 * common, and the neutral wire (closed or open).
 */
const COLOR = { R: "#dc2626", S: "#16a34a", T: "#2563eb", N: "#d97706" };
const Y = { R: 50, S: 130, T: 210 };
const XSTAR = 400;
const XRES0 = 250;
const XRES1 = 330;

function Resistor({ y, color }: { y: number; color: string }) {
  return (
    <rect
      x={XRES0}
      y={y - 9}
      width={XRES1 - XRES0}
      height={18}
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  );
}

export function StarSchematic({
  reactive,
  neutral,
}: {
  reactive: ReactiveKind;
  neutral: boolean;
}) {
  const { t } = useLanguage();
  const yN = 280;
  const yb = Y.S + 45;
  return (
    <svg
      viewBox="0 0 520 320"
      className="h-auto w-full text-neutral-700 dark:text-neutral-200"
      role="img"
      aria-label={t("tri.schem.aria")}
      fill="currentColor"
    >
      {(["R", "S", "T"] as const).map((p) => (
        <g key={p}>
          <text x={14} y={Y[p] + 4} fontSize={14} fontWeight={700} fill={COLOR[p]}>
            {p}
          </text>
          <path d={`M 34 ${Y[p]} H ${XRES0}`} stroke={COLOR[p]} strokeWidth={2} fill="none" />
          <Resistor y={Y[p]} color={COLOR[p]} />
          <path d={`M ${XRES1} ${Y[p]} H ${XSTAR}`} stroke={COLOR[p]} strokeWidth={2} fill="none" />
        </g>
      ))}
      {/* star point */}
      <path d={`M ${XSTAR} ${Y.R} V ${Y.T}`} stroke="currentColor" strokeWidth={2} fill="none" />
      <circle cx={XSTAR} cy={Y.S} r={4} fill="currentColor" />
      <text x={XSTAR + 10} y={Y.S - 8} fontSize={13} fontWeight={600}>
        N&apos;
      </text>

      {/* wattmeters: W1 in phase R, W2 in phase T */}
      {(["R", "T"] as const).map((p, k) => (
        <g key={p}>
          <circle cx={140} cy={Y[p]} r={16} fill="none" stroke="currentColor" strokeWidth={1.8} />
          <text x={140} y={Y[p] + 4} textAnchor="middle" fontSize={11} fontWeight={700}>
            W{k + 1}
          </text>
        </g>
      ))}

      {/* reactive element in parallel with the resistor of phase S */}
      {reactive !== "none" ? (
        <g stroke={COLOR.S} strokeWidth={2} fill="none">
          <path d={`M 240 ${Y.S} V ${yb}`} />
          <path d={`M 340 ${Y.S} V ${yb}`} />
          <circle cx={240} cy={Y.S} r={2.5} fill={COLOR.S} stroke="none" />
          <circle cx={340} cy={Y.S} r={2.5} fill={COLOR.S} stroke="none" />
          {reactive === "capacitor" ? (
            <>
              <path d={`M 240 ${yb} H 284 M 296 ${yb} H 340`} />
              <path d={`M 284 ${yb - 13} V ${yb + 13} M 296 ${yb - 13} V ${yb + 13}`} strokeWidth={2.6} />
            </>
          ) : (
            <>
              <path d={`M 240 ${yb} H 270 M 310 ${yb} H 340`} />
              <path d={`M 270 ${yb} q 5 -12 10 0 q 5 -12 10 0 q 5 -12 10 0 q 5 -12 10 0`} />
            </>
          )}
        </g>
      ) : null}

      {/* neutral */}
      <text x={14} y={yN + 4} fontSize={14} fontWeight={700} fill={COLOR.N}>
        n
      </text>
      <path d={`M 34 ${yN} H 150`} stroke={COLOR.N} strokeWidth={2} fill="none" />
      <path d={`M 250 ${yN} H ${XSTAR} V ${Y.T}`} stroke={COLOR.N} strokeWidth={2} fill="none" />
      {neutral ? (
        <path d="M 150 280 H 250" stroke={COLOR.N} strokeWidth={2} fill="none" />
      ) : (
        <path d="M 150 280 L 242 262" stroke={COLOR.N} strokeWidth={2} fill="none" />
      )}
      <circle cx={150} cy={yN} r={3} fill={COLOR.N} />
      <circle cx={250} cy={yN} r={3} fill={COLOR.N} />
      <text x={200} y={yN + 22} textAnchor="middle" fontSize={11} fill={COLOR.N}>
        {neutral ? t("tri.schem.neutralClosed") : t("tri.schem.neutralOpen")}
      </text>
    </svg>
  );
}
