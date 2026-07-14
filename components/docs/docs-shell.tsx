import { Sidebar } from "./sidebar";

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-6 py-12">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
