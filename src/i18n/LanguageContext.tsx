"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import * as common from "./dict/common";
import * as home from "./dict/home";
import * as theory from "./dict/theory";
import * as parta from "./dict/parta";
import * as partb from "./dict/partb";
import * as quiz from "./dict/quiz";
import * as sim from "./dict/sim";
import * as acoplados from "./dict/acoplados";

export type Language = "es" | "en";

const STORAGE_KEY = "language";
const STORE_EVENT = "voltio:language-change";

const modules = [common, home, theory, parta, partb, quiz, sim, acoplados];

const translations: Record<Language, Record<string, string>> = {
  es: Object.assign({}, ...modules.map((m) => m.es)),
  en: Object.assign({}, ...modules.map((m) => m.en)),
};

function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "es";
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function readLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "es") return stored;
  return detectBrowserLanguage();
}

function writeLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEY, lang);
  window.dispatchEvent(new Event(STORE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(STORE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

interface LanguageContextValue {
  language: Language;
  toggle: () => void;
  setLanguage: (next: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore handles the SSR/hydration split: the server snapshot
  // ("es") matches the static export HTML, and on the client React reads the
  // real value from localStorage/navigator synchronously during hydration —
  // before paint — with no hydration warning.
  const language = useSyncExternalStore<Language>(
    subscribe,
    readLanguage,
    () => "es",
  );

  useEffect(() => {
    document.documentElement.lang = language;
    // The lang init script in layout.tsx hides the body for non-Spanish
    // users to avoid a flash from the statically baked Spanish HTML. React
    // has now committed translations in the correct language — reveal it.
    document.documentElement.removeAttribute("data-lang-pending");
  }, [language]);

  const toggle = useCallback(() => {
    writeLanguage(readLanguage() === "es" ? "en" : "es");
  }, []);

  const setLanguage = useCallback((next: Language) => {
    writeLanguage(next);
  }, []);

  const t = useCallback(
    (key: string): string => translations[language][key] ?? key,
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, toggle, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
