"use client";

import Link from "next/link";
import { Nav } from "./Nav";
import { SettingsMenu } from "./SettingsMenu";
import { useLanguage } from "@/i18n/LanguageContext";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="border-b border-neutral-200 px-4 py-3 sm:px-6 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-blue-600">
            Voltio
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("common.header.subtitle")}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Nav />
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
