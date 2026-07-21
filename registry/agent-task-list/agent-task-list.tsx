"use client";

/**
 * AgentTaskList — Agent Pit Stop
 * The agent's plan, made visible: what it will do, what it's doing,
 * what's done, and what broke.
 *
 * Principles applied:
 * - Legible thinking: the plan is shown before execution, not narrated after
 * - Latency choreography: one active task with live status beats a spinner
 * - Graceful failure: a failed step stays in the list with its error attached;
 *   the plan is the recovery UI
 */

import { AnimatePresence, motion } from "motion/react";

export type AgentTaskStatus = "pending" | "active" | "done" | "failed";

export interface AgentTask {
  title: string;
  status: AgentTaskStatus;
  /** Live sublabel while active, or error text when failed */
  detail?: string;
}

export interface AgentTaskListProps {
  /** Short label for the overall plan, e.g. "Booking your trip" */
  label?: string;
  tasks: AgentTask[];
  /** Extra classes merged onto the root element */
  className?: string;
}

function StatusIcon({ status }: { status: AgentTaskStatus }) {
  if (status === "done") {
    return (
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <circle cx="7" cy="7" r="6.25" className="stroke-signal" strokeWidth="1.5" />
        <motion.path
          d="M4.5 7.2L6.2 9l3.3-3.8"
          className="stroke-signal"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      </motion.svg>
    );
  }
  if (status === "failed") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6.25" className="stroke-flag" strokeWidth="1.5" />
        <path d="M5 5l4 4M9 5l-4 4" className="stroke-flag" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "active") {
    return (
      <span className="relative inline-flex h-[14px] w-[14px] items-center justify-center">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full border border-pit"
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="inline-flex h-[7px] w-[7px] rounded-full bg-pit" />
      </span>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.25" className="stroke-line" strokeWidth="1.5" />
    </svg>
  );
}

export function AgentTaskList({ label, tasks, className }: AgentTaskListProps) {
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <div className={`w-full rounded-xl border border-line bg-asphalt ${className ?? ""}`}>
      {label && (
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="text-[13px] font-medium text-chalk">{label}</span>
          <span className="font-mono text-[12px] text-ash">
            {done}/{tasks.length}
          </span>
        </div>
      )}
      <ul className="px-4 py-1.5">
        {tasks.map((task) => (
          <li key={task.title} className="flex items-start gap-3 py-2">
            <span className="mt-0.5 shrink-0">
              <StatusIcon status={task.status} />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block text-[13px] transition-colors duration-300 ${
                  task.status === "done"
                    ? "text-smoke"
                    : task.status === "pending"
                      ? "text-ash"
                      : "text-chalk"
                }`}
              >
                {task.title}
              </span>
              <AnimatePresence initial={false}>
                {task.detail && (task.status === "active" || task.status === "failed") && (
                  <motion.span
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`block overflow-hidden text-[12px] ${
                      task.status === "failed" ? "text-flag" : "text-ash"
                    }`}
                  >
                    {task.detail}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
