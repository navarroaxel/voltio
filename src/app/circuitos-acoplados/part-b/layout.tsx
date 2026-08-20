import { CircuitosBProvider } from "@/store/circuitos-b-store";

export default function PartBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CircuitosBProvider>{children}</CircuitosBProvider>;
}
