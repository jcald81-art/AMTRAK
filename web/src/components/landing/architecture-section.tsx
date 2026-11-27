import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROVIDERS = [
  {
    name: "Grok (xAI)",
    env: "XAI_API_KEY",
    format: "grok",
    defaultModel: "grok-4",
    endpoint: "https://api.x.ai/v1",
  },
  {
    name: "Anthropic Claude",
    env: "ANTHROPIC_API_KEY",
    format: "anthropic",
    defaultModel: "claude-sonnet-4",
    endpoint: "https://api.anthropic.com",
  },
  {
    name: "OpenAI / Compatible",
    env: "OPENAI_API_KEY",
    format: "openai / openai-responses",
    defaultModel: "gpt-4o / o-series",
    endpoint: "https://api.openai.com/v1",
  },
];

const PIPELINE = [
  {
    stage: "Scope & Assets",
    detail: "Company targets, ScopeSentry sync, and DSL asset filters define exact test boundaries.",
  },
  {
    stage: "Planner & Workers",
    detail: "Go agents decompose goals, invoke skills (api-recon, playwright-cli), and update the exploration graph.",
  },
  {
    stage: "Intercept & Proxy",
    detail: "Risky actions pause for approval; HTTP traffic streams through the :8788 MITM recorder.",
  },
  {
    stage: "Evidence & Retest",
    detail: "Findings are persisted in PostgreSQL + SQLite with traffic archives, reports, and automated retests.",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="border-b border-border/80 bg-muted/25">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Execution Pipeline
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Deterministic guardrails around autonomous agents
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Built in Go with an embedded Next.js static export, AMTRAK runs idempotent PostgreSQL
              schema migrations on startup and supports one-click self-updates with automatic
              rollback.
            </p>

            <div className="mt-2 flex flex-col gap-3">
              {PIPELINE.map((item) => (
                <div
                  key={item.stage}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4"
                >
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {item.stage}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Model Providers
            </p>
            <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Bring your own LLM keys or compatible gateway
            </h3>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Configure models via environment variables or the in-app LLM Configuration console,
              with per-profile rate caps, retry policies, and full request/response capture.
            </p>

            <div className="mt-2 flex flex-col gap-3">
              {PROVIDERS.map((provider) => (
                <div
                  key={provider.name}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{provider.name}</span>
                    <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {provider.format}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                    <span>{provider.env}</span>
                    <span>model: {provider.defaultModel}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/system/llm"
              className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
            >
              Inspect LLM Configuration in Console
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
