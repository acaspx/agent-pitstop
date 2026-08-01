# Agent Pit Stop

**A design system for the moments where agents and humans sync.**

Agents run laps on their own. The interface moments that matter are the pit stops: approval, inspection, handoff, recovery. Agent Pit Stop is an open set of UX principles and React components for designing those moments.

Most agentic design writing covers architecture (orchestration, tool use, memory) for ML engineers. Agent Pit Stop covers the interface layer: what the human actually sees, approves, interrupts, and trusts.

## What's inside

- **Principles** — five argued essays on agent UX with live demos: legible thinking, interruptibility, delegation contracts, calibrated trust, graceful failure
- **Components** — ten production React components across Legibility, Control, and Trust, installable via the shadcn registry or copy-paste
- **The contract** — machine-readable and generated from component source at build time: [llms.txt](https://agent-pitstop.vercel.app/llms.txt), a [catalog](https://agent-pitstop.vercel.app/r/index.json), and a [dense contract](https://agent-pitstop.vercel.app/r/contract.json) with behavioral guarantees that the test suite asserts in CI
- **The Full Lap** — [every component driven through one interruptible agent run](https://agent-pitstop.vercel.app/full-lap)

## Install a component

```bash
npx shadcn@latest add https://agent-pitstop.vercel.app/r/tool-call-card.json
```

Or copy source directly from [`/registry`](./registry). Components depend only on React 19, Tailwind 4, and [Motion](https://motion.dev).

## Run the site

```bash
npm install
npm run dev
```

## Status

Five principles, ten components, three categories, dark and light themes, CI-enforced behavioral guarantees. One new piece lands weekly. Watch the repo or follow [@acaspx](https://github.com/acaspx).

## Contributing

Component proposals, fixes, and scars from real agent products are all welcome. Start with [CONTRIBUTING.md](./CONTRIBUTING.md) — it's short, and the definition of done keeps the system clean as it grows.

## License

Code is [MIT](./LICENSE). Essays and imagery are CC BY-NC 4.0.

Built by [Anton Castro](https://studio-acaspx.framer.website), a designer who has shipped agentic products since 2021 (Rocket, Augmedix, Custoria).
