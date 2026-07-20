# Contributing to Agent Pit Stop

Thanks for pulling into the pit. This doc is the whole contract: what a contribution needs to be, and how it gets in.

## What we accept

- **New components** — patterns for agent↔human sync moments. Propose first via a [component proposal issue](.github/ISSUE_TEMPLATE/component-proposal.md) so we agree on scope before you build.
- **Improvements** to existing components: accessibility, states, API clarity, motion.
- **Fixes** — bugs, typos, broken demos. No proposal needed; just PR.
- **Principle chapters** are held to the highest bar: a real claim plus a working component as evidence. Open a discussion before writing one.

## Definition of done (components)

Every component PR ships all five, or it isn't done:

1. **Registry component** — one self-contained file in `registry/<name>/<name>.tsx`. Dependencies: React, Tailwind, Motion. Nothing else.
2. **Demo** — `app/components/<name>/demo.tsx`, interactive, showing every state.
3. **Doc page** — `app/components/<name>/page.tsx` using `ComponentDoc`: intro, when to use, behavior, usage snippet.
4. **Registrations** — entry in `lib/nav.ts` (category + supported formats) and `scripts/build-registry.mjs` (title + description).
5. **Principles applied** — a header comment citing which principles the component applies, and honest adherence to them: state never by color alone, failures keep their inputs, interruptions acknowledged.

## Code standards

- TypeScript strict; exported props interfaces with doc comments on every prop.
- Design tokens only (`bg-asphalt`, `text-smoke`, `var(--color-pit)`); no hardcoded colors or spacing.
- Accessible by default: keyboard operable, `aria-*` where state changes, honest labels.
- Motion is choreography, not decoration: durations ≤ 400ms, respect the existing easing vocabulary.
- Components must work in every format they declare (`web`, `mobile`, `chat`, `cli`).

## How changes land

1. Fork, branch from `main` (`feat/<name>` or `fix/<name>`).
2. `npm install && npm run dev` to work; `npm run build` must pass clean.
3. Open a PR using the template. CI runs the build; a maintainer reviews for principle adherence, not just code.
4. Squash-merged. Releases roll weekly.

## Writing standards (docs and chapters)

Concise and concrete. Every sentence earns the next; no filler, no "delightful experiences." Claims need either a demo or a scar behind them. If a paragraph could appear in any design system's docs, cut it.

## Questions

Open a [discussion](https://github.com/acaspx/agent-pitstop/discussions) or an issue. Telling us which sync moment your product struggles with is itself a contribution; it drives the roadmap.
