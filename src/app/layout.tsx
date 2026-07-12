import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UIProvider } from "@/store/ui-store";
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <UIProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </UIProvider>
        <Analytics />
      </body>
    </html>
  );
}
