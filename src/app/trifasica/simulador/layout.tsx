import { TrifasicaProvider } from "@/store/trifasica-store";

export default function SimuladorLayout({ children }: { children: React.ReactNode }) {
  return <TrifasicaProvider>{children}</TrifasicaProvider>;
}
