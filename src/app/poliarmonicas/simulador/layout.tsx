import { PoliarmonicasProvider } from "@/store/poliarmonicas-store";

export default function SimuladorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PoliarmonicasProvider>{children}</PoliarmonicasProvider>;
}
