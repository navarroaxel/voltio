import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UIProvider } from "@/store/ui-store";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voltio — TPs de Electrotécnica I (UTN FRBA)",
  description:
    "Simuladores interactivos para los trabajos prácticos de Electrotécnica I de la UTN FRBA.",
};

// Runs before paint. Decides the active language from localStorage or the
// browser, sets <html lang>, and — if it differs from the build default
// (Spanish, baked into the static export) — sets data-lang-pending so CSS
// hides the body until React rehydrates with the right translations. The
// LanguageProvider clears the attribute once mounted. Without this, English
// users would see a flash of Spanish content before hydration commits.
const langInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("language");
    var lang;
    if (stored === "en" || stored === "es") {
      lang = stored;
    } else {
      lang = (navigator.language || "").toLowerCase().indexOf("es") === 0 ? "es" : "en";
    }
    document.documentElement.lang = lang;
    if (lang !== "es") {
      document.documentElement.setAttribute("data-lang-pending", "1");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            const stored = localStorage.getItem('theme')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (stored === 'dark' || (!stored && prefersDark)) {
              document.documentElement.classList.add('dark')
            }
          })()
        `,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <UIProvider>
          <LanguageProvider>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </LanguageProvider>
        </UIProvider>
        <Analytics />
      </body>
    </html>
  );
}
