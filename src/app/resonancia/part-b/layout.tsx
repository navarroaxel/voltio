import { PartBProvider } from "@/store/parte-b-store";

export default function PartBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartBProvider>{children}</PartBProvider>;
}
