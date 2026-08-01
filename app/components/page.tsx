import { Gallery } from "./gallery";

export const metadata = {
  title: "Components — Agent Pit Stop",
  description: "Every component, with live previews in both themes. Installable via the shadcn registry.",
};

export default function ComponentsOverview() {
  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-smoke">
        Every component, live. Flip any preview between dark and light: the components
        never change, only the twelve tokens underneath them. Each installs with one
        shadcn command or copies as a single file.
      </p>

      <Gallery />
    </main>
  );
}
