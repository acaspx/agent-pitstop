# Changelog

All notable changes to Agent Pit Stop. The format follows [Keep a Changelog](https://keepachangelog.com); versions follow semver. The site's month-by-month changelog lives at [/changelog](https://agent-pitstop.vercel.app/changelog) (data in `lib/changelog.ts`).

## [Unreleased]

### Added

- Landing demo: one pit stop in a believable product, built from Tool Call Card, Approval Gate and Agent Task List with Stageshow
- `/changelog` page and `/changelog.md`, generated from `lib/changelog.ts`
- Eight components (16 total): Reasoning Trace, Citation Chip + Source Drawer, Plan Review, Clarifying Question, Diff Review Card, Takeover Banner, Checkpoint, Memory Panel
- Live interactive showcase on `/components` (six tiles on the landing) with a theme and accent switcher
- A Stageshow demo at the top of each of the five principle chapters

### Changed

- Accessibility block in every component header (keyboard, screen reader, motion, host), published to `contract.json` (`a`), registry `meta.accessibility`, and each doc page; the build fails without it
- Two new contract guarantees: focus is never dropped; continuous motion stops under `prefers-reduced-motion`
- CI: axe-core over every component state, and token contrast (both themes) against WCAG AA
- Fixes: status words for screen readers in Agent Task List and Reasoning Trace; focus and announcement after Approve and Stop; Checkpoint confirm focus and Escape; named Accept, Reject, Edit and Drop buttons; Clarifying Question no longer claims radio semantics; Source Drawer closes on Escape; looping pulses hide under reduced motion
- Checkpoint accepts a controlled `confirming`; Plan Review accepts a controlled `dropped`
- Guarantee tests extended to the new components (18 total)

## [0.1.0] — 2026-07-30

The first release: a complete, principled, contract-generating design system for agent interfaces.

### Principles

- Five argued chapters with live embedded demos: Legible Thinking, Interruptibility, Delegation Contracts, Calibrated Trust, Graceful Failure
- "Rules for the pit" overview: philosophy, ten rules, anti-patterns, the headlights design language, and motion rules

### Components (8, shadcn-registry installable)

- **Legibility:** Tool Call Card, Agent Task List, Agent Roster
- **Control:** Approval Gate, Interrupt Bar, Agent Inbox
- **Trust:** Confidence Meter, Context Budget
- Every component: single file, React + Tailwind tokens + Motion only, `className` pass-through, 44px touch targets, states labeled in words

### Agent contract (generated, never hand-typed)

- `/r/<name>.json` registry items with full source; `/r/index.json` catalog; `/r/contract.json` dense mode with per-component props, principle tags, and five behavioral guarantees; `llms.txt` — all parsed from component source at build time

### Enforcement

- Interaction test suite asserting the contract's guarantees (stop preserves work, nothing irreversible without consent, bands not decimals, failures keep inputs, states never color alone); runs in CI on every PR

### Theming

- Twelve semantic tokens, dark (headlights) and light sets, both contrast-verified ≥ 4.5:1; retheme by overriding CSS variables, no component edits
- Dark/light toggle on every gallery card and component preview

### Site

- The Full Lap: every component driven through one interruptible scripted run
- How-it-works, contributor guide, component template, code of conduct, public roadmap as issues
