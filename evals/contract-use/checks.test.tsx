/**
 * Scores one run of the contract-use eval: the screens written by agents that saw only
 * the contract. Each prompt gets the same four general checks (it uses the component
 * the request calls for, imports it from where the installer puts it, renders, and
 * passes axe) plus the behavior the request asked for, checked by driving the real
 * components. "Compiles against the real types" is checked by scripts/eval.mjs with tsc.
 *
 * Run with: npm run eval -- <run>   (e.g. v1)
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import type { ComponentType } from "react";
import prompts from "./prompts.json";

const RUN = process.env.EVAL_RUN ?? "v1";
const modules = import.meta.glob("./runs/*/*.tsx");
const sources = import.meta.glob("./runs/*/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

type Props = Record<string, unknown>;
interface Loaded { Screen: ComponentType<Props> | null; src: string; error: string | null }

async function load(id: string): Promise<Loaded> {
  const key = `./runs/${RUN}/${id}.tsx`;
  const src = sources[key] ?? "";
  if (!modules[key]) return { Screen: null, src, error: `no output at ${key}` };
  try {
    const mod = (await modules[key]()) as { default?: ComponentType<Props> };
    return mod.default ? { Screen: mod.default, src, error: null } : { Screen: null, src, error: "no default export" };
  } catch (e) {
    return { Screen: null, src, error: `import failed: ${(e as Error).message}` };
  }
}

const pascal = (slug: string) => slug.split("-").map((p) => p[0]!.toUpperCase() + p.slice(1)).join("");
const specifiers = (src: string) => [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
const text = () => document.body.textContent ?? "";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

type Mount = (props?: Props) => ReturnType<typeof render>;
const button = (name: RegExp) => screen.getByRole("button", { name });
/** The gate's own buttons, whatever the host labelled them (approveLabel / denyLabel): approve first, deny second. */
const gateButtons = () => {
  const gate = screen.getAllByRole("group").find((g) => within(g).queryAllByRole("button").length >= 2);
  if (!gate) throw new Error("no approval gate with its two buttons");
  const [approve, deny] = within(gate).getAllByRole("button").slice(-2);
  return { approve: approve!, deny: deny! };
};

const SPECIFIC: Record<string, (mount: Mount) => void> = {
  "01-send-email": (mount) => {
    it("sends nothing until the user agrees", () => {
      const onSend = vi.fn();
      mount({ onSend });
      expect(onSend).not.toHaveBeenCalled();
    });
    it("sends exactly once on approve", () => {
      const onSend = vi.fn();
      mount({ onSend });
      fireEvent.click(gateButtons().approve);
      expect(onSend).toHaveBeenCalledTimes(1);
    });
    it("denying never sends", () => {
      const onSend = vi.fn();
      mount({ onSend });
      fireEvent.click(gateButtons().deny);
      expect(onSend).not.toHaveBeenCalled();
    });
    it("marks sending as something that can't be undone", () => {
      mount({ onSend: () => {} });
      expect(text()).toMatch(/can.t undo/i);
    });
  },

  "02-flight-search": (mount) => {
    it("shows the tool call running, in words", () => {
      mount({ onStop: () => {} });
      expect(text()).toMatch(/search_flights/);
      expect(text()).toMatch(/running/i);
    });
    it("Stop calls onStop", () => {
      const onStop = vi.fn();
      mount({ onStop });
      fireEvent.click(button(/^stop$/i));
      expect(onStop).toHaveBeenCalledTimes(1);
    });
    it("says what was kept, not the default", async () => {
      mount({ onStop: () => {} });
      fireEvent.click(button(/^stop$/i));
      expect(await screen.findByText(/stopped by you/i)).toBeTruthy();
      expect(text()).not.toMatch(/partial work kept/i);
    });
  },

  "03-invoice-confidence": (mount) => {
    it("shows the band the confidence earns (medium)", () => {
      mount({ onVerify: () => {} });
      expect(screen.getByRole("img", { name: /medium confidence/i })).toBeTruthy();
    });
    it("never prints the number", () => {
      mount({ onVerify: () => {} });
      expect(text()).not.toMatch(/0?\.62|62\s*%/);
    });
    it("checking calls onVerify", () => {
      const onVerify = vi.fn();
      mount({ onVerify });
      fireEvent.click(button(/check|verify/i));
      expect(onVerify).toHaveBeenCalledTimes(1);
    });
  },

  "04-failed-plan": (mount) => {
    it("keeps the failed step's error", () => {
      mount();
      expect(text()).toMatch(/card declined/i);
    });
    it("gives each step its true status", () => {
      mount();
      const t = text();
      expect(t.match(/Done:/g)?.length ?? 0).toBe(2);
      expect(t.match(/Failed:/g)?.length ?? 0).toBe(1);
      expect(t.match(/Not started:/g)?.length ?? 0).toBe(1);
    });
    it("names the plan", () => {
      mount();
      expect(text()).toMatch(/2\/4/);
    });
  },

  "05-plan-review": (mount) => {
    it("runs nothing before approval", () => {
      const onRun = vi.fn();
      mount({ onRun });
      expect(onRun).not.toHaveBeenCalled();
    });
    it("marks the staging step risky", () => {
      mount({ onRun: () => {} });
      const rows = screen.getAllByText(/staging/i);
      expect(rows.some((r) => /risky/i.test(r.textContent ?? ""))).toBe(true);
    });
    it("approving runs the approved steps' titles", () => {
      const onRun = vi.fn();
      mount({ onRun });
      fireEvent.click(button(/^approve plan$/i));
      expect(onRun).toHaveBeenCalledTimes(1);
      const titles = onRun.mock.calls[0]![0] as unknown;
      expect(Array.isArray(titles) && titles.length === 4 && titles.every((x) => typeof x === "string")).toBe(true);
    });
    it("a dropped step is not run", () => {
      const onRun = vi.fn();
      mount({ onRun });
      fireEvent.click(button(/^drop step \d+: .*staging/i));
      fireEvent.click(button(/^approve plan$/i));
      const titles = (onRun.mock.calls[0]?.[0] ?? []) as string[];
      expect(titles.length).toBe(3);
      expect(titles.some((t) => /staging/i.test(String(t)))).toBe(false);
    });
  },

  "06-diff-review": (mount) => {
    it("applies nothing up front", () => {
      const onApply = vi.fn();
      mount({ onApply });
      expect(onApply).not.toHaveBeenCalled();
    });
    it("accepting one change applies only that one", () => {
      const onApply = vi.fn();
      mount({ onApply });
      fireEvent.click(screen.getAllByRole("button", { name: /^accept: /i })[0]!);
      expect(onApply).toHaveBeenCalledTimes(1);
      expect(["retry", "log"]).toContain(onApply.mock.calls[0]![0]);
    });
    it("rejecting never applies", () => {
      const onApply = vi.fn();
      mount({ onApply });
      for (const b of screen.getAllByRole("button", { name: /^reject: /i })) fireEvent.click(b);
      expect(onApply).not.toHaveBeenCalled();
    });
    it("every change says what it does", () => {
      mount({ onApply: () => {} });
      const names = screen.getAllByRole("button", { name: /^accept: /i }).map((b) => b.getAttribute("aria-label") ?? "");
      expect(names.some((n) => /change \d+ in/.test(n))).toBe(false);
    });
  },

  "07-clarifying-question": (mount) => {
    it("offers both seats to tap", () => {
      mount({ onAnswer: () => {}, onSkip: () => {} });
      expect(button(/aisle/i)).toBeTruthy();
      expect(button(/window/i)).toBeTruthy();
    });
    it("returns the choice as a string", () => {
      const onAnswer = vi.fn();
      mount({ onAnswer, onSkip: () => {} });
      fireEvent.click(button(/aisle/i));
      expect(onAnswer).toHaveBeenCalledTimes(1);
      expect(typeof onAnswer.mock.calls[0]![0]).toBe("string");
      expect(String(onAnswer.mock.calls[0]![0])).toMatch(/aisle/i);
    });
    it("offers to skip, saying what the agent will do", () => {
      const onSkip = vi.fn();
      mount({ onAnswer: () => {}, onSkip });
      const skip = button(/skip/i);
      expect(skip.textContent).toMatch(/earlier/i);
      fireEvent.click(skip);
      expect(onSkip).toHaveBeenCalledTimes(1);
    });
  },

  "08-takeover": (mount) => {
    it("says it's the user's turn, and why", () => {
      mount({ onTakeOver: () => {} });
      expect(text()).toMatch(/your turn/i);
      expect(text()).toMatch(/sign/i);
    });
    it("Take over calls onTakeOver", () => {
      const onTakeOver = vi.fn();
      mount({ onTakeOver });
      fireEvent.click(button(/take over/i));
      expect(onTakeOver).toHaveBeenCalledTimes(1);
    });
    it("is announced to screen readers", () => {
      mount({ onTakeOver: () => {} });
      expect(screen.getByRole("status")).toBeTruthy();
    });
  },

  "09-cited-answer": (mount) => {
    it("shows the finished reasoning, folded", () => {
      mount();
      expect(text()).toMatch(/thought for 4s · 3 steps/i);
    });
    it("cites each claim", () => {
      mount();
      expect(screen.getAllByRole("button", { name: /^source \d+:/i }).length).toBeGreaterThanOrEqual(2);
    });
    it("flags the source it couldn't load", () => {
      mount();
      expect(screen.getByRole("button", { name: /couldn.t be reached/i })).toBeTruthy();
    });
    it("opening a source shows the passage", async () => {
      mount();
      const chips = screen.getAllByRole("button", { name: /^source \d+:/i });
      fireEvent.click(chips.find((c) => /jetblue/i.test(c.textContent ?? "")) ?? chips[0]!);
      const drawer = await screen.findByRole("complementary", { name: /sources/i });
      expect(within(drawer).getByText(/not included/i)).toBeTruthy();
    });
  },

  "10-memory": (mount) => {
    it("shows all three memories", () => {
      mount({ onForget: () => {} });
      for (const t of [/aisle/i, /SFO/, /finance@/]) expect(text()).toMatch(t);
    });
    it("deletes only after the undo window", () => {
      vi.useFakeTimers();
      const onForget = vi.fn();
      mount({ onForget });
      fireEvent.click(button(/^forget: .*aisle/i));
      expect(onForget).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(10_000);
      });
      expect(onForget).toHaveBeenCalledWith("m1");
    });
    it("Undo means nothing is deleted", () => {
      vi.useFakeTimers();
      const onForget = vi.fn();
      mount({ onForget });
      fireEvent.click(button(/^forget: .*aisle/i));
      fireEvent.click(button(/^undo$/i));
      act(() => {
        vi.advanceTimersByTime(10_000);
      });
      expect(onForget).not.toHaveBeenCalled();
    });
  },
};

// Declared after SPECIFIC so every prompt's checks exist when the suites are collected.
for (const p of prompts.prompts) {
  describe(p.id, () => {
    let L: Loaded = { Screen: null, src: "", error: "not loaded" };
    beforeAll(async () => {
      L = await load(p.id);
    });
    const mount = (props: Props = {}) => {
      if (!L.Screen) throw new Error(L.error ?? "no screen");
      const S = L.Screen;
      return render(<S {...props} />);
    };

    // ---------------------------------------------------------------- general
    it("uses the component the request calls for", () => {
      const specs = specifiers(L.src);
      for (const slug of p.components) {
        expect(specs.some((s) => s.endsWith(`/${slug}`) || s.endsWith(`/${slug}.tsx`)), `imports ${slug}`).toBe(true);
        // A hand-rolled copy with the same name defeats the point.
        expect(new RegExp(`(function|const)\\s+${pascal(slug)}\\b`).test(L.src), `does not redefine ${pascal(slug)}`).toBe(false);
      }
    });

    it("imports it from the documented install path", () => {
      const ours = specifiers(L.src).filter((s) => p.components.some((slug) => s.includes(slug)));
      expect(ours.length).toBeGreaterThan(0);
      for (const s of ours) expect(s).toMatch(/^@\/components\/[a-z-]+$/);
    });

    it("renders", () => {
      const noop = () => {};
      expect(() => mount({ onSend: noop, onStop: noop, onVerify: noop, onRun: noop, onApply: noop, onAnswer: noop, onSkip: noop, onTakeOver: noop, onForget: noop })).not.toThrow();
    });

    it("passes axe", async () => {
      const noop = () => {};
      const { container } = mount({ onSend: noop, onStop: noop, onVerify: noop, onRun: noop, onApply: noop, onAnswer: noop, onSkip: noop, onTakeOver: noop, onForget: noop });
      const r = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
      expect(r.violations.map((v) => v.id)).toEqual([]);
    });

    // ---------------------------------------------------------------- per prompt
    SPECIFIC[p.id]?.(mount);
  });
}

