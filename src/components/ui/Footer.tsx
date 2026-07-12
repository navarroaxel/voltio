"use client";

import { useLanguage } from "@/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-8 border-t border-neutral-200 px-4 py-6 text-sm text-neutral-500 sm:px-6 dark:border-neutral-800 dark:text-neutral-400">
      <div className="mx-auto max-w-6xl space-y-2">
        <p>
          <span className="font-medium text-neutral-700 dark:text-neutral-200">
            Voltio
          </span>{" "}
          {t("common.footer.intro_prefix")}{" "}
          <span className="font-medium">
            {t("common.footer.intro_subject")}
          </span>{" "}
          {t("common.footer.intro_suffix")}
        </p>
        <p>{t("common.footer.course_line")}</p>
        <p className="text-xs">{t("common.footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
