import { ComponentDoc } from "@/components/docs/doc-page";
import { AgentRosterDemo } from "./demo";

export const metadata = {
  title: "Agent Roster — Agent Pit Stop",
  description: "The team sheet for multi-agent runs: who's working, who's waiting, who's blocked, and on what.",
};

export default function Page() {
  return (
    <ComponentDoc
      slug="agent-roster"
      intro="Multi-agent products love to say 'a team of agents is working for you' and then show a spinner. The roster is the team sheet: one line per agent with its role, state, and live activity. A blocked agent stays on the sheet with its blocker named, because a team that hides its stuck members isn't a team you can manage."
      chatPrompt="Put a crew on the competitive report."
      preview={<AgentRosterDemo />}
      sections={[
        {
          heading: "When to use",
          body: "Orchestrator-and-workers runs where more than one agent acts at once. For a single agent, use the Agent Task List instead; a roster of one is an org chart for a solo founder.",
        },
        {
          heading: "Behavior",
          body: "Four states: working (pulsing), waiting, blocked, idle. Every state is written in words next to its dot. Blocked rows name the blocker in the activity line and read as the human's cue to intervene; pair with the Interrupt Bar for targeted steering.",
        },
        {
          heading: "Usage",
          code: `import { AgentRoster } from "@/components/agent-roster";

<AgentRoster
  label="Report crew"
  agents={[
    { id: "r", name: "Researcher", state: "working", activity: "reading 4 filings" },
    { id: "w", name: "Writer", state: "waiting", activity: "waiting on research" },
  ]}
/>`,
        },
      ]}
    />
  );
}
