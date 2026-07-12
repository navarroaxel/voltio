import { ParteBProvider } from "@/store/parte-b-store";

export default function ParteBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ParteBProvider>{children}</ParteBProvider>;
}
