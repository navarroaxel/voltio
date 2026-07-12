import { PartAProvider } from "@/store/parte-a-store";

export default function PartALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartAProvider>{children}</PartAProvider>;
}
