/**
 * Formats a number with a decimal comma (Spanish convention).
 * Returns "—" for non-finite values (NaN/Infinity), as in the lab report.
 */
export function fmt(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(decimals).replace(".", ",");
}
