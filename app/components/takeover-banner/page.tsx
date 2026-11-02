import { ComponentDoc } from "@/components/docs/doc-page";
import { TakeoverBannerDemo } from "./demo";

export const metadata = {
  title: "Takeover Banner — Agent Pit Stop",
  description: "Who has the wheel when an agent drives a browser, and the one-click handoff.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="takeover-banner"
      intro="Computer-using agents like ChatGPT agent and Claude for Chrome share a screen with the person, which raises one constant question: who is driving right now? Takeover Banner answers it in four states. The agent hands over for sign-ins and payments and says why; the person takes over in one click, and while they drive the banner says the agent can't see."
      chatPrompt="Book the JetBlue fare we picked."
      preview={<TakeoverBannerDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Any agent that acts in a browser, desktop app, or remote session the person can also touch. Pin it to the edge of that surface, not inside the chat, so it stays visible while the person works.",
        },
        {
          heading: "Behavior",
          body: "agent: Take over is quiet but always present. needs-you: caution border and a primary Take over, with the reason. you: success border, Hand back, and the privacy note. resuming: the agent says what it's checking before it acts again. Announced politely to screen readers.",
        },
        {
          heading: "Usage",
          code: `import { TakeoverBanner } from "@/components/takeover-banner";

<TakeoverBanner
  state={state}
  reason="Sign in to continue. I don't type passwords."
  onTakeOver={() => session.pauseAgent()}
  onHandBack={() => session.resumeAgent()}
/>`,
        },
      ]}
    />
  );
}
