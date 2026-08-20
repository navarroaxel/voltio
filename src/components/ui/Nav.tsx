"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";

const HOME_LINK = { href: "/", labelKey: "common.nav.home" } as const;

const GROUPS: Record<string, { href: string; labelKey: string }[]> = {
  "/resonancia": [
    { href: "/resonancia", labelKey: "common.nav.theory" },
    { href: "/resonancia/part-a", labelKey: "common.nav.partA" },
    { href: "/resonancia/part-b", labelKey: "common.nav.partB" },
    { href: "/resonancia/questionnaire", labelKey: "common.nav.quiz" },
  ],
  "/circuitos-acoplados": [
    { href: "/circuitos-acoplados", labelKey: "common.nav.theory" },
    { href: "/circuitos-acoplados/part-a", labelKey: "common.nav.partA" },
    { href: "/circuitos-acoplados/part-b", labelKey: "common.nav.partB" },
  ],
};

export function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const activeGroup = Object.keys(GROUPS).find((base) =>
    pathname?.startsWith(base),
  );
  const links = [HOME_LINK, ...(activeGroup ? GROUPS[activeGroup] : [])];

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {links.map((link) => {
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
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
