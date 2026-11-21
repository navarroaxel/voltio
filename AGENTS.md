<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Voltio — project context

Coursework platform for **Electrotécnica I (UTN FRBA)**. A fully client-side Next.js 16 (App Router) app, in **Spanish**. No server data fetching, no middleware. Sibling of the Resonara project, from which it takes its stack and conventions.

## Assignments (TPs)

| Route                          | Assignment                                    | Status |
| ------------------------------ | ---------------------------------------------- | ------ |
| `/`                             | TP index                                       | —      |
| `/resonancia`                   | TP1 Resonance — theory + objectives            | active |
| `/resonancia/part-a`            | Part A: series RLC, sweeps C                   | active |
| `/resonancia/part-b`            | Part B: series RLC, sweeps f                   | active |
| `/resonancia/questionnaire`     | Questionnaire (5 questions)                    | active |
| `/circuitos-acoplados`          | TP2 Coupled circuits — theory + objectives     | active |
| `/circuitos-acoplados/part-a`   | Part A: transformer L1/L2/M12/M21/K (live inputs, no lab data yet) | active |
| `/circuitos-acoplados/part-b`   | Part B: homologous terminals — DC, AC ammeter, AC voltmeter methods | active |
| `/trifasica`                    | TP3 Three-phase circuits — theory + objectives | active |
| `/trifasica/ensayos`            | Measured star-load tests (4 states), phasor diagram, model comparison | active |
| `/trifasica/simulador`          | Star-point / neutral simulator (capacitor or inductor in phase S) | active |
| `/trifasica/cuestionario`       | Handout questionnaire (4 questions) | active |
| `/poliarmonicas`                | TP4 Polyharmonic regime — theory + objectives (the course handout numbers it TP N°5) | active |
| `/poliarmonicas/ensayos`        | Viewer of the measured tests (Fluke captures, readings, estimated THD) | active |
| `/poliarmonicas/simulador`      | Grid-interference simulator (distorted voltage, simulated currents and neutral) | active |

Keep `TPS` in `src/app/page.tsx` and the `GROUPS` map in `src/components/ui/Nav.tsx` as the authoritative sources.

## Architecture

- **Engine**: `src/lib/rlc-engine.ts` is pure TypeScript (no React); all the series-RLC math lives there. It is tested directly with Vitest (`npm test`). Do not mock the engine in component tests.
- **Units**: the engine works in SI (L in H, **C in farads**). The tables in `src/lib/measured-data.ts` store C in µF and convert with `UF` (1e-6) when calling the engine.
- **Measured data**: `src/lib/measured-data.ts` holds the tables transcribed from the report (`lab-resonancia.pdf`) and the constants for each experiment. The Part B R/L/C values are **estimated** (the assignment leaves them blank; `PART_B_ESTIMATED` flag) — a single place to replace with the real ones. `PART_B_RESONANCE` derives the measured resonance row (max U_RS) and is the authoritative source for citing the peak in conclusions and the questionnaire.
- **TP2 (circuitos acoplados) has no measured-data table yet** — the lab hasn't been run. `src/lib/transformer-engine.ts` is the pure engine (calcTransformerParams, homologousByCurrent, homologousByVoltage); readings are entered live via `NumberField` into `circuitos-a-store.tsx`/`circuitos-b-store.tsx` instead of being hardcoded. Once the lab data exists, consider adding a `TRANSFORMER_MEASURED`-style table to `transformer-data.ts` following the TP1 pattern.
- **TP4 (poliarmónicas)**: `src/lib/harmonics-engine.ts` is the pure time-domain engine (grid voltage with harmonics → load current → DFT analysis, plus the three-phase neutral as the sum of three phase-shifted copies). `src/lib/poliarmonicas-data.ts` holds the readings transcribed from the Fluke 435 captures (`public/poliarmonicas/capturas/`, 09/11/2017) and the load-model parameters. There is **no harmonic spectrum** in the captures, so the per-test THD is only an *estimate* (√(I_RMS² − I₁²)/I₁ from the same screen). The rectifier (CFL/LED) and magnetizing (unloaded transformer) models are calibrated with `scripts/calibrate-harmonics.mjs` against I_RMS, I₁ and φ₁ of the single-phase captures; the **neutral current is not fitted**, it is the validation (tests compare it with the measured three-phase tests). Never present simulated values as measured; the simulator page carries a "SIMULACIÓN" banner. Some readings are `null` on purpose (not legible in any capture) — do not fill them from another capture. Tests: `src/lib/__tests__/harmonics-engine.test.ts`.
- **TP3 (trifásica)**: `src/lib/three-phase-engine.ts` is the pure phasor solver for a star load (complex helpers, Millman star-point displacement without neutral, neutral current with it, Aron W1/W2 with S common). `src/lib/trifasica-data.ts` holds the four measured states transcribed from the group's report (`lab3.pdf`, §5.2 table + §6.c phasors); nothing there is estimated. The model uses R = 123 Ω and 16 µF (X ≈ 199 Ω) from the report and is **not tuned** to the readings — tests compare it with them (U_N 43 V ∠ −72°, I_N 1,14 A ∠ −60°, phase voltages 191/218/264 V). Model power (≈ 1200 W) sits below the wattmeter readings (1240–1300 W); the page says so instead of hiding it. `PhasorDiagram` draws either a solved state or a measured one (`trifasica-view.ts`). The inductor case has no lab measurement and is labeled as simulation only. Tests: `src/lib/__tests__/three-phase-engine.test.ts`.
- **Analysis vs measurement**: Part A conclusions quantify with the engine (Q, I_max); the questionnaire and Part B conclusions **cite measured values** (`PART_B_RESONANCE`), not calculations from the estimates, except for hypothetical scenarios (e.g. Part B at 50 Hz), which are labeled as theoretical projections.
- **State**: each simulator has its own Context + `useReducer` in `src/store/`. Circuit parameters are **fixed** (from the assignment); what's interactive is picking the operating point, toggling charts, and stepping through phasors.
- **Charts**: plain Canvas 2D, no library. `charts/LineChart.tsx` is generic (theoretical lines + measured points). Each draw reads the theme inside the `useEffect` via `useUI()` (key `state.theme`) and includes it in the deps so it redraws on theme change.
- **Dark mode**: class-based (`.dark` on `<html>`). Tailwind v4 needs `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` (already present). The theme is managed by `ui-store.tsx` + an inline script in `layout.tsx`.
- **Formatting**: `fmt(n, dec)` (`src/lib/format.ts`) returns `'—'` for non-finite values and uses a **decimal comma**. Use it for every derived metric.

## Invariants

- C = 0 ⇒ open capacitor: `calcRLC` returns I = 0, U_C = U, Z = ∞ (never divides by zero).
- `RLCResult` includes `R` and `RL` so the diagrams can reconstruct the phasors.
- Every visible string goes through the i18n layer (`src/i18n/`, dict files per feature registered in `LanguageContext.tsx`) — Spanish is the primary/default language, English is the secondary one. Never hardcode a user-visible string in a component.

## Testing

`npm test` runs `src/lib/__tests__/rlc-engine.test.ts`: it validates the engine against the lab's measured points (with tolerance for scatter) and the resonance values. Keep them green.
