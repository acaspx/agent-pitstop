import { defineConfig } from "vitest/config";
import path from "node:path";
import { readdirSync } from "node:fs";

// Agents import components the way the installer lays them out (usually @/components/<name>).
// Whatever path they chose, resolve any import ending in a component's name to the real
// registry source, so the checks score behavior; the import-path check scores the path.
const slugs = readdirSync(path.resolve(__dirname, "../registry")).filter((d) => !d.startsWith("_"));
const pitstop = new RegExp(`^(?:@/|~/|\\./|\\.\\./)?(?:[\\w.-]+/)*(${slugs.join("|")})(?:\\.tsx)?$`);

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: [
      { find: pitstop, replacement: path.resolve(__dirname, "../registry/$1/$1.tsx") },
      { find: "@", replacement: path.resolve(__dirname, "..") },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [path.resolve(__dirname, "../tests/setup.ts")],
    include: [path.resolve(__dirname, "contract-use/checks.test.tsx")],
    testTimeout: 15000,
  },
});
