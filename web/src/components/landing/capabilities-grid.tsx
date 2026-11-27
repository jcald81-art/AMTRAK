import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Bot,
  Cpu,
  Network,
  Radio,
  ShieldAlert,
} from "lucide-react";

const CAPABILITIES = [
  {
    title: "Multi-Agent Exploration",
    description:
      "Planner, worker, retester, and operator chat agents coordinate over a dual graph store with automatic context compaction and finding workflows.",
    href: "/function/tasks",
    routeLabel: "/function/tasks",
    icon: Bot,
  },
  {
    title: "ScopeSentry Asset Sync",
    description:
      "Import domains, subdomains, IPs, ports, sites, and endpoints directly from ScopeSentry into company-scoped asset coverage graphs.",
    href: "/function/sync",
    routeLabel: "/function/sync",
    icon: Network,
  },
  {
    title: "MITM Proxy & Repeater",
    description:
      "Embedded go-mitmproxy on 127.0.0.1:8788 records HTTP/HTTPS traffic linked to findings and supports one-click replay in the built-in Repeater.",
    href: "/function/traffic",
    routeLabel: "/function/traffic",
    icon: Activity,
  },
  {
    title: "Intercept & Approval Gate",
    description:
      "Static shell inspection and configurable intercept rules pause risky commands for operator review in-task, globally, or inside chat.",
    href: "/system/intercept",
    routeLabel: "/system/intercept",
    icon: ShieldAlert,
  },
  {
    title: "Native Multi-LLM Pool",
    description:
      "Route across Grok (xAI), Anthropic Claude, and OpenAI / Responses endpoints with per-profile rate limits, health checks, proxies, and full call recording.",
    href: "/system/llm",
    routeLabel: "/system/llm",
    icon: Cpu,
  },
  {
    title: "Remote MCP & Alerts",
    description:
      "Connect external tools via Streamable HTTP or legacy SSE MCP servers, and dispatch filtered notifications to Email, Telegram, Webhook, DingTalk, Feishu, or WeCom.",
    href: "/system/mcp",
    routeLabel: "/system/mcp",
    icon: Radio,
  },
];

export function CapabilitiesGrid() {
  return (
    <section id="capabilities" className="border-b border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 md:py-20">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Core Capabilities
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Every stage of an engagement in one workspace
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Click any module to open its interactive view inside the live AMTRAK console.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <Link
                key={cap.title}
                href={cap.href}
                className="group flex flex-col justify-between gap-5 rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/40 hover:bg-muted/30"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{cap.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground">
                  {cap.routeLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
