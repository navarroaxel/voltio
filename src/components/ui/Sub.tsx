import React from "react";

/**
 * Renders a symbol with underscore notation as a real subscript:
 * "U_R" → U<sub>R</sub>, "U_RS" → U<sub>RS</sub>. Segments without "_" are
 * returned as-is. Usage: {renderSub(label)}.
 */
export function renderSub(label: string): React.ReactNode {
  const parts = label.split(/_([A-Za-z0-9]+)/); // [base, sub, base, sub, …]
  return parts.map((p, i) =>
    p === "" ? null : i % 2 === 1 ? <sub key={i}>{p}</sub> : <React.Fragment key={i}>{p}</React.Fragment>,
  );
}
