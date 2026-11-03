# Accessibility

Agent Pit Stop is built mostly for coding agents to assemble interfaces from. So accessibility has two audiences: the person using the finished interface, and the agent writing it. Each component guarantees what it can on its own. Its contract tells the agent the rest: what the host code has to do for those guarantees to hold.

## Where it lives

Each component's header comment has an `Accessibility:` block with four lines:

| Line | What it says |
| --- | --- |
| Keyboard | What can be operated, and with which keys |
| Screen reader | Roles, names, and what is announced when state changes |
| Motion | What moves, and what stops under `prefers-reduced-motion` |
| Host | What the code using the component must do (the line agents most need) |

The registry build reads that block and publishes it three ways: the `a` field per component in [`/r/contract.json`](https://agent-pitstop.vercel.app/r/contract.json), `meta.accessibility` in each registry item, and the Accessibility section on each component's doc page. There is one source, so the three can't disagree, and the build fails if a component is missing any of the four lines.

## System guarantees

These hold for every component and are listed in the contract's `guarantees`:

- **State is never communicated by color alone.** Every state has a word. Where the word isn't visible (a step icon), it is still read to screen readers.
- **Focus is never dropped.** When a control goes away after use (Approve, Stop, a restore confirm), focus moves to what replaced it, and the change is announced.
- **Continuous motion stops under `prefers-reduced-motion`.** The only looping animations are the status pulses, and they hide. Everything else is a short opacity or height transition (400 ms or less).
- **Nothing irreversible without explicit consent.** Consent buttons never take focus on their own, so a stray Enter can't approve anything.

## How it's enforced

| Check | What it catches | Where |
| --- | --- | --- |
| axe-core over every component, in the states that matter | Missing names, invalid roles and ARIA, list and landmark structure | `tests/a11y.test.tsx`, in CI |
| Guarantee tests | Focus moves after Approve, Stop and Restore; Escape backs out; state words; consent | `tests/guarantees.test.tsx`, in CI |
| Source check | A looping animation without `motion-reduce:hidden` | `tests/guarantees.test.tsx`, in CI |
| Contrast from the tokens | Any allowed text/surface pair below WCAG AA (4.5:1), in both themes | `scripts/check-contrast.mjs`, in CI |
| Header block | A component missing any of its four accessibility lines | `scripts/build-registry.mjs`, at build |

axe runs in jsdom, which has no layout or paint, so it can't check contrast. Contrast is computed straight from the token values instead.

## Color contrast

All text pairs below are computed from `app/globals.css`, for both themes, against WCAG AA for normal text (4.5:1). The page surfaces (`track`, `carbon`, `asphalt`) accept any text token.

`barrier` is the raised fill used for chips, the selected tab and chat bubbles. By rule it carries only `chalk` and `smoke`: `ash` and the light theme's status colors fall under 4.5:1 on it. Those pairs are shown in parentheses and aren't allowed. Status color is never the only signal anyway, since every state also has a word.

Regenerate this table with `npm run contrast -- --write`.

<!-- contrast:start -->
| Theme | Text token | track | carbon | asphalt | barrier |
| --- | --- | ---: | ---: | ---: | ---: |
| Dark | chalk `#ececf1` | 16.8 | 16.4 | 15.7 | 13.9 |
| Dark | smoke `#9a9aa3` | 7.1 | 6.9 | 6.6 | 5.9 |
| Dark | ash `#7f7f8a` | 5.0 | 4.9 | 4.7 | (4.1) not allowed |
| Dark | signal `#34d399` | 10.3 | 10.0 | 9.6 | (8.5) not allowed |
| Dark | caution `#fde047` | 15.0 | 14.6 | 14.1 | (12.4) not allowed |
| Dark | flag `#f87171` | 7.2 | 7.0 | 6.7 | (5.9) not allowed |
| Dark | pit `#fb923c` | 8.7 | 8.5 | 8.2 | (7.3) not allowed |
| Light | chalk `#17171a` | 16.7 | 17.3 | 17.9 | 15.4 |
| Light | smoke `#4b4b55` | 8.0 | 8.3 | 8.6 | 7.4 |
| Light | ash `#6d6d78` | 4.8 | 4.9 | 5.1 | (4.4) not allowed |
| Light | signal `#047857` | 5.1 | 5.3 | 5.5 | (4.7) not allowed |
| Light | caution `#a16207` | 4.6 | 4.8 | 4.9 | (4.2) not allowed |
| Light | flag `#dc2626` | 4.5 | 4.7 | 4.8 | (4.2) not allowed |
| Light | pit `#b45309` | 4.7 | 4.9 | 5.0 | (4.3) not allowed |
<!-- contrast:end -->

## Screen-reader pass

Automated checks prove structure, not experience. Run the script below with VoiceOver (macOS, Safari) on the live site, then record what happened here.

1. `/components/approval-gate`: Tab to Approve, press Enter. Expect the receipt to be read and focused.
2. `/components/interrupt-bar`: type a steer and press Enter (expect the acknowledgment). Then Tab to Stop and press Enter (expect "Stopped by you" and focus on it).
3. `/components/agent-task-list`: read the list. Expect each step to start with its status.
4. `/components/diff-review-card`: Tab through the buttons. Expect each to name its hunk. Read a hunk and expect "Removed" and "Added".
5. `/components/checkpoint`: activate a Restore. Expect focus on the confirm, then press Escape.
6. `/components/clarifying-question`: press 2. Expect "You chose …".
7. `/components/takeover-banner`: switch states. Expect each change to be announced.

| Date | Reader + browser | Finding | Fixed in |
| --- | --- | --- | --- |
| | | Not run yet | |

## Known limits

- Only the status pulses respect reduced motion explicitly. The remaining transitions are short fades and height changes, which reduced-motion guidance allows. If your product needs no motion at all, wrap the app in Motion's `<MotionConfig reducedMotion="user">`.
- Number-key shortcuts in Clarifying Question are ignored while a text field has focus, but any other page-level shortcut on 1–9 will clash with them.
- The components don't trap focus or manage dialogs, because none of them is a modal. If you put one in a dialog, the dialog owns focus.
