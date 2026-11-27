"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

const INSTALL_METHODS = [
  {
    id: "script",
    label: "One-Click Script",
    note: "Detects Docker or compiles a local embedded binary and starts AMTRAK on http://localhost:8787.",
    code: `git clone https://github.com/jcald81-art/AMTRAK.git
cd AMTRAK
./install.sh`,
  },
  {
    id: "docker",
    label: "Docker Compose",
    note: "Runs the multi-arch image (amd64/arm64) alongside PostgreSQL with ./skills and ./data persisted.",
    code: `git clone https://github.com/jcald81-art/AMTRAK.git
cd AMTRAK
cp .env.example .env
docker compose up -d`,
  },
  {
    id: "source",
    label: "Build Single Binary",
    note: "Exports the Next.js frontend statically and embeds it into a standalone Go binary.",
    code: `cd web && npm ci && npm run build:static && cd ..
mkdir -p server/webui/dist && cp -r web/out/. server/webui/dist
CGO_ENABLED=0 go build -tags embedui -o artex ./cmd/artex
./start.sh`,
  },
] as const;

export function DeploySection() {
  const [selectedId, setSelectedId] = useState<(typeof INSTALL_METHODS)[number]["id"]>("script");
  const [copied, setCopied] = useState(false);

  const method = INSTALL_METHODS.find((item) => item.id === selectedId) ?? INSTALL_METHODS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(method.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API may be unavailable in restricted contexts.
    }
  };

  return (
    <section id="deploy" className="border-b border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-20">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Self-Host
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Deploy locally in under a minute
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Requires PostgreSQL and at least one LLM key (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">XAI_API_KEY</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">ANTHROPIC_API_KEY</code>,
            or{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">OPENAI_API_KEY</code>
            ).
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <div role="tablist" aria-label="Install methods" className="flex flex-wrap gap-1.5">
              {INSTALL_METHODS.map((item) => {
                const isSelected = item.id === method.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedId(item.id);
                      setCopied(false);
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="size-3.5" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden="true" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground sm:text-sm">
            <code>{method.code}</code>
          </pre>

          <div className="border-t border-border bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
            {method.note}
          </div>
        </div>
      </div>
    </section>
  );
}
