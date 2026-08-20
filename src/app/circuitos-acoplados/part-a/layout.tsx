import { CircuitosAProvider } from "@/store/circuitos-a-store";

export default function PartALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CircuitosAProvider>{children}</CircuitosAProvider>;
}
