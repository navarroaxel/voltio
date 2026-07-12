/**
 * Formats a number with a decimal comma (Spanish convention).
 * Returns "—" for non-finite values (NaN/Infinity), as in the lab report.
 */
export function fmt(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return "—";
  let s = n.toFixed(decimals);
  // Drop the spurious minus from negative values that round to zero (and -0),
  // e.g. a −1e-15 residual reactive power showing as "-0,000".
  if (parseFloat(s) === 0) s = s.replace("-", "");
  return s.replace(".", ",");
}
