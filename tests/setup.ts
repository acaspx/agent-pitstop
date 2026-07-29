import { MotionGlobalConfig } from "motion/react";

// animations resolve instantly in tests, so AnimatePresence exits complete
// and receipts/state changes are assertable synchronously
MotionGlobalConfig.skipAnimations = true;

// jsdom shims for Motion
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
