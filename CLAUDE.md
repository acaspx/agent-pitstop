# Agent Pit Stop — agent guide

Open source design system for agent interfaces: 5 UX principles with live demos, 8 React components, shadcn-registry distribution. Site: https://agent-pitstop.vercel.app · Repo: https://github.com/acaspx/agent-pitstop

## Architecture

- `registry/<name>/<name>.tsx` — single-file components. Deps: React, Tailwind tokens, Motion. Nothing else.
- `app/components/<name>/{demo,page}.tsx` — interactive demo + doc page (uses `ComponentDoc`).
- `app/principles/*` — essay chapters (MDX) with embedded live demos; `/principles` is the rules overview.
- `app/full-lap/` — scripted run driving every component; the stop/steer/approve controls are real.
- `lib/nav.ts` — navigation + categories (Legibility, Control, Trust) + supported formats per component.
- `scripts/build-registry.mjs` — generates ALL machine artifacts from component source at build (prebuild hook): `/r/<name>.json`, `/r/index.json`, `/r/contract.json` (dense), `llms.txt`. Never hand-edit these outputs; never hand-type contract data. Descriptions, props, and principle tags are parsed from the component's header comment and Props interface.

## Conventions (enforced in review)

- Tokens only, defined in `app/globals.css` `@theme`: surfaces track/carbon/asphalt/barrier, borders line, text chalk/smoke/ash, signals pit (orange #fb923c, the accent, earned not decorative) / signal / caution / flag. No raw hex or spacing in components.
- Headlights design language: one bright thing per surface; past dims (opacity ~60%), present glows, future outlined. Feature surfaces `rounded-3xl` + `bg-dots`; components `rounded-xl`. Sibling-dim groups use `.dim-siblings`.
- Motion: micro ~150ms; entrances/collapses 250–400ms with ease `[0.32, 0.72, 0, 1]`; ambient pulses 1.2–1.4s, honest processes only. Respect reduced motion.
- State is never color alone (icon + label always). Failures keep their inputs. Stop is never destructive. Confidence renders as bands, never decimals.
- Action buttons: `min-h-9` + `pointer-coarse:min-h-11`. Every component accepts `className` merged onto the root.
- New component = 5 parts or not done: registry file, demo, doc page, `lib/nav.ts` entry, header comment with description + "Principles applied" (the contract is parsed from it). Template: `registry/_template/`.
- Contrast: ash is tuned to pass 4.5:1 on all surfaces; verify any new token pair.

## Workflow

- Branch → PR → squash merge. `npm run build` must pass (CI runs it). Vercel deploys are manual (`npx vercel --prod` from main) unless the GitHub integration has been connected.
- Writing standard: concise, concrete, claims backed by demos or scars. No filler.

## Roadmap (in priority order)

1. v0.1.0 tagged release + public announcement
2. Adapter recipes: AI SDK / LangGraph events → component props
3. Light-mode token set
4. Interaction tests asserting the contract `guarantees`
5. Figma community library
6. Components: Citation Chip (#12), Diff Review Card (#13), Handoff Banner, Streaming Text, Memory Panel
