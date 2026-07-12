import React from "react";

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      {title ? (
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-neutral-700 dark:text-neutral-200">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
