"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

interface TPCard {
  n: number;
  titleKey: string;
  descKey: string;
  href?: string;
}

const TPS: TPCard[] = [
  {
    n: 1,
    titleKey: "home.tp1.title",
    descKey: "home.tp1.desc",
    href: "/resonancia",
  },
  {
    n: 2,
    titleKey: "home.tp2.title",
    descKey: "home.tp2.desc",
    href: "/circuitos-acoplados",
  },
  {
    n: 3,
    titleKey: "home.tp3.title",
    descKey: "home.tp3.desc",
    href: "/trifasica",
  },
  {
    n: 4,
    titleKey: "home.tp4.title",
    descKey: "home.tp4.desc",
    href: "/poliarmonicas",
  },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("home.heading")}
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          {t("home.intro")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TPS.map((tp) => {
          const inner = (
            <>
              <div>
                <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  {t("home.tp.prefix")}
                  {tp.n}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-semibold">{t(tp.titleKey)}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                {t(tp.descKey)}
              </p>
            </>
          );
          return tp.href ? (
            <Link
              key={tp.n}
              href={tp.href}
              className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={tp.n}
              className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-5 opacity-70 dark:border-neutral-800 dark:bg-neutral-900/40"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </main>
  );
}
