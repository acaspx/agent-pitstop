import { ComponentDoc } from "@/components/docs/doc-page";
import { MemoryPanelDemo } from "./demo";

export const metadata = {
  title: "Memory Panel — Agent Pit Stop",
  description: "What the agent remembers about you, where it learned it, and a way to forget.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="memory-panel"
      intro="Long-term memory is now table stakes: ChatGPT, Claude, Gemini and Meta AI all remember across chats. The products that earn trust show the memory in plain words and make forgetting easy. Memory Panel lists each memory with where it was learned, forgets with a few seconds of undo, and pauses remembering with one switch."
      chatPrompt="What do you remember about me?"
      preview={<MemoryPanelDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any agent that carries facts between sessions. Link to it wherever a remembered fact changed an answer, so the person can see why the agent knew.",
        },
        {
          heading: "Behavior",
          body: "Forget removes the row and shows Undo for undoMs (5 seconds by default); onForget fires only once that window closes. Forgetting another memory finalizes the previous one. The switch pauses new memories; existing ones still apply, and the panel says so.",
        },
        {
          heading: "Usage",
          code: `import { MemoryPanel } from "@/components/memory-panel";

<MemoryPanel
  memories={memories}
  onForget={(id) => api.forget(id)}
  paused={paused}
  onPausedChange={setPaused}
/>`,
        },
      ]}
    />
  );
}
