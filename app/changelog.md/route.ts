import { changelogMarkdown } from "@/lib/changelog";

export const dynamic = "force-static";

export function GET() {
  return new Response(changelogMarkdown("https://agent-pitstop.vercel.app"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
