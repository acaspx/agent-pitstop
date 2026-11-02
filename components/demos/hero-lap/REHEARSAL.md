# Hero Lap: rehearsal notes

Built with Stageshow (benjitaylor/skills, `stageshow`), filmed with its `film.mjs`.

## Gold copied
`examples/hero-demo` for the shape (a cursor gesture with a payoff), `examples/dark-hero`
for the dark look (depth from surface steps, one lit color), `fade-crop` for the framing.

## What changed
- Pit Stop's own components inside the stage: `ToolCallCard`, `ApprovalGate`,
  `AgentTaskList`. The kit's frames, cursor and motion parts (`Window`, `Collapse`,
  `States`, `Stream`) do their jobs around them.
- Look: Pit Stop tokens mapped onto `--ss-*` in `hero-lap.css` (Geist, papaya accent,
  carbon/asphalt/track surfaces).
- Framing, wide (976 x 460): the window spans the column and fades out at its foot over
  the composer. No plate: the page is the ground.
- Framing, compact (358 x 330): the window bleeds off the right and bottom so it keeps a
  desktop's shape; the thread keeps only the stop itself (gate, receipt, reply, booked fare).
- Playback: `play="once"` in view, poster = the booked state, Replay remounts it.
- Kit change: `kit/stage.css` exempts `[data-ss-host]` subtrees from the host-element
  reset, which otherwise wipes Tailwind v4 utilities on the components' `li`/`button`.

## Beats
1. `hold_seat` lands Done, the plan ticks Hold seat, the fare turns Held.
2. The agent stops: the Approval Gate opens, Book flight goes active.
3. The cursor presses Approve.
4. The gate folds to its receipt, Book flight ticks, the fare turns Booked, the agent's
   reply streams in. Holds.

## Findings left as they are
- `tight stack`, `uneven padding`, the `Running`→`Done` label width jump, task-icon
  swaps, and the gate's collapse (a ~250ms near-empty frame between "Waiting for you"
  and the receipt) all come from the components' own markup and motion. They are the
  product's real behavior, so the demo shows them as they ship. Worth fixing in the
  components themselves (the gate could crossfade to its receipt instead of collapsing
  to zero height first).
- `kit override .ss-phone…`: no phone is used; reported from the kit CSS bundle.
- Hydration mismatch during filming: from the film script's injected attribute; a plain
  page load logs no errors.

## Not checked
- Real Safari and iOS Safari. Light theme (the site's theme toggle doesn't reach the
  landing).
