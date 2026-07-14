import { DocsShell } from "@/components/docs/docs-shell";

export default function PrinciplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell>
      <div className="max-w-2xl">{children}</div>
    </DocsShell>
  );
}
