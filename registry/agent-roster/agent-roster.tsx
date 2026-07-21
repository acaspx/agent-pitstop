"use client";

/**
 * AgentRoster — Agent Pit Stop
 * The team sheet for multi-agent runs: who's working, who's waiting,
 * who's blocked, and on what. An orchestrator without a roster is a
 * black box with extra steps.
 *
 * Principles applied:
 * - Legible thinking: one line per agent — role, state, and current
 *   activity — never a log dump
 * - Graceful failure: a blocked agent stays on the roster with its
 *   blocker named; the team doesn't pretend to be smaller
 * - Interruptibility: the roster is the map for targeted intervention;
 *   pair rows with your stop/steer controls
 */

import { motion } from "motion/react";

export type AgentState = "working" | "waiting" | "blocked" | "idle";

export interface RosterAgent {
  id: string;
  /** Display name, e.g. "Researcher" */
  name: string;
  /** What it's for, e.g. "finds and verifies sources" */
  role?: string;
  state: AgentState;
  /** Live activity or blocker, e.g. "reading 4 filings" / "needs API key" */
  activity?: string;
}

export interface AgentRosterProps {
  agents: RosterAgent[];
  label?: string;
  /** Extra classes merged onto the root element */
  className?: string;
}

const stateMeta: Record<AgentState, { label: string; text: string; pulse: boolean }> = {
  working: { label: "Working", text: "text-pit", pulse: true },
  waiting: { label: "Waiting", text: "text-smoke", pulse: false },
  blocked: { label: "Blocked", text: "text-flag", pulse: false },
  idle: { label: "Idle", text: "text-ash", pulse: false },
};

function StateDot({ state }: { state: AgentState }) {
  const color =
    state === "working" ? "bg-pit" : state === "blocked" ? "bg-flag" : state === "waiting" ? "bg-smoke" : "bg-ash";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {stateMeta[state].pulse && (
        <motion.span
          className={`absolute inline-flex h-full w-full rounded-full ${color}`}
          animate={{ scale: [1, 2.1], opacity: [0.6, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

export function AgentRoster({ agents, label = "Crew", className }: AgentRosterProps) {
  const working = agents.filter((a) => a.state === "working").length;

  return (
    <div className={`w-full rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="text-[13px] font-medium text-chalk">{label}</span>
        <span className="font-mono text-[12px] text-smoke">
          {working}/{agents.length} working
        </span>
      </div>
      <ul className="px-4 py-1.5">
        {agents.map((agent) => {
          const meta = stateMeta[agent.state];
          return (
            <li key={agent.id} className="flex items-center gap-3 py-2.5">
              <StateDot state={agent.state} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-[13px] text-chalk">{agent.name}</span>
                  {agent.role && <span className="truncate text-[12px] text-ash">{agent.role}</span>}
                </span>
                {agent.activity && (
                  <span
                    className={`block truncate text-[12.5px] ${
                      agent.state === "blocked" ? "text-flag" : "text-smoke"
                    }`}
                  >
                    {agent.activity}
                  </span>
                )}
              </span>
              <span className={`shrink-0 text-[12px] font-medium ${meta.text}`}>{meta.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
