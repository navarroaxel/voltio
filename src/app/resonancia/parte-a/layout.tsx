import { ParteAProvider } from "@/store/parte-a-store";

export default function ParteALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ParteAProvider>{children}</ParteAProvider>;
}
