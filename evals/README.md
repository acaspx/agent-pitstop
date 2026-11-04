# Evals

Agent Pit Stop is built mostly for coding agents. These evals test whether agents actually build correct interfaces with it. Results are published at [/evals](https://agent-pitstop.vercel.app/evals).

## contract-use

Can an agent build correct screens from the contract alone?

| Path | What it is |
| --- | --- |
| `contract-use/prompts.json` | Ten product requests, each with the screen's exact signature |
| `contract-use/agent-brief.md` | The brief every agent gets, word for word |
| `contract-use/contracts/<run>/` | The `llms.txt` and `contract.json` that run's agents read, frozen |
| `contract-use/runs/<run>/` | What the agents wrote, saved verbatim, plus `meta.json` (model, date) |
| `contract-use/runs/reference/` | Hand-written answers proving every check can pass (not an agent run) |
| `contract-use/checks.test.tsx` | The checks: right component, documented import path, renders, axe, and each request's behavior |
| `contract-use/results/<run>.json` | Scores, written by the scorer and read by the site |

Score a run with:

```bash
npm run eval -- v2
```

The scorer (`scripts/eval.mjs`) compiles every screen with strict `tsc` against the real component types, then runs the checks against the real components.

### Adding a run

1. Freeze the contract: copy `public/r/contract.json` and `public/llms.txt` into `contracts/<run>/`.
2. Give each prompt to a fresh agent with `agent-brief.md`, pointing it at that folder. Allow no other files.
3. Save each reply's code as `runs/<run>/<prompt id>.tsx`, unedited, and add a `meta.json`.
4. Run `npm run eval -- <run>`, and add the run to `lib/evals.ts` if it should be compared on the site.

### Rules

- Don't change the prompts to make a run pass. Fix the system they point at.
- If a check turns out to be wrong, fix it, rescore every earlier run, and say so in the results' method notes.
