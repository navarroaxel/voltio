/**
 * Strict parsing of a numeric text field (decimal comma or dot).
 * Returns null for blank or malformed input ("0,5,5", "1e3", "-"), so a
 * caller can tell "not entered" from a real 0.
 */
export function parseReading(value: string): number | null {
  const s = value.trim().replace(",", ".");
  if (!/^(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Same as parseReading but maps blank/invalid input to 0 (never NaN). */
export function num(value: string): number {
  return parseReading(value) ?? 0;
}
