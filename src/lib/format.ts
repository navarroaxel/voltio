/**
 * Formatea un número con coma decimal (convención en español).
 * Devuelve "—" para valores no finitos (NaN/Infinity), como en el TP.
 */
export function fmt(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(decimals).replace(".", ",");
}

