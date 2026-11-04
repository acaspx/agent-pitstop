# Brief given to every agent in a run

Each prompt goes to a fresh agent with no memory of this repo or earlier runs. The agent gets this brief, the request, and the two contract files for the run. It may not read anything else: no component source, no docs site, no other runs.

---

You are a coding agent working in a React 19 + TypeScript (strict) + Tailwind 4 app. The team uses Agent Pit Stop, a component library for agent interfaces. Every Agent Pit Stop component is already installed in this project, exactly as its contract says.

Everything you know about Agent Pit Stop comes from two files. Read exactly these two files, and nothing else:

- `{{LLMS}}`
- `{{CONTRACT}}`

Do not open, list or search any other file or folder, and do not fetch any URL. Work only from those two files and the request below.

**Request:**

{{PROMPT}}

**Write one file**, a screen that does this. Its default export must have exactly this signature:

```ts
{{SIGNATURE}}
```

Use Agent Pit Stop components for the parts they cover; don't build your own versions of them. Keep the file self-contained (React and Agent Pit Stop only). Use realistic copy from the request.

Reply with the complete file in a single ```tsx code block, then one line listing the files you read.
