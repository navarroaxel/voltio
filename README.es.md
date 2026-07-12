# Voltio

Plataforma de Trabajos Prácticos de **Electrotécnica I (UTN FRBA)**. App [Next.js 16](https://nextjs.org) (App Router) totalmente client-side, en **español**, con simuladores y análisis de los ensayos de laboratorio.

> English version: [`README.md`](./README.md)

## TPs

| Ruta                       | TP                                       | Estado |
| -------------------------- | ---------------------------------------- | ------ |
| `/`                        | Índice de TPs                            | —      |
| `/resonancia`              | TP1 Resonancia — teoría + objetivos      | activo |
| `/resonancia/parte-a`      | Parte A: RLC serie, se varía C (50 Hz)   | activo |
| `/resonancia/parte-b`      | Parte B: RLC serie, se varía la f (GAF)  | activo |
| `/resonancia/cuestionario` | Cuestionario (5 preguntas con análisis)  | activo |

Próximos TPs (trifásica, poliarmónicas, acoplados) se agregan como rutas nuevas (`/trifasica/...`, etc.).

## Stack

- **Next.js 16** (App Router, Turbopack) — sin data fetching de servidor ni middleware.
- **React** con Context + `useReducer` por simulador (`src/store/`).
- **Tailwind CSS v4** — dark mode class-based.
- **Canvas 2D puro** para los gráficos (líneas teóricas + puntos medidos, fasores, triángulo de impedancia); sin librerías de charting.
- **TypeScript**; motor de cálculo (`src/lib/rlc-engine.ts`) en TS puro, sin React.
- **Vitest** para testear el motor contra los datos del laboratorio.

## Estructura

```
src/
  app/                      # rutas (App Router)
    page.tsx                # índice de TPs (array TPS)
    resonancia/             # TP1
      page.tsx              # teoría + objetivos
      parte-a/              # barrido de C (medido) y de f (punto 6d)
      parte-b/              # barrido de frecuencia
      cuestionario/         # preguntas + análisis
  components/
    charts/                 # LineChart, PhasorDiagram, ImpedanceTriangle (canvas)
    sim/                    # CircuitSchematic, DataTable, MetricsGrid, etc.
    ui/                     # Nav, Header, Footer, Card, ThemeToggle
  lib/
    rlc-engine.ts           # matemática del RLC serie (TS puro)
    measured-data.ts        # tablas y constantes de los ensayos
    format.ts               # fmt() — coma decimal, '—' para no finitos
    __tests__/              # tests del motor
  store/                    # Context + useReducer por simulador + tema
```

Los datos del laboratorio (`src/lib/measured-data.ts`) provienen del informe `lab-resonancia.pdf`. Las tablas medidas de la Parte A y la Parte B están transcriptas tal cual; los valores de elementos R/L/C de la Parte B son **estimados** (el enunciado los deja en blanco) y reproducen la f₀ y el Q de la curva medida.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run build    # build de producción
npm test         # tests del motor RLC
```

Ver [`AGENTS.md`](./AGENTS.md) para las convenciones de arquitectura del proyecto.
