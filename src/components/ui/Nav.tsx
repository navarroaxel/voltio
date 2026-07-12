"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/resonancia", label: "Teoría" },
  { href: "/resonancia/parte-a", label: "Parte A" },
  { href: "/resonancia/parte-b", label: "Parte B" },
  { href: "/resonancia/cuestionario", label: "Cuestionario" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
