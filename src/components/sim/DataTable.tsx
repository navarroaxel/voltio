import React from "react";
import { renderSub } from "@/components/ui/Sub";

export interface Column {
  label: string;
  sub?: string; // unidad o subtítulo
}

interface DataTableProps {
  columns: Column[];
  rows: React.ReactNode[][];
  highlightRow?: number;
  caption?: string;
}

export function DataTable({
  columns,
  rows,
  highlightRow,
  caption,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {caption ? (
          <caption className="mb-2 text-left text-xs text-neutral-500 dark:text-neutral-400">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-700">
            {columns.map((c, i) => (
              <th
                key={i}
                className="px-2 py-1.5 text-right font-semibold whitespace-nowrap first:text-left"
              >
                {renderSub(c.label)}
                {c.sub ? (
                  <span className="block text-xs font-normal text-neutral-400">
                    {c.sub}
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr
              key={r}
              className={
                r === highlightRow
                  ? "bg-blue-50 dark:bg-blue-950/40"
                  : "border-b border-neutral-100 dark:border-neutral-800/60"
              }
            >
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="px-2 py-1.5 text-right whitespace-nowrap tabular-nums first:text-left first:font-medium"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
