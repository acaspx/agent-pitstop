"use client";

import { useEffect, useState } from "react";
import { AgentRoster, type RosterAgent } from "@/registry/agent-roster/agent-roster";

const frames: RosterAgent[][] = [
  [
    { id: "o", name: "Orchestrator", role: "plans and delegates", state: "working", activity: "assigning research tasks" },
    { id: "r", name: "Researcher", role: "finds and verifies sources", state: "working", activity: "reading 4 filings" },
    { id: "w", name: "Writer", role: "drafts the report", state: "waiting", activity: "waiting on research" },
    { id: "c", name: "Checker", role: "verifies claims", state: "idle" },
  ],
  [
    { id: "o", name: "Orchestrator", role: "plans and delegates", state: "waiting", activity: "monitoring the crew" },
    { id: "r", name: "Researcher", role: "finds and verifies sources", state: "blocked", activity: "paywalled source, needs a decision" },
    { id: "w", name: "Writer", role: "drafts the report", state: "working", activity: "drafting section 2 of 5" },
    { id: "c", name: "Checker", role: "verifies claims", state: "idle" },
  ],
  [
    { id: "o", name: "Orchestrator", role: "plans and delegates", state: "waiting", activity: "monitoring the crew" },
    { id: "r", name: "Researcher", role: "finds and verifies sources", state: "idle" },
    { id: "w", name: "Writer", role: "drafts the report", state: "working", activity: "drafting section 4 of 5" },
    { id: "c", name: "Checker", role: "verifies claims", state: "working", activity: "checking 11 citations" },
  ],
];

export function AgentRosterDemo() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFrame((f) => (f + 1) % frames.length), 3200);
    return () => clearInterval(t);
  }, []);

  return <AgentRoster label="Report crew" agents={frames[frame]} />;
}
