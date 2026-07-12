# Voltio

Coursework platform for **Electrotécnica I (UTN FRBA)**. A fully client-side [Next.js 16](https://nextjs.org) (App Router) app, in **Spanish**, with simulators and analysis of the lab experiments.

> Versión en español: [`README.es.md`](./README.es.md)

## Assignments (TPs)

| Route                      | Assignment                                    | Status |
| -------------------------- | --------------------------------------------- | ------ |
| `/`                        | TP index                                      | —      |
| `/resonancia`              | TP1 Resonance — theory + objectives           | active |
| `/resonancia/parte-a`      | Part A: series RLC, sweeping C (50 Hz)        | active |
| `/resonancia/parte-b`      | Part B: series RLC, sweeping frequency (GAF)  | active |
| `/resonancia/cuestionario` | Questionnaire (5 questions with analysis)     | active |

Upcoming assignments (three-phase, polyharmonic, coupled circuits) are added as new routes (`/trifasica/...`, etc.).

## Stack

- **Next.js 16** (App Router, Turbopack) — no server data fetching, no middleware.
- **React** with Context + `useReducer` per simulator (`src/store/`).
- **Tailwind CSS v4** — class-based dark mode.
- **Plain Canvas 2D** for the charts (theoretical lines + measured points, phasors, impedance triangle); no charting library.
- **TypeScript**; the calculation engine (`src/lib/rlc-engine.ts`) is pure TS, no React.
- **Vitest** to test the engine against the lab data.

## Structure

```
src/
  app/                      # routes (App Router)
    page.tsx                # TP index (TPS array)
    resonancia/             # TP1
      page.tsx              # theory + objectives
      parte-a/              # C sweep (measured) and f sweep (point 6d)
      parte-b/              # frequency sweep
      cuestionario/         # questions + analysis
  components/
    charts/                 # LineChart, PhasorDiagram, ImpedanceTriangle (canvas)
    sim/                    # CircuitSchematic, DataTable, MetricsGrid, etc.
    ui/                     # Nav, Header, Footer, Card, ThemeToggle
  lib/
    rlc-engine.ts           # series RLC math (pure TS)
    measured-data.ts        # experiment tables and constants
    format.ts               # fmt() — decimal comma, '—' for non-finite values
    __tests__/              # engine tests
  store/                    # Context + useReducer per simulator + theme
```

The lab data (`src/lib/measured-data.ts`) comes from the `lab-resonancia.pdf` report. The Part A and Part B measured tables are transcribed verbatim; the Part B R/L/C element values are **estimated** (the assignment leaves them blank) and reproduce the measured curve's f₀ and Q.

Note: the app's visible strings are in Spanish (no i18n layer) by design — only the docs are bilingual.

## Development

```bash
npm install
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm test         # RLC engine tests
```

See [`AGENTS.md`](./AGENTS.md) for the project's architecture conventions.
