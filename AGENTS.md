<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Voltio — contexto del proyecto

Plataforma de TPs de **Electrotécnica I (UTN FRBA)**. App Next.js 16 (App Router) totalmente client-side, en **español**. Sin data fetching de servidor ni middleware. Hermano del proyecto Resonara, del que toma stack y convenciones.

## TPs

| Ruta                       | TP                                  | Estado |
| -------------------------- | ----------------------------------- | ------ |
| `/`                        | Índice de TPs                       | —      |
| `/resonancia`              | TP1 Resonancia — teoría + objetivos | activo |
| `/resonancia/parte-a`      | Parte A: RLC serie, varía C         | activo |
| `/resonancia/parte-b`      | Parte B: RLC serie, varía f         | activo |
| `/resonancia/cuestionario` | Cuestionario (5 preguntas)          | activo |

Próximos TPs (trifásica, poliarmónicas, acoplados) entran como `/trifasica/...`, etc. Mantener `TPS` en `src/app/page.tsx` y `LINKS` en `src/components/ui/Nav.tsx` como fuentes autoritativas.

## Arquitectura

- **Motor**: `src/lib/rlc-engine.ts` es TypeScript puro (sin React); toda la matemática del RLC serie vive ahí. Se testea directo con Jest (`npm test`). No mockear el motor en tests de componentes.
- **Unidades**: el motor trabaja en SI (L en H, **C en faradios**). Las tablas en `src/lib/measured-data.ts` guardan C en µF y se convierten con `UF` (1e-6) al llamar al motor.
- **Datos medidos**: `src/lib/measured-data.ts` contiene las tablas transcriptas del enunciado y las constantes de cada ensayo. Los valores R/L/C de la Parte B son **estimados** (el enunciado los deja en blanco) — un único lugar para reemplazar por los reales.
- **Estado**: cada simulador tiene su Context + `useReducer` en `src/store/`. Parámetros del circuito **fijos** (del TP); lo interactivo es elegir el punto, alternar gráficos y recorrer fasores.
- **Gráficos**: Canvas 2D puro, sin librería. `charts/LineChart.tsx` es genérico (líneas teóricas + puntos medidos). Cada draw lee el tema dentro del `useEffect` vía `useUI()` (clave `state.theme`) y lo incluye en las deps para redibujar al cambiar de tema.
- **Dark mode**: class-based (`.dark` en `<html>`). Tailwind v4 necesita `@custom-variant dark (&:where(.dark, .dark *))` en `globals.css` (ya presente). El tema lo maneja `ui-store.tsx` + script inline en `layout.tsx`.
- **Formato**: `fmt(n, dec)` (`src/lib/format.ts`) devuelve `'—'` para valores no finitos y usa **coma decimal**. Usarlo para toda métrica derivada.

## Invariantes

- C = 0 ⇒ capacitor abierto: `calcRLC` devuelve I = 0, U_C = U, Z = ∞ (nunca divide por cero).
- `RLCResult` incluye `R` y `RL` para que los diagramas reconstruyan los fasores.
- Todo string visible va en español; no hay capa i18n.

## Testing

`npm test` corre `src/lib/__tests__/rlc-engine.test.ts`: valida el motor contra puntos medidos del lab (con tolerancia para la dispersión) y los valores de resonancia. Mantenerlos verdes.
