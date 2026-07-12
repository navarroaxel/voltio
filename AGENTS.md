<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Voltio — project context

Coursework platform for **Electrotécnica I (UTN FRBA)**. A fully client-side Next.js 16 (App Router) app, in **Spanish**. No server data fetching, no middleware. Sibling of the Resonara project, from which it takes its stack and conventions.

## Assignments (TPs)

| Route                      | Assignment                          | Status |
| -------------------------- | ----------------------------------- | ------ |
| `/`                        | TP index                            | —      |
| `/resonancia`              | TP1 Resonance — theory + objectives | active |
| `/resonancia/part-a`        | Part A: series RLC, sweeps C       | active |
| `/resonancia/part-b`        | Part B: series RLC, sweeps f       | active |
| `/resonancia/questionnaire` | Questionnaire (5 questions)        | active |

Upcoming assignments (three-phase, polyharmonic, coupled circuits) are added as `/trifasica/...`, etc. Keep `TPS` in `src/app/page.tsx` and `LINKS` in `src/components/ui/Nav.tsx` as the authoritative sources.

## Architecture

- **Engine**: `src/lib/rlc-engine.ts` is pure TypeScript (no React); all the series-RLC math lives there. It is tested directly with Vitest (`npm test`). Do not mock the engine in component tests.
- **Units**: the engine works in SI (L in H, **C in farads**). The tables in `src/lib/measured-data.ts` store C in µF and convert with `UF` (1e-6) when calling the engine.
- **Measured data**: `src/lib/measured-data.ts` holds the tables transcribed from the report (`lab-resonancia.pdf`) and the constants for each experiment. The Part B R/L/C values are **estimated** (the assignment leaves them blank; `PART_B_ESTIMATED` flag) — a single place to replace with the real ones. `PART_B_RESONANCE` derives the measured resonance row (max U_RS) and is the authoritative source for citing the peak in conclusions and the questionnaire.
- **Analysis vs measurement**: Part A conclusions quantify with the engine (Q, I_max); the questionnaire and Part B conclusions **cite measured values** (`PART_B_RESONANCE`), not calculations from the estimates, except for hypothetical scenarios (e.g. Part B at 50 Hz), which are labeled as theoretical projections.
- **State**: each simulator has its own Context + `useReducer` in `src/store/`. Circuit parameters are **fixed** (from the assignment); what's interactive is picking the operating point, toggling charts, and stepping through phasors.
- **Charts**: plain Canvas 2D, no library. `charts/LineChart.tsx` is generic (theoretical lines + measured points). Each draw reads the theme inside the `useEffect` via `useUI()` (key `state.theme`) and includes it in the deps so it redraws on theme change.
- **Dark mode**: class-based (`.dark` on `<html>`). Tailwind v4 needs `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` (already present). The theme is managed by `ui-store.tsx` + an inline script in `layout.tsx`.
- **Formatting**: `fmt(n, dec)` (`src/lib/format.ts`) returns `'—'` for non-finite values and uses a **decimal comma**. Use it for every derived metric.

## Invariants

- C = 0 ⇒ open capacitor: `calcRLC` returns I = 0, U_C = U, Z = ∞ (never divides by zero).
- `RLCResult` includes `R` and `RL` so the diagrams can reconstruct the phasors.
- Every visible string is in Spanish; there is no i18n layer.

## Testing

`npm test` runs `src/lib/__tests__/rlc-engine.test.ts`: it validates the engine against the lab's measured points (with tolerance for scatter) and the resonance values. Keep them green.
