import { ComponentDoc } from "@/components/docs/doc-page";
import { CheckpointDemo } from "./demo";

export const metadata = {
  title: "Checkpoint — Agent Pit Stop",
  description: "Save points for an agent run, and a confirmed way back to any of them.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="checkpoint"
      intro="Cursor checkpoints and Claude Code's rewind made the same bet: people delegate more when undo is cheap. Checkpoint lists a run's save points, newest first, and restores to any of them after one inline confirmation that names exactly what will be undone. A bad turn costs a step, not the run."
      chatPrompt="That refactor broke things. Can we go back?"
      preview={<CheckpointDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Runs that change files, records, or documents across several steps. Save a checkpoint at each point where things were known good: tests passing, a draft approved, before a risky step.",
        },
        {
          heading: "Behavior",
          body: "The current checkpoint is marked You are here. Restore on any other opens an inline confirm: \"This undoes ...\" with Restore and Keep going. Restoring moves the marker. Works controlled (pass current) or uncontrolled.",
        },
        {
          heading: "Usage",
          code: `import { Checkpoint } from "@/components/checkpoint";

<Checkpoint
  checkpoints={[
    { id: "c2", label: "Refactored client", time: "just now" },
    { id: "c1", label: "Tests passing", time: "4 min ago", undoes: "the refactor" },
  ]}
  onRestore={(id) => agent.restore(id)}
/>`,
        },
      ]}
    />
  );
}
