"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const SCREENSHOTS = [
  {
    id: "dashboard",
    label: "Dashboard",
    route: "/dashboard",
    src: "/screenshots/dashboard.png",
    caption: "Live overview of active tasks, token consumption, severity distribution, and real-time activity.",
  },
  {
    id: "graph",
    label: "Exploration Graph",
    route: "/function/tasks",
    src: "/screenshots/graph.png",
    caption: "Interactive agent exploration graph tracking planner intents, worker executions, and discovered paths.",
  },
  {
    id: "findings",
    label: "Findings",
    route: "/function/findings",
    src: "/screenshots/findings.png",
    caption: "Deduplicated vulnerability cases with reproduction evidence, traffic archives, and automated retesting.",
  },
  {
    id: "assets",
    label: "Asset Coverage",
    route: "/function/assets",
    src: "/screenshots/assets_test.png",
    caption: "Force-directed asset coverage graph synced from ScopeSentry with tested-node highlighting.",
  },
  {
    id: "traffic",
    label: "Traffic Proxy",
    route: "/function/traffic",
    src: "/screenshots/traffic.png",
    caption: "Built-in MITM HTTP/HTTPS proxy on :8788 with full request/response capture and repeater.",
  },
  {
    id: "intercept",
    label: "Intercept Approvals",
    route: "/system/intercept",
    src: "/screenshots/intercept.png",
    caption: "Human-in-the-loop command interception and approval records for high-impact tool calls.",
  },
  {
    id: "chat",
    label: "Operator Chat",
    route: "/chat",
    src: "/screenshots/chat.png",
    caption: "Direct operator chat with running agents, inline approval cards, and targeted @-mentions.",
  },
] as const;

export function HeroSection() {
  const [activeId, setActiveId] = useState<(typeof SCREENSHOTS)[number]["id"]>("dashboard");
  const active = SCREENSHOTS.find((item) => item.id === activeId) ?? SCREENSHOTS[0];

  return (
    <section id="platform" className="border-b border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 md:py-24">
        <div className="flex max-w-3xl flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-foreground" aria-hidden="true" />
            <span>Go Backend + Next.js 16 Console · Native Grok, Claude &amp; OpenAI</span>
          </div>

          <h1 className="text-balance font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Autonomous penetration testing in a single self-hosted binary.
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            AMTRAK pairs an event-driven multi-agent exploration engine with a built-in MITM traffic
            proxy, ScopeSentry asset sync, and human-in-the-loop approval gates—all manageable from
            one unified console.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Launch Live Console
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/function/tasks">Explore Tasks</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#deploy">Install Self-Hosted</a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            role="tablist"
            aria-label="AMTRAK console views"
            className="flex flex-wrap items-center gap-1.5"
          >
            {SCREENSHOTS.map((item) => {
              const isSelected = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(item.id)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-foreground/30" aria-hidden="true" />
                <span>amtrak{active.route}</span>
              </div>
              <Link
                href={active.route}
                className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:underline"
              >
                Open live view
                <ExternalLink className="size-3" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative aspect-[16/9] w-full bg-muted/20">
              <img
                src={active.src}
                alt={`AMTRAK ${active.label} console interface`}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              {active.caption}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
