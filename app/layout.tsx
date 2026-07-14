import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Pit Stop — a design system for agentic interfaces",
  description:
    "Open principles and components for the moments where agents and humans sync: approval, oversight, interruption, trust.",
  metadataBase: new URL("https://agent-pitstop.vercel.app"),
  openGraph: {
    title: "Agent Pit Stop",
    description: "An open design system for agentic interfaces.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-track font-sans text-chalk">{children}</body>
    </html>
  );
}
